"use server";

import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import { connectDB } from "@/app/(backend)/Config/db";
import Donor from "@/app/(backend)/Model/Donor";

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const JWT_SECRET = process.env.JWT_SECRET!;

// Dynamically determine the redirect URI based on environment
const REDIRECT_URI = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google/callback`
  : `http://localhost:3000/api/auth/google/callback`;

// Generate the Google OAuth URL
export async function getGoogleAuthURL() {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: REDIRECT_URI,
    client_id: GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  const queryString = new URLSearchParams(options).toString();
  return `${rootUrl}?${queryString}`;
}

// Exchange code for tokens
export async function getGoogleTokens(code: string) {
  const url = "https://oauth2.googleapis.com/token";
  const values = {
    code,
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Google token error response:", errorData);
      throw new Error(`Failed to get Google tokens: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting Google tokens:", error);
    throw new Error("Failed to get Google tokens");
  }
}

// Get user info from Google
export async function getGoogleUserInfo(access_token: string) {
  try {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get user info: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting Google user info:", error);
    throw new Error("Failed to get Google user info");
  }
}

// Handle Google login
export async function handleGoogleLogin(code: string) {
  try {
    // Exchange code for tokens
    const { access_token } = await getGoogleTokens(code);

    if (!access_token) {
      console.error("No access token received from Google");
      return {
        success: false,
        error: "Authentication failed: No access token",
      };
    }

    // Get user info
    const googleUser = await getGoogleUserInfo(access_token);

    if (!googleUser || !googleUser.email) {
      console.error("Invalid user data from Google:", googleUser);
      return {
        success: false,
        error: "Authentication failed: Invalid user data",
      };
    }

    // Connect to database
    await connectDB();

    // Find or create user
    let donor = await Donor.findOne({ email: googleUser.email });

    if (!donor) {
      // Create new donor with Google info
      donor = await Donor.create({
        fullName: googleUser.name,
        email: googleUser.email,
        ProfilePhoto: googleUser.picture,
        // No password needed for Google auth
        isVerified: true, // Google users are already verified
        authProvider: "google", // Mark as Google authenticated
      });
    } else if (!donor.isVerified) {
      // If user exists but isn't verified, mark as verified since Google auth confirms email
      donor.isVerified = true;
      donor.authProvider = "google";
      await donor.save();
    }

    // Create JWT token with additional Google info
    const token = jwt.sign(
      {
        userId: donor._id.toString(),
        email: donor.email,
        authProvider: "google", // Mark this as a Google-authenticated user
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set JWT token in cookies
    // const cookieStore = await cookies()
    // cookieStore.set("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   maxAge: 7 * 24 * 60 * 60, // 7 days
    //   path: "/",
    // })
    return { success: true, userId: donor._id.toString(), token };
  } catch (error) {
    console.error("Google login error:", error);
    return { success: false, error: "Authentication failed" };
  }
}

// Initiate Google login
export async function initiateGoogleLogin() {
  const authUrl = await getGoogleAuthURL();
  redirect(authUrl);
}

// src/app/(backend)/api/EventOrganizer/helper/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other services like SendGrid, Outlook, etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your app password (not your personal password)
  },
});

const url = process.env.VERCEL_URL || "http://localhost:3000";

// Helper functions - moved to helpers directory
async function sendVerificationEmail(email: string, token: string) {
  const verificationLink = `${url}/Verification/EventOrganizer?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email",
    html: `<p>Please verify your email by clicking the link below:</p>
           <a href="${verificationLink}">Verify Email</a>`,
  };

  await transporter.sendMail(mailOptions);
}

async function sendResetPasswordEmail(email: string, token: string) {
  const resetLink = `${url}/ResetPassword/EventOrganizer?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Password",
    html: `<p>Click the link below to reset your password:</p>
           <a href="${resetLink}">Reset Password</a>`,
  };

  await transporter.sendMail(mailOptions);
}

// Route handlers - required for Next.js API routes
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, token, action } = body;

    if (!email || !token) {
      return NextResponse.json(
        { success: false, message: "Email and token are required" },
        { status: 400 }
      );
    }

    if (action === "verify") {
      await sendVerificationEmail(email, token);
    } else if (action === "reset") {
      await sendResetPasswordEmail(email, token);
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid action" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send email" },
      { status: 500 }
    );
  }
}
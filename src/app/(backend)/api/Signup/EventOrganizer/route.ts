import { NextResponse } from "next/server";
import EventOrganizer from "../../../Model/EventOrganizer";
import { connectDB } from "../../../Config/db";
import { sendVerificationEmail } from "../../../api/EventOrganizer/utils/emailUtils";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      EventOrganizerName,
      email,
      password,
      organizationName,
      type,
      number,
    } = body;

    // Validate input fields
    if (
      !EventOrganizerName ||
      !email ||
      !password ||
      !organizationName ||
      !type ||
      !number
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Basic format validations
    if (EventOrganizerName.length < 3 || EventOrganizerName.length > 100) {
      return NextResponse.json(
        { error: "Event organizer name must be 3-100 characters long" },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    if (!["corporate", "Non-Profit", "other"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid organization type" },
        { status: 400 }
      );
    }

    if (!/^\+?[0-9]{7,15}$/.test(number)) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await EventOrganizer.findOne({ email });

    if (existingUser) {
      if (!existingUser.isVerified) {
        await EventOrganizer.deleteOne({ email });
      } else {
        return NextResponse.json(
          { error: "User already exists" },
          { status: 400 }
        );
      }
    }

    // Generate verification token
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    // Create new user
    const newEventOrganizer = await EventOrganizer.create({
      EventOrganizerName,
      email,
      password,
      organizationName,
      type,
      number,
      verificationToken,
      isVerified: false,
    });

    // Log the created user for debugging
    console.log("🛠️ Created EventOrganizer:", newEventOrganizer);

    await sendVerificationEmail(email, verificationToken);

    // Schedule deletion after 1 hour
    setTimeout(async () => {
      const user = await EventOrganizer.findOne({ email });
      if (user && !user.isVerified) {
        await EventOrganizer.deleteOne({ email });
        console.log(`Deleted unverified user: ${email}`);
      }
    }, 60 * 60 * 1000);

    return NextResponse.json(
      { message: "User registered. Check email for verification." },
      { status: 201 }
    );
  } catch (error: unknown) {
    // Handle unknown error type
    if (error instanceof Error) {
      console.error("Server Error:", error.message);
      return NextResponse.json(
        { error: error.message || "Internal Server Error" },
        { status: 500 }
      );
    }

    // Fallback for unexpected error type
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

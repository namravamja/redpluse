import { NextResponse } from "next/server";
import BloodBank from "../../../Model/BloodBank";
import { connectDB } from "../../../Config/db";
import { sendVerificationEmail } from "../../BloodBank/utils/emailUtils";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await connectDB();
    const {
      BloodBankName,
      email,
      password,
      licenceNumber,
      phone,
      helplineNumber,
      contactPerson,
      state,
      city,
      pincode,
      address,
      parentHospital,
      category,
    } = await req.json();

    // Check if user already exists
    const existingUser = await BloodBank.findOne({ email });

    if (existingUser) {
      // If user exists but isn't verified, delete them before re-registering
      if (!existingUser.isVerified) {
        await BloodBank.deleteOne({ email });
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
    const newBloodBank = await BloodBank.create({
      BloodBankName,
      email,
      password,
      licenceNumber,
      phone,
      helplineNumber,
      contactPerson,
      state,
      city,
      pincode,
      address,
      parentHospital,
      category,
      isVerified: false, // User needs to verify before logging in
    });

    console.log(newBloodBank);

    console.log(" Generated Token:", verificationToken);

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    // Schedule deletion if user isn't verified after 1 hour
    setTimeout(async () => {
      const user = await BloodBank.findOne({ email });
      if (user && !user.isVerified) {
        await BloodBank.deleteOne({ email });
        console.log(`🚨 Deleted unverified user: ${email}`);
      }
    }, 60 * 60 * 1000); // 1 hour

    return NextResponse.json(
      { message: "User registered. Check email for verification." },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

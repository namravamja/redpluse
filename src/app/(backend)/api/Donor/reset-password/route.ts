import { NextResponse } from "next/server";
import Donor from "../../../Model/Donor";
import { connectDB } from "../../../Config/db";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { newPassword, token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Token is missing" }, { status: 400 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const email = (decoded as { email: string }).email;

    const user = await Donor.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.resetPasswordToken !== token) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    if (new Date(user.resetPasswordExpire) < new Date()) {
      return NextResponse.json({ error: "Token has expired" }, { status: 400 });
    }

    user.password = newPassword;

    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

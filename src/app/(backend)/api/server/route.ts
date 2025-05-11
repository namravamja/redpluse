import { NextResponse } from "next/server";
import Donor from "../../Model/Donor";
import { connectDB } from "../../Config/db"; // Import your DB connection

export async function GET() {
  try {
    await connectDB();

    const newUser = await Donor.create({
      name: "John Doe",
      email: "john@example.com",
      bloodType: "O+",
    });

    return NextResponse.json({ message: "User created!", user: newUser });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
  }
}
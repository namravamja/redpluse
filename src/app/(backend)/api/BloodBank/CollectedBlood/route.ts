import { NextResponse } from "next/server";
import User from "../../../Model/BloodBank";
import { connectDB } from "../../../Config/db";
import { verifyUser } from "../../../Middleware/authMiddleware";

connectDB();

interface DonorRequestBody {
  bloodGroup: string;
  collectedFrom: string;
  date: string;
  donorName: string;
  donorEmail: string;
  phoneNumber: string;
  quantity: number;
}

export async function POST(req: Request) {
  try {
    const {
      bloodGroup,
      collectedFrom,
      date,
      donorName,
      donorEmail,
      phoneNumber,
      quantity,
    }: DonorRequestBody = await req.json();

    const userId = await verifyUser();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is missing" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId).select("collectedBloodDetails");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await User.updateOne(
      { _id: userId },
      {
        $push: {
          collectedBloodDetails: {
            bloodGroup,
            collectedFrom,
            date,
            donorName,
            donorEmail,
            phoneNumber,
            quantity,
          },
        },
      }
    );

    return NextResponse.json(
      {
        message: "Donor's details added successfully",
        event: user.collectedBloodDetails,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding event:", error);
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || "An unknown error occurred" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import User from "../../../Model/BloodBank";
import { connectDB } from "../../../Config/db";
import { verifyUser } from "../../../Middleware/authMiddleware";

connectDB();

export async function POST(req: Request) {
  try {
    const {
      bloodGroup,
      suppliedTo,
      date,
      recipientName,
      recipientEmail,
      phoneNumber,
      quantity,
    } = await req.json();

    const userId = await verifyUser();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is missing" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId).select("suppliedBloodDetails");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await User.updateOne(
      { _id: userId },
      {
        $push: {
          suppliedBloodDetails: {
            bloodGroup,
            suppliedTo,
            date,
            recipientName,
            recipientEmail,
            phoneNumber,
            quantity,
          },
        },
      }
    );

    return NextResponse.json(
      {
        message: "Seeker's details added successfully",
        event: user.suppliedBloodDetails,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error adding data:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}

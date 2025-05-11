import { NextResponse } from "next/server";
import User from "../../../Model/BloodBank";
import { connectDB } from "../../../Config/db";
import { verifyUser } from "../../../Middleware/authMiddleware";

connectDB();

export async function GET() {
  try {
    const userId = await verifyUser();
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is missing" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId).select(
      "collectedBloodDetails suppliedBloodDetails"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    console.log("vdfv" + user.collectedBloodDetails);

    return NextResponse.json(
      {
        success: true,
        collectedBloodDetails: user.collectedBloodDetails,
        suppliedBloodDetails: user.suppliedBloodDetails,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching blood details:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

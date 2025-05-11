import { NextResponse } from "next/server";
import User from "../../../Model/EventOrganizer";
import { connectDB } from "../../../Config/db";
import { verifyUser } from "../../../Middleware/authMiddleware";

connectDB();

export async function GET() {
  // Authenticate user

  try {
    const userId = await verifyUser();
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is missing" },
        { status: 400 }
      );
    }

    // Fetch the user and only return the 'event' field
    const user = await User.findById(userId).select("event");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // console.log("list users " + user);

    return NextResponse.json(
      { success: true, events: user.event },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

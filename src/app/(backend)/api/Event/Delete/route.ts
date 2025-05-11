import { NextResponse } from "next/server";
import User from "../../../Model/EventOrganizer";
import { connectDB } from "../../../Config/db";
import { verifyUser } from "../../../Middleware/authMiddleware";

connectDB();

interface Event {
  eventId: number;
  eventName: string;
  location: string;
  city: string;
  state: string;
  time: string;
  date: string;
}

export async function DELETE(req: Request) {
  try {
    const userId = await verifyUser();
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is missing" },
        { status: 400 }
      );
    }

    const { eventId } = await req.json();
    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!Array.isArray(user.event)) {
      return NextResponse.json(
        { error: "User has no events" },
        { status: 400 }
      );
    }

    // Type the event array as an array of Event objects
    const eventIndex = user.event.findIndex(
      (e: Event) => e.eventId === eventId
    );
    if (eventIndex === -1) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const deletedEvent = user.event.splice(eventIndex, 1)[0];

    await user.save();

    return NextResponse.json({
      message: "Event deleted successfully",
      deletedEvent,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error deleting event:", error);
      return NextResponse.json(
        { error: error.message || "Internal Server Error" },
        { status: 500 }
      );
    } else {
      console.error("Unexpected error:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}

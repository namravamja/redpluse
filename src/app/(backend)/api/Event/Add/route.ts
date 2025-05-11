import { NextResponse } from "next/server";
import User from "../../../Model/EventOrganizer";
import { connectDB } from "../../../Config/db";
import { verifyUser } from "../../../Middleware/authMiddleware";

connectDB();

interface Event {
  eventId?: number;
  eventName: string;
  location: string;
  city: string;
  state: string;
  time: string;
  date: string;
}

export async function POST(req: Request) {
  try {
    const { eventName, location, city, state, time, date } = await req.json();

    const userId = await verifyUser();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is missing" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId).select("event");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Ensure that the events array is typed
    const events = user.event as Event[];

    // Calculate next eventId
    const maxEventId = events.reduce(
      (max: number, e: Event) => Math.max(max, e.eventId || 0),
      0
    );
    const nextEventId = maxEventId + 1;

    // Save only the modified field
    await User.updateOne(
      { _id: userId },
      {
        $push: {
          event: {
            eventId: nextEventId,
            eventName,
            location,
            city,
            state,
            time,
            date,
          },
        },
      }
    );

    return NextResponse.json(
      { message: "Event added successfully", eventId: nextEventId },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error adding event:", error);
      return NextResponse.json(
        { error: error.message || "An unknown error occurred" },
        { status: 500 }
      );
    } else {
      console.error("Unexpected error:", error);
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }
}

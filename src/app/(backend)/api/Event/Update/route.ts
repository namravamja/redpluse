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

export async function PUT(req: Request) {
  try {
    const userId = await verifyUser();
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is missing" },
        { status: 400 }
      );
    }

    const updateEventData = await req.json();
    const { eventId, ...eventUpdates } = updateEventData;

    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Type the user's event array
    const eventIndex = user.event.findIndex(
      (e: Event) => e.eventId === eventId
    );

    if (eventIndex === -1) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Update the specific event in the events array
    Object.keys(eventUpdates).forEach((key) => {
      // Type-safety: Ensure only valid keys are updated
      if (key in user.event[eventIndex]) {
        user.event[eventIndex][key as keyof Event] = eventUpdates[key];
      }
    });

    // Save the updated user document
    await user.save();

    return NextResponse.json({
      message: "Event updated successfully",
      event: user.event[eventIndex],
    });
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

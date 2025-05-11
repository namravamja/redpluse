// File: src/app/api/events/all/route.ts

import { NextResponse } from "next/server";
import {connectDB} from "../../../Config/db"; // Your MongoDB connection function
import EventOrganizer from "../../../Model/EventOrganizer"; // Organizer model

export const GET = async () => {
  try {
    await connectDB();

    const eventsWithOrganizerInfo = await EventOrganizer.aggregate([
      { $unwind: "$event" },
      {
        $project: {
          _id: 0,
          event: 1,
          organizerId: "$_id",
          organizerEmail: "$email",
          organizerName: "$EventOrganizerName",
          organizationName: "$organizationName",
          organizerType: "$type",
          organizerNumber: "$number",
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      events: eventsWithOrganizerInfo,
    });
  } catch (error) {
    console.error("Error fetching events with organizer info:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch events." },
      { status: 500 }
    );
  }
};

import { NextResponse } from "next/server";
import Donor from "../../../Model/Donor";
import { connectDB } from "../../../Config/db";
import { verifyUser } from "../../../Middleware/authMiddleware";

connectDB();

export async function POST(req: Request) {
  try {
    const {
      bloodGroup,
      dateIssued,
      email,
      quantity,
      eventName,
      issuedBy,
    }: {
      bloodGroup: string;
      dateIssued: string;
      email: string;
      quantity: number;
      eventName: string;
      issuedBy: string;
      name?: string; // not used but destructured to avoid lint errors
      phone?: string; // not used but destructured to avoid lint errors
    } = await req.json();

    const userId = await verifyUser();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const donor = await Donor.findOne({
      $and: [{ email }, { bloodGroup }],
    });

    if (!donor) {
      return NextResponse.json(
        { error: "Donor with this Email and Blood Group not found" },
        { status: 404 }
      );
    }

    const alreadyExists = donor.certificates.some(
      (cert: {
        eventName: string;
        dateIssued: string;
        issuedBy: string;
        quantity: number;
        bloodGroup: string;
      }) => cert.eventName === eventName
    );

    if (alreadyExists) {
      return NextResponse.json(
        { error: "Certificate for this event already exists" },
        { status: 409 }
      );
    }

    donor.certificates.push({
      eventName,
      dateIssued,
      issuedBy,
      quantity,
      bloodGroup,
    });

    await donor.save();

    return NextResponse.json(
      { message: "Certificate added", donor },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error adding certificate:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}

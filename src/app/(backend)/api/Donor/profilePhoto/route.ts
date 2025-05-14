import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../Config/db";
import Donor from "../../../Model/Donor";
import cloudinary from "../../../Config/cloudinary";
import { verifyUser } from "../../../Middleware/authMiddleware";

interface CloudinaryResponse {
  secure_url: string;
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("photo") as File;

  if (!file) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const auth = await verifyUser();
  if (typeof auth === "object" && "error" in auth) {
    return NextResponse.json(auth, { status: auth.status });
  }

  const userId = auth;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const cloudinaryRes = await new Promise<CloudinaryResponse>(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "donor_profile_photos" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as CloudinaryResponse); // Ensure the result is typed correctly
        }
      );

      stream.end(buffer);
    }
  );

  const imageUrl = cloudinaryRes.secure_url;

  await connectDB();
  const updatedDonor = await Donor.findByIdAndUpdate(
    userId,
    { ProfilePhoto: imageUrl },
    { new: true }
  );

  return NextResponse.json({
    message: "Image uploaded",
    photo: imageUrl,
    donor: updatedDonor,
  });
}

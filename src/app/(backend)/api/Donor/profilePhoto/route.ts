import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "../../../Config/db"
import Donor from "../../../Model/Donor"
import cloudinary from "../../../Config/cloudinary"
import { verifyUser } from "../../../Middleware/authMiddleware"

interface CloudinaryResponse {
  secure_url: string
}

// Ensure we're using Node.js runtime, not Edge
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Define allowed methods explicitly
export async function POST(req: NextRequest) {
  try {
    // Verify content type
    const contentType = req.headers.get("content-type") || ""
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Content type must be multipart/form-data" }, { status: 400 })
    }

    const formData = await req.formData()
    const file = formData.get("photo") as File

    if (!file) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 })
    }

    const auth = await verifyUser()
    if (typeof auth === "object" && "error" in auth) {
      return NextResponse.json(auth, { status: auth.status })
    }

    const userId = auth

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const cloudinaryRes = await new Promise<CloudinaryResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: "donor_profile_photos" }, (error, result) => {
        if (error) reject(error)
        else resolve(result as CloudinaryResponse)
      })

      stream.end(buffer)
    })

    const imageUrl = cloudinaryRes.secure_url

    await connectDB()
    const updatedDonor = await Donor.findByIdAndUpdate(userId, { ProfilePhoto: imageUrl }, { new: true })

    return NextResponse.json({
      message: "Image uploaded",
      photo: imageUrl,
      donor: updatedDonor,
    })
  } catch (error) {
    console.error("Profile photo upload error:", error)
    return NextResponse.json({ error: "Failed to upload profile photo" }, { status: 500 })
  }
}

// Add OPTIONS method to handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  })
}

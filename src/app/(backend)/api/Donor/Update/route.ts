import { NextResponse } from "next/server";
import User from "../../../Model/Donor";
import { connectDB } from "../../../Config/db";
import { verifyUser } from "../../../Middleware/authMiddleware";

connectDB();

export async function PUT(req: Request) {
  try {
    await connectDB();

    // ✅ Get authenticated user ID
    const userId = await verifyUser();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Fetch the user from MongoDB
    const user = await User.findById(userId).select("-password");

     console.log("old user",user);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Get update data from request
    const updateData = await req.json();

    if (!updateData) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }


    // ✅ Update user with new data (including BMI)
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


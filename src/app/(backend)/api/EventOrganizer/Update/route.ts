import { NextResponse } from "next/server";
import User from "../../../Model/EventOrganizer";
import { connectDB } from "../../../Config/db";
import { verifyUser } from "../../../Middleware/authMiddleware";

connectDB();

export async function PUT(req: Request) {
  
  try {
    // ✅ Extract userId from request headers (set by middleware)
    const userId = await verifyUser();

    // ❌ If user ID is missing, return an error
    if (!userId) {
      return NextResponse.json({ error: "UserID is not" }, { status: 404 });
    }
    console.log(userId);

    // ✅ Fetch user from MongoDB (excluding password)
    const user = await User.findById(userId).select("-password");

    console.log("old user",user);

    // ❌ If user doesn't exist, return error
    if (!user) {
      return NextResponse.json({ error: "User is not" }, { status: 404 });
    }

    // ✅ Extract the body data from the request to update user details
    const updateData = await req.json(); // Get the data to update from the request body

    // console.log("lulululu" + updateData.email);

    // ❌ If no update data provided, return an error
    if (!updateData) {
      return NextResponse.json(
        { error: "No data provided to update" },
        { status: 400 }
      );
    }

    // ✅ Update the user with new data (you can add validation here if needed)
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    // ❌ If update fails, return error
    if (!updatedUser) {
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 500 }
      );
    }
    console.log("updated user : ", updatedUser)
    // ✅ Return the updated user details (excluding password)
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

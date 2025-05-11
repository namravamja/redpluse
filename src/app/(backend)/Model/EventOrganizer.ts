import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const EventOrganizerSchema = new mongoose.Schema({
  EventOrganizerName: {
    type: String,
    required: [true, "Event organizer name is required"],
    minlength: [3, "Event organizer name must be at least 3 characters long"],
    maxlength: [
      100,
      "Event organizer name must be at most 100 characters long",
    ],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      "Please provide a valid email address",
    ],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  organizationName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["corporate", "Non-Profit", "other"],
    required: true,
  },
  number: {
    type: String,
    required: true,
    minlength: [10, "Contact number must be at least 10 characters long"],
  },
  event: [
    {
      eventId: {
        type: String,
        required: false,
      },
      eventName: {
        type: String,
        required: false,
      },
      location: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: false,
      },
      state: {
        type: String,
        required: false,
      },
      time: {
        type: String,
        required: false,
      },
      date: {
        type: Date,
        required: false,
      },
    },
  ],
  isAvailable: {
    type: Boolean,
    default: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: false,
  },
  resetPasswordToken: {
    type: String,
    required: false,
  },
  resetPasswordExpire: {
    type: Date,
    required: false,
  },
});

EventOrganizerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.models.EventOrganizer ||
  mongoose.model("EventOrganizer", EventOrganizerSchema);

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const DonorSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      minlength: [3, "Full name must be at least 3 characters long"],
      maxlength: [100, "Full name must be at most 100 characters long"],
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
      minlength: 6,
    },
    ProfilePhoto: {
      type: String,
      required: false,
    },
    contactNumber: {
      type: Number,
      required: false,
    },
    Adhar: {
      type: String,
    },
    bloodGroup: {
      type: String,
      required: false,
    },
    age: {
      type: String,
      required: false,
    },
    height: {
      type: String,
      required: false,
    },
    weight: {
      type: String,
      required: false,
    },
    bmi: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      required: false,
    },
    address: {
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
    country: {
      type: String,
      required: false,
    },
    pincode: {
      type: Number,
      required: false,
      minlength: [6, "Pincode must be at least 6 characters long"],
      maxlength: [6, "Pincode must be at most 6 characters long"],
    },
    lastDonated: {
      type: Date,
      required: false,
    },
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
    authProvider: {
      type: String,
      enum: ["custom", "google"],
      default: "custom",
    },
    certificates: [
      {
        eventName: {
          type: String,
          required: false,
        },
        dateIssued: {
          type: Date,
          required: false,
        },
        issuedBy: {
          type: String,
          required: false,
        },
        quantity: {
          type: Number,
          required: false,
        },
        bloodGroup: {
          type: String,
          required: false,
        },
      },
    ],
  },
  { timestamps: true }
);

DonorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  if (this.password) {
    this.password = await bcrypt.hash(this.password, salt);
  } else {
    return next(new Error("Password is undefined"));
  }
  next();
});

export default mongoose.models.Donor || mongoose.model("Donor", DonorSchema);

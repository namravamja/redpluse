import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const BloodBankSchema = new mongoose.Schema(
  {
    BloodBankName: {
      type: String,
      required: [true, "Blood bank name is required"],
      minlength: [3, "Blood bank name must be at least 3 characters long"],
      maxlength: [100, "Blood bank name must be at most 100 characters long"],
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
      required: [true, "Password is required"],
      minlength: 6,
    },
    licenceNumber: {
      type: String,
      required: [true, "Licence number is required"],
      unique: true,
      minlength: [5, "Licence number must be at least 3 characters long"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    helplineNumber: {
      type: String,
      required: [true, "Helpline number is required"],
      minlength: [3, "Helpline number must be at least 3 characters long"],
    },
    contactPerson: {
      type: String,
      required: [true, "Contact person is required"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    pincode: {
      type: String,
      required: [true, "Pincode is required"],
      minlength: [6, "Pincode must be at least 6 characters long"],
      maxlength: [6, "Pincode must be at most 6 characters long"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    parentHospital: {
      type: String,
      required: [true, "Parent hospital name is required"],
    },
    category: {
      type: String,
      enum: ["Private", "Government"],
      required: [true, "Category is required"],
    },
    collectedBloodDetails: [
      {
        bloodGroup: {
          type: String,
          required: false,
        },
        collectedFrom: {
          type: String,
          enum: ["donor", "event", "hospital"],
          required: false,
        },
        date: {
          type: Date,
          required: false,
        },
        donorName: {
          type: String,
          required: false,
        },
        donorEmail: {
          type: String,
          match: [
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            "Please provide a valid email address",
          ],
          required: false,
        },
        phoneNumber: {
          type: String,
          required: false,
        },
        quantity: {
          type: Number,
          min: [1, "Blood quantity must be at least 1 unit"],
          required: false,
        },
      },
    ],
    suppliedBloodDetails: [
      {
        bloodGroup: {
          type: String,
          required: false,
        },
        suppliedTo: {
          type: String,
          enum: ["patient", "hospital", "event"],
          required: false,
        },
        date: {
          type: Date,
          required: false,
        },
        recipientName: {
          type: String,
          required: false,
        },
        recipientEmail: {
          type: String,
          match: [
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            "Please provide a valid email address",
          ],
          required: false,
        },
        phoneNumber: {
          type: String,
          required: false,
        },
        quantity: {
          type: Number,
          min: [1, "Blood quantity must be at least 1 unit"],
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
  },

  { timestamps: true }
);

BloodBankSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.models.BloodBank ||
  mongoose.model("BloodBank", BloodBankSchema);

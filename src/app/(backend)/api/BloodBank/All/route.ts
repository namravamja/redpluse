// File: src/app/api/bloodbank/all/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "../../../Config/db";
import BloodBank from "../../../Model/BloodBank";

interface CollectedBloodDetail {
  bloodGroup: string;
  // Add other fields if needed
}

interface BloodBankDocument {
  BloodBankName: string;
  address: string;
  state: string;
  city: string;
  phone: string;
  email: string;
  category: string;
  collectedBloodDetails?: CollectedBloodDetail[];
}

export const GET = async () => {
  try {
    await connectDB();

    const allBloodBanks =
      (await BloodBank.find().lean()) as BloodBankDocument[];

    const formatted = allBloodBanks.map((bank, index) => {
      const uniqueBloodGroups = [
        ...new Set(bank.collectedBloodDetails?.map((item) => item.bloodGroup)),
      ];

      return {
        srNo: index + 1,
        name: bank.BloodBankName,
        address: bank.address,
        state: bank.state,
        city: bank.city,
        phone: bank.phone,
        email: bank.email,
        category: bank.category,
        availableBloodTypes: uniqueBloodGroups,
      };
    });

    return NextResponse.json({ success: true, data: formatted });
  } catch (error) {
    console.error("Error fetching blood banks:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch blood banks" },
      { status: 500 }
    );
  }
};

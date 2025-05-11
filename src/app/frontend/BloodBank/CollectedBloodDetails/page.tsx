"use client";
import { useAddCollectedDonorDetailsMutation } from "@/app/lib/BloodBank";
import React, { useState, ChangeEvent } from "react";
import toast from "react-hot-toast";

interface FormData {
  bloodGroup: string;
  collectedFrom: string;
  date: string;
  donorName: string;
  email: string;
  phoneNumber: string;
  quantity: string;
}

export default function CollectedBloodDetails() {
  const [formData, setFormData] = useState<FormData>({
    bloodGroup: "",
    collectedFrom: "",
    date: "",
    donorName: "",
    email: "",
    phoneNumber: "",
    quantity: "",
  });

  const [addCollectedDonorDetails, { isLoading }] =
    useAddCollectedDonorDetailsMutation();

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedDate = new Date(formData.date);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (selectedDate > currentDate) {
      toast.error("Future dates are not allowed");
      return;
    }

    try {
      const response = await addCollectedDonorDetails({
        bloodGroup: formData.bloodGroup,
        collectedFrom: formData.collectedFrom,
        date: formData.date,
        donorName: formData.donorName,
        donorEmail: formData.email,
        phoneNumber: formData.phoneNumber,
        quantity: formData.quantity,
      }).unwrap();

      console.log("Add successful:", response);
      toast.success("Details Add successful!");

      setFormData({
        bloodGroup: "",
        collectedFrom: "",
        date: "",
        donorName: "",
        email: "",
        phoneNumber: "",
        quantity: "",
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err?.message || "Adding failed. Try again.");
      } else {
        toast.error("Unexpected error. Try again.");
      }
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            >
              <option value="" disabled>
                Select Blood Group
              </option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div className="relative">
            <select
              name="collectedFrom"
              value={formData.collectedFrom}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            >
              <option value="" disabled>
                Collected From
              </option>
              <option value="donor">Donor</option>
              <option value="hospital">Hospital</option>
              <option value="BloodBank">Blood Bank</option>
              <option value="campDrive">Camp/Drive</option>
            </select>
          </div>

          <div className="relative">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              max={today}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Donor/Receiver&apos;s Name
          </label>
          <input
            type="text"
            name="donorName"
            placeholder="Type name"
            value={formData.donorName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            placeholder="1010101010"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Quantity Collected</label>
          <div className="relative">
            <input
              type="text"
              name="quantity"
              placeholder="XX"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md pr-12"
              required
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
              ml
            </span>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-32 bg-red-900 hover:bg-red-800 text-white py-3 px-4 rounded-md transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}

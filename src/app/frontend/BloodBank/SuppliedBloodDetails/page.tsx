"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import { useAddSuppliedSeekerDetailsMutation } from "@/app/lib/BloodBank";
import toast from "react-hot-toast";

interface FormData {
  bloodGroup: string;
  suppliedTo: string;
  date: string;
  recipientName: string;
  email: string;
  phoneNumber: string;
  quantity: string;
}

export default function SuppliedBloodDetails() {
  const [formData, setFormData] = useState<FormData>({
    bloodGroup: "",
    suppliedTo: "",
    date: "",
    recipientName: "",
    email: "",
    phoneNumber: "",
    quantity: "",
  });

  const [today, setToday] = useState("");

  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    setToday(`${year}-${month}-${day}`);
  }, []);

  const [addSuppliedBloodDetails] = useAddSuppliedSeekerDetailsMutation();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await addSuppliedBloodDetails({
        bloodGroup: formData.bloodGroup,
        suppliedTo: formData.suppliedTo,
        date: formData.date,
        recipientName: formData.recipientName,
        recipientEmail: formData.email,
        phoneNumber: formData.phoneNumber,
        quantity: formData.quantity,
      }).unwrap();

      console.log("Add successful:", response);
      toast.success("Details added successfully!");
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "data" in err) {
        const errorMessage = (err as { data?: { error?: string } }).data?.error;
        toast.error(errorMessage || "Adding failed. Try again.");
      } else {
        toast.error("An unexpected error occurred.");
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
              name="suppliedTo"
              value={formData.suppliedTo}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            >
              <option value="" disabled>
                Supplied To
              </option>
              <option value="patient">Patient</option>
              <option value="hospital">Hospital</option>
              <option value="BloodBank">Blood Bank</option>
              <option value="emergencyService">Emergency Service</option>
            </select>
          </div>

          <div className="relative">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              max={today}
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Recipient&apos;s Name
          </label>
          <input
            type="text"
            name="recipientName"
            placeholder="Type name"
            value={formData.recipientName}
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
          <label className="block text-gray-700 mb-2">Quantity Supplied</label>
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
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";
import React from "react";
import { useGetUserDataQuery } from "../../../lib/Donor"; // Import the query hook
import Image from "next/image";

const ProfileDisplay = () => {
  // Fetch user data using RTK Query
  const { data, error, isLoading } = useGetUserDataQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Handle loading and error states
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: </div>;

  // If user data is not available
  if (!data) return <div>No user data available</div>;

  console.log("data : ", data);

  const bloodGroup = data.bloodGroup;
  const aadhar = data.Adhar;

  return (
    <div className="bg-blue-50/80 p-8 flex flex-col justify-center items-center">
      {!(bloodGroup && aadhar) && (
        <div className="text-red-900 font-extrabold bg-yellow-300/50 p-5 border-l-[15px] border-red-800 mb-10">
          Add your Blood Group & Aadhar no. from update section to retrieve
          certification
        </div>
      )}
      <div className="w-full max-w-4xl bg-blue-50/10  p-6 rounded-lg shadow-2xl flex gap-8">
        {/* Left Section - Profile Form */}
        <div className="flex-1 space-y-4">
          {/* First row */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs text-gray-500">Name:</label>
              <input
                type="text"
                value={data.fullName || ""}
                className="w-full p-2 border rounded-lg"
                readOnly
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500">Email:</label>
              <input
                type="text"
                value={data.email || ""}
                className="w-full p-2 border rounded-lg"
                readOnly
              />
            </div>
          </div>

          {/* Second row */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs text-gray-500">Phone:</label>
              <input
                type="text"
                value={data.contactNumber || ""}
                className="w-full p-2 border rounded-lg"
                readOnly
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500">Aadhar No:</label>
              <input
                type="text"
                value={data.Adhar || ""}
                className="w-full p-2 border rounded-lg"
                readOnly
              />
            </div>
          </div>

          {/* Third row */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs text-gray-500">Blood Group:</label>
              <input
                type="text"
                value={data.bloodGroup || ""}
                className="w-full p-2 border rounded-lg"
                readOnly
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500">Gender:</label>
              <input
                type="text"
                value={data.gender || ""}
                className="w-full p-2 border rounded-lg"
                readOnly
              />
            </div>
          </div>

          {/* Address Fields */}
          <input
            type="text"
            value={data.address || ""}
            className="w-full p-2 border rounded-lg"
            readOnly
            placeholder="Address"
          />

          <div className="flex gap-4">
            <input
              type="text"
              value={data.city || ""}
              className="flex-1 p-2 border rounded-lg"
              readOnly
              placeholder="City"
            />
            <input
              type="text"
              value={data.state || ""}
              className="flex-1 p-2 border rounded-lg"
              readOnly
              placeholder="State"
            />
          </div>

          <div className="flex gap-4">
            <input
              type="text"
              value={data.pincode || ""}
              className="flex-1 p-2 border rounded-lg"
              readOnly
              placeholder="Pincode"
            />
            <input
              type="text"
              value={data.country || ""}
              className="flex-1 p-2 border rounded-lg"
              readOnly
              placeholder="Country"
            />
          </div>

          {/* Age, Height, Weight */}
          <div className="flex gap-4">
            <input
              type="text"
              value={data.age || ""}
              className="w-20 p-2 border rounded-lg"
              readOnly
              placeholder="Age"
            />
            <input
              type="text"
              value={data.height || ""}
              className="w-24 p-2 border rounded-lg"
              readOnly
              placeholder="Height"
            />
            <input
              type="text"
              value={data.weight || ""}
              className="w-24 p-2 border rounded-lg"
              readOnly
              placeholder="Weight"
            />
          </div>

          {/* BMI */}
          <div>
            <label className="text-xs text-gray-500">
              BMI (Based on Age, Height, and Weight):
            </label>
            <input
              type="text"
              value={data.bmi || ""} // Optional, if BMI is calculated on the server-side
              className="w-full p-2 border rounded-lg"
              readOnly
              placeholder="BMI"
            />
          </div>
        </div>

        {/* Right Section - Profile Image */}
        <div className="w-full md:w-1/3 flex flex-col items-center justify-center">
          <div className="w-48 h-48 lg:w-64 lg:h-64 bg-blue-50 rounded-full overflow-hidden flex items-center justify-center border-4 border-blue-100 shadow-md">
            <Image
              src={data.ProfilePhoto || "/Avatar.svg"} // Optionally use a default image if not available
              alt="Profile"
              className="w-full h-full object-cover text-center"
              width={200}
              height={200}
            />
          </div>
          <h3 className="font-heading text-lg font-semibold mt-4 text-blue-950">
            {data.fullName || "Donor"}
          </h3>
          <p className="text-blue-800 text-sm">
            Blood Group: {data.bloodGroup || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileDisplay;

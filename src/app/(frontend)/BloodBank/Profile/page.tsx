"use client";
import { useGetUserDataQuery } from "@/app/lib/BloodBank";
import React from "react";

const BloodBankProfileDisplay = () => {
  const { data, error, isLoading } = useGetUserDataQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  console.log(data);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: </div>;

  if (!data) return <div>No user data available</div>;
  return (
    <div className=" bg-white p-8 flex justify-center items-center">
      <div className="w-full max-w-4xl bg-gray-100 p-6 rounded-lg shadow-lg flex gap-8">
        {/* Left Section - Profile Form */}
        <div className="flex-1 space-y-4">
          {/* First row */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs text-gray-500">BloodBank Name:</label>
              <input
                type="text"
                value={data.BloodBankName || ""}
                className="w-full p-2 border rounded-lg"
                readOnly
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500">Parent Hospital:</label>
              <input
                type="text"
                value={data.parentHospital || ""}
                className="w-full p-2 border rounded-lg"
                readOnly
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs text-gray-500">Helpline Number:</label>
              <input
                type="text"
                value={data.helplineNumber || ""}
                className="w-full p-2 border rounded-lg"
                readOnly
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500">Licence No:</label>
              <input
                type="text"
                value={data.licenceNumber || ""}
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

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs text-gray-500">Category:</label>
              <input
                type="text"
                value={data.category || ""}
                className="w-full p-2 border rounded-lg"
                readOnly
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500">Pincode:</label>
              <input
                type="text"
                value={data.pincode || ""}
                className="w-full p-2 border rounded-lg"
                readOnly
              />
            </div>
          </div>

          <input
            type="text"
            value={data.address || ""}
            className="w-full h-28 p-2 border rounded-lg"
            readOnly
            placeholder="Address"
          />

          <div className="flex gap-4">
            <input
              type="text"
              value={data.state}
              className="flex-1 p-2 border rounded-lg"
              readOnly
              placeholder="State"
            />


            <input
              type="text"
              value={data.city}
              className="flex-1 p-2 border rounded-lg"
              readOnly
              placeholder="City/VillaGE"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodBankProfileDisplay;

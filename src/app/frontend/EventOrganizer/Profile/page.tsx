"use client";
import { useGetUserDataQuery } from "@/app/lib/EventOrganizer";
import React from "react";

const ProfileDisplay = () => {
  const { data, error, isLoading } = useGetUserDataQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: Unable to load user data.</div>;
  if (!data) return <div>No user data available</div>;

  return (
    <div className="bg-white p-8 flex justify-center items-center">
      <div className="w-full max-w-4xl bg-gray-100 p-6 rounded-lg shadow-lg flex gap-8">
        <div className="flex-1 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs text-gray-500">Organizer Name:</label>
              <input
                type="text"
                value={data.EventOrganizerName || ""}
                className="w-full p-2 border rounded-lg bg-white"
                readOnly
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs text-gray-500">
                Organizer Mobile No.:
              </label>
              <input
                type="text"
                value={data.number || ""}
                className="w-full p-2 border rounded-lg bg-white"
                readOnly
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500">
                Organizer Email Id:
              </label>
              <input
                type="text"
                value={data.email || ""}
                className="w-full p-2 border rounded-lg bg-white"
                readOnly
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500">Organization Name:</label>
            <input
              type="text"
              value={data.organizationName || ""}
              className="w-full p-2 border rounded-lg bg-white"
              readOnly
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">Organization Type:</label>
            <input
              type="text"
              value={data.type || ""}
              className="w-full p-2 border rounded-lg bg-white"
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDisplay;

"use client";
import React, { useState, useEffect } from "react";
import {
  useUpdateUserDataMutation,
  useGetUserDataQuery,
} from "@/app/lib/EventOrganizer";
import toast from "react-hot-toast";

interface OrganizerDetails {
  EventOrganizerName: string;
  organizationName: string;
  number: string;
  type: string;
  email: string;
}

function EventOrganizerUpdate() {
  const [organizerDetails, setOrganizerDetails] = useState<OrganizerDetails>({
    EventOrganizerName: "",
    organizationName: "",
    number: "",
    type: "",
    email: "",
  });

  const { data: userData, refetch } = useGetUserDataQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [updateOrganizerData, { isLoading }] = useUpdateUserDataMutation();

  useEffect(() => {
    if (userData) {
      setOrganizerDetails((prev) => ({ ...prev, ...userData }));
    }
  }, [userData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setOrganizerDetails({
      ...organizerDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateOrganizerData(organizerDetails).unwrap();
      refetch();
      console.log("Updated Organizer Details:", organizerDetails);
      toast.success("Profile Updated successful!");
    } catch (error) {
      console.error("Error during update", error);
    }
  };

  return (
    <div className="flex justify-center items-center p-4 mt-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Update Event Organizer
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-gray-600">Organizer Name</label>
            <input
              type="text"
              name="EventOrganizerName"
              placeholder="Enter organizer name"
              value={organizerDetails.EventOrganizerName}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-600">Organization Name</label>
            <input
              type="text"
              name="organizationName"
              placeholder="Enter organization name"
              value={organizerDetails.organizationName}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-600">Organizer Mobile No.</label>
            <input
              type="text"
              name="number"
              placeholder="Enter mobile number"
              value={organizerDetails.number}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-600">Organization Type</label>
            <select
              name="type"
              value={organizerDetails.type}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option disabled value="">
                Select value
              </option>
              <option value="Corporate">Corporate</option>
              <option value="Non-Profit">Non-Profit</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-600">Organizer Email Id</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={organizerDetails.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="md:col-span-2 flex justify-center mt-3">
            <button
              type="submit"
              className="bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-800 transition"
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventOrganizerUpdate;

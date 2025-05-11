"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

type Donor = {
  name: string;
  email: string;
  aadhar: string;
  phone: string;
  age: number;
  height: number;
  weight: number;
  bloodGroup: string;
  status: string;
};

const donorsData: Donor[] = new Array(29).fill(null).map((_, index) => ({
  name: `User ${index + 1}`,
  email: `user${index + 1}@gmail.com`,
  aadhar: "121212121212",
  phone: "1212121212",
  age: 19,
  height: 5.6,
  weight: 65,
  bloodGroup: "A+ve",
  status: localStorage.getItem(`donorStatus-${index}`) || "Pending",
}));

function DonorVerification() {
  const [page, setPage] = useState<number>(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [donors, setDonors] = useState<Donor[]>(donorsData);
  const itemsPerPage = 9;
  const totalPages = Math.ceil(donors.length / itemsPerPage);

  useEffect(() => {
    const savedIndex = localStorage.getItem("selectedDonor");
    if (savedIndex !== null) setSelectedIndex(parseInt(savedIndex));
  }, []);

  const updateStatus = (index: number, status: string) => {
    const updatedDonors = [...donors];
    updatedDonors[index].status = status;
    setDonors(updatedDonors);
    localStorage.setItem(`donorStatus-${index}`, status);
  };

  if (selectedIndex !== null) {
    return (
      <DonorProfile
        donor={donors[selectedIndex]}
        onNext={() =>
          setSelectedIndex((prev) =>
            prev !== null ? (prev + 1) % donors.length : 0
          )
        }
        onPrevious={() =>
          setSelectedIndex((prev) =>
            prev !== null ? (prev - 1 + donors.length) % donors.length : 0
          )
        }
        onClose={() => setSelectedIndex(null)}
        updateStatus={(status) => updateStatus(selectedIndex, status)}
      />
    );
  }

  return (
    <div className="flex flex-col items-center p-4 mt-11 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl">
        {donors
          .slice(page * itemsPerPage, (page + 1) * itemsPerPage)
          .map((donor, index) => (
            <div
              key={index}
              className="flex items-center p-4 bg-gray-300 rounded-lg w-full sm:w-64 cursor-pointer"
              onClick={() => setSelectedIndex(page * itemsPerPage + index)}
            >
              <Image
                src="/Avatar.svg"
                alt="avatar"
                width={50}
                height={50}
                className="mr-4 rounded-full"
              />
              <div>
                <p className="font-bold">{donor.name}</p>
                <p className="text-sm">{donor.email}</p>
                <p
                  className={
                    donor.status === "Verified"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {donor.status}
                </p>
              </div>
            </div>
          ))}
      </div>
      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={() => setPage(Math.max(page - 1, 0))}
          disabled={page === 0}
          className="p-2 bg-gray-200 rounded-full disabled:opacity-50"
        >
          <ChevronLeft />
        </button>
        <span>
          {page + 1} / {totalPages}
        </span>
        <button
          onClick={() => setPage(Math.min(page + 1, totalPages - 1))}
          disabled={page === totalPages - 1}
          className="p-2 bg-gray-200 rounded-full disabled:opacity-50"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}

type DonorProfileProps = {
  donor: Donor;
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
  updateStatus: (status: string) => void;
};

function DonorProfile({
  donor,
  onNext,
  onPrevious,
  onClose,
  updateStatus,
}: DonorProfileProps) {
  return (
    <div className="flex flex-col items-center p-6 mt-11 bg-white shadow-lg rounded-lg w-full max-w-2xl mx-auto">
      <button
        onClick={onClose}
        className="self-start mb-2 p-2 bg-gray-200 rounded-lg"
      >
        Back
      </button>
      <div className="grid grid-cols-2 gap-4 w-full p-4 border rounded-lg">
        <div className="flex flex-col gap-2">
          <p>
            <strong>Name:</strong> {donor.name}
          </p>
          <p>
            <strong>Email:</strong> {donor.email}
          </p>
          <p>
            <strong>Aadhar:</strong> {donor.aadhar}
          </p>
          <p>
            <strong>Phone:</strong> {donor.phone}
          </p>
          <div className="flex gap-2">
            <p>
              <strong>Age:</strong> {donor.age}
            </p>
            <p>
              <strong>Height:</strong> {donor.height} ft
            </p>
            <p>
              <strong>Weight:</strong> {donor.weight} Kgs
            </p>
          </div>
          <p>
            <strong>Blood Group:</strong> {donor.bloodGroup}
          </p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-lg font-bold">Photo</p>
          <Image
            src="/Avatar.svg"
            alt="avatar"
            width={128}
            height={128}
            className="w-32 h-32 rounded-full mt-2"
          />
        </div>
      </div>
      <div className="flex justify-between w-full mt-4">
        <button onClick={onPrevious} className="p-2 bg-gray-300 rounded-lg">
          <ChevronLeft />
        </button>
        <button onClick={onNext} className="p-2 bg-gray-300 rounded-lg">
          <ChevronRight />
        </button>
      </div>
      <button
        onClick={() => updateStatus("Verified")}
        className={`mt-4 p-2 text-white rounded-lg ${
          donor.status === "Verified" ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {donor.status === "Verified" ? "Verified" : "Verify"}
      </button>
      <p
        className={`mt-2 ${
          donor.status === "Verified" ? "text-green-600" : "text-red-600"
        }`}
      >
        {donor.status}
      </p>
    </div>
  );
}

export default DonorVerification;

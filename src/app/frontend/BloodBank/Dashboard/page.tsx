"use client";
import React, { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Eye, LightbulbIcon } from "lucide-react";
import { useGetBloodDetailsQuery } from "@/app/lib/BloodBank";

// Define proper TypeScript interfaces
interface ChartDataPoint {
  month: string;
  value: number;
}

interface CollectedBloodDetail {
  id?: string;
  bloodGroup: string;
  donorName?: string;
  donorEmail?: string;
  date: string;
  quantity: number;
}

interface SuppliedBloodDetail {
  id?: string;
  bloodGroup: string;
  recipientName?: string;
  recipientEmail?: string;
  date: string;
  quantity: number;
}

function Dashboard() {
  const bloodCollectionData: ChartDataPoint[] = [
    { month: "JAN", value: 0 },
    { month: "FEB", value: 0 },
    { month: "MAR", value: 0 },
    { month: "APR", value: 0 },
    { month: "MAY", value: 0 },
    { month: "JUN", value: 0 },
    { month: "JULY", value: 0 },
    { month: "AUG", value: 0 },
    { month: "SEPT", value: 0 },
    { month: "OCT", value: 0 },
    { month: "NOV", value: 0 },
    { month: "DEC", value: 0 },
  ];

  const bloodSuppliedData: ChartDataPoint[] = [
    { month: "JAN", value: 0 },
    { month: "FEB", value: 0 },
    { month: "MAR", value: 0 },
    { month: "APR", value: 0 },
    { month: "MAY", value: 0 },
    { month: "JUN", value: 0 },
    { month: "JULY", value: 0 },
    { month: "AUG", value: 0 },
    { month: "SEPT", value: 0 },
    { month: "OCT", value: 0 },
    { month: "NOV", value: 0 },
    { month: "DEC", value: 0 },
  ];

  type BloodGroupOption =
    | "Select Blood Group"
    | "A+"
    | "A-"
    | "B+"
    | "B-"
    | "AB+"
    | "AB-"
    | "O+"
    | "O-";

  const [selectedBloodGroup, setSelectedBloodGroup] =
    useState<BloodGroupOption>("Select Blood Group");

  const { data, error, isLoading } = useGetBloodDetailsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) return <p>Loading data...</p>;
  if (error) return <p>Error loading data. Please try again.</p>;

  const allCollectedBlood =
    data?.collectedBloodDetails || ([] as CollectedBloodDetail[]);
  const allSuppliedBlood =
    data?.suppliedBloodDetails || ([] as SuppliedBloodDetail[]);

  // Filter data based on selected blood group
  const collectedBlood =
    selectedBloodGroup === "Select Blood Group"
      ? allCollectedBlood
      : allCollectedBlood.filter(
          (item: CollectedBloodDetail) => item.bloodGroup === selectedBloodGroup
        );

  const suppliedBlood =
    selectedBloodGroup === "Select Blood Group"
      ? allSuppliedBlood
      : allSuppliedBlood.filter(
          (item: SuppliedBloodDetail) => item.bloodGroup === selectedBloodGroup
        );

  const getMonthAbbreviation = (dateString: string): string =>
    new Date(dateString)
      .toLocaleString("en-US", { month: "short" })
      .toUpperCase();

  // Reset chart data before populating
  bloodCollectionData.forEach((item) => (item.value = 0));
  bloodSuppliedData.forEach((item) => (item.value = 0));

  // Populate chart data
  collectedBlood.forEach((event: CollectedBloodDetail) => {
    const eventMonth = getMonthAbbreviation(event.date);
    const monthEntry = bloodCollectionData.find(
      (monthEntry) => monthEntry.month === eventMonth
    );
    if (monthEntry) {
      monthEntry.value += 10;
    }
  });

  suppliedBlood.forEach((event: SuppliedBloodDetail) => {
    const eventMonth = getMonthAbbreviation(event.date);
    const monthEntry = bloodSuppliedData.find(
      (monthEntry) => monthEntry.month === eventMonth
    );
    if (monthEntry) {
      monthEntry.value += 10;
    }
  });

  const recentCollected = collectedBlood.slice(0, 5);
  const recentSupplied = suppliedBlood.slice(0, 5);

  const totalCollected = collectedBlood.reduce(
    (sum: number, item: CollectedBloodDetail) => sum + (item.quantity || 0),
    0
  );

  const totalSupplied = suppliedBlood.reduce(
    (sum: number, item: SuppliedBloodDetail) => sum + (item.quantity || 0),
    0
  );

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <select
          className="w-full border border-gray-300 rounded p-3 text-gray-500"
          value={selectedBloodGroup}
          onChange={(e) =>
            setSelectedBloodGroup(e.target.value as BloodGroupOption)
          }
        >
          <option value="Select Blood Group">Select Blood Group</option>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">
                {selectedBloodGroup === "Select Blood Group"
                  ? "Blood Collected"
                  : `${selectedBloodGroup} Blood Collected`}
              </h3>
              <Eye className="text-gray-500" />
            </div>
            <div className="flex items-center mt-2">
              <span className="text-4xl font-bold">{totalCollected}ml</span>
              <span className="ml-2 text-green-500 text-xl">↙</span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">
                {selectedBloodGroup === "Select Blood Group"
                  ? "Blood Supplied"
                  : `${selectedBloodGroup} Blood Supplied`}
              </h3>
              <LightbulbIcon className="text-gray-500" />
            </div>
            <div className="flex items-center mt-2">
              <span className="text-4xl font-bold">{totalSupplied}ml</span>
              <span className="ml-2 text-red-500 text-xl">↗</span>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 bg-white overflow-hidden">
          <h3 className="font-bold mb-2">Collection Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={bloodCollectionData}>
              <defs>
                <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#4ade80" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis
                domain={[0, 50]}
                axisLine={false}
                tickLine={false}
                ticks={[10, 20, 30, 40, 50]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorGreen)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 bg-white overflow-hidden">
          <h3 className="font-bold mb-2">Supply Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={bloodSuppliedData}>
              <defs>
                <linearGradient id="colorRed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f87171" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f87171" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis
                domain={[0, 50]}
                axisLine={false}
                tickLine={false}
                ticks={[10, 20, 30, 40, 50]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#ef4444"
                fillOpacity={1}
                fill="url(#colorRed)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-bold mb-4">
            {selectedBloodGroup === "Select Blood Group"
              ? "Recently Collected"
              : `Recently Collected (${selectedBloodGroup})`}
          </h3>
          {recentCollected.length > 0 ? (
            <div className="space-y-4">
              {recentCollected.map(
                (item: CollectedBloodDetail, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="font-medium">
                          {item.donorName || "Anonymous"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.donorEmail || "No Email"}
                        </p>
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded px-3 py-1">
                      <span className="text-sm text-gray-400">
                        {item.quantity || 0}
                      </span>
                      <span className="text-sm text-gray-400 ml-1">ml</span>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-bold mb-4">
            {selectedBloodGroup === "Select Blood Group"
              ? "Recently Supplied"
              : `Recently Supplied (${selectedBloodGroup})`}
          </h3>
          {recentSupplied.length > 0 ? (
            <div className="space-y-4">
              {recentSupplied.map(
                (item: SuppliedBloodDetail, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="font-medium">
                          {item.recipientName || "Anonymous"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.recipientEmail || "No Email"}
                        </p>
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded px-3 py-1">
                      <span className="text-sm text-gray-400">
                        {item.quantity || 0}
                      </span>
                      <span className="text-sm text-gray-400 ml-1">ml</span>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

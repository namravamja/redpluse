"use client";
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FaEye } from "react-icons/fa";
import { useGetEventsQuery } from "@/app/lib/EventOrganizer";

interface EventType {
  date: string;
  eventName: string;
  eventId: string;
}

function EventDashboard() {
  const { data, error, isLoading } = useGetEventsQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    }
  );

  if (isLoading) return <p>Loading events...</p>;
  if (error) return <p>Error loading events. Please try again.</p>;

  const events: EventType[] = data?.events || [];

  const chartData = [
    { month: "JAN", value: 0 },
    { month: "FEB", value: 0 },
    { month: "MAR", value: 0 },
    { month: "APR", value: 0 },
    { month: "MAY", value: 0 },
    { month: "JUN", value: 0 },
    { month: "JUL", value: 0 },
    { month: "AUG", value: 0 },
    { month: "SEP", value: 0 },
    { month: "OCT", value: 0 },
    { month: "NOV", value: 0 },
    { month: "DEC", value: 0 },
  ];

  const getMonthAbbreviation = (dateString: string): string =>
    new Date(dateString)
      .toLocaleString("en-US", { month: "short" })
      .toUpperCase();

  events.forEach((event) => {
    const eventMonth = getMonthAbbreviation(event.date);
    const monthEntry = chartData.find((data) => data.month === eventMonth);
    if (monthEntry) {
      monthEntry.value += 1;
    }
  });

  return (
    <div className="grid gap-6 p-6 md:grid-cols-3 mt-10 max-w-6xl mx-auto">
      {/* Left Section */}
      <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          Orgnized Events <FaEye className="text-gray-500" />
        </h2>
        <p className="text-4xl font-bold mt-2">
          {events.length} <span className="text-red-500">↗</span>
        </p>
        <div className="mt-4 space-y-3">
          {events.map((event, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg"
            >
              <div>
                <p className="font-medium">{event.eventName}</p>
                <p className="text-sm text-gray-500">{event.eventId}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Section (Chart) */}
      <div className="bg-white p-6 rounded-2xl shadow-lg md:col-span-2 flex justify-center items-center">
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 20, left: -10, bottom: 0 }}
          >
            <XAxis dataKey="month" className="text-gray-500 text-sm" />
            <YAxis className="text-gray-500 text-sm" />
            <Tooltip
              contentStyle={{ backgroundColor: "white", borderRadius: "8px" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#ff4d4d"
              fill="#ff4d4d"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default EventDashboard;

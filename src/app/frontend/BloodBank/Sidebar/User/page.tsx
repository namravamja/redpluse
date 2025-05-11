"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAppSelector } from "../../../../lib/hooks";
import { RootState } from "../../../../lib/store";
import { Droplet } from "lucide-react";
import { useGetUserDataQuery } from "@/app/lib/BloodBank";

export default function Page() {
  const pathname = usePathname();
  const collapsed = useAppSelector((state: RootState) => state.Collapsed);

  const { data, error, isLoading } = useGetUserDataQuery([]);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: </div>;
  if (!data) return <div>No user data available</div>;

  return (
    <>
      <Link href="/frontend/BloodBank/Profile" className="w-full no-underline">
        <div
          className={`flex p-3 items-center justify-center space-x-6 hover:bg-red-900 ${
            pathname.startsWith("/frontend/BloodBank/Profile")
              ? "bg-red-600 border-l-[#FED201] border-l-8"
              : ""
          } `}
        >
          <div className={`flex flex-shrink-0  items-center justify-center`}>
            <Droplet size={40} strokeWidth={2} color="white" />
          </div>
          <div>
            <div
              className={`font-[700] text-[20px] text-white ${
                collapsed ? "hidden" : "block"
              }`}
            >
              {data.BloodBankName || "Guest"}
            </div>
            <div
              className={`font-[700] text-[20px] opacity-80 text-white ${
                collapsed ? "hidden" : "block"
              }`}
            >
              Blood Bank
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}

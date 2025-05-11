"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAppSelector } from "../../../../lib/hooks";
import { RootState } from "../../../../lib/store";
import { useGetUserDataQuery } from "@/app/lib/EventOrganizer";
import { FaUser } from "react-icons/fa";

export default function Page() {
  const pathname = usePathname();
  const collapsed = useAppSelector((state: RootState) => state.Collapsed);

  const { data, error, isLoading } = useGetUserDataQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: </div>;
  if (!data) return <div>No user data available</div>;

  return (
    <>
      <Link
        href="/frontend/EventOrganizer/Profile "
        className="w-full no-underline"
      >
        <div
          className={`flex p-3 items-center justify-center space-x-6 hover:bg-green-800 ${
            pathname.startsWith("/frontend/Donor/Profile")
              ? "bg-green-600 border-l-[#FED201] border-l-8"
              : ""
          } `}
        >
          <div
            className={`flex flex-shrink-0  items-center justify-around ml-4 `}
          >
            <FaUser className="text-white text-5xl" />
          </div>
          <div>
            <div
              className={`font-[700] text-[20px] text-white ${
                collapsed ? "hidden" : "block"
              }`}
            >
              {data.EventOrganizerName || "Guest"}
            </div>
            <div
              className={`font-[700] text-[20px] opacity-80 text-white ${
                collapsed ? "hidden" : "block"
              }`}
            >
              Event Organizer
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}

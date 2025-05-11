"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "../../../../lib/hooks";
import { RootState } from "../../../../lib/store";
import { useGetUserDataQuery } from "@/app/lib/Donor";

export default function Page() {
  const pathname = usePathname();
  const collapsed = useAppSelector((state: RootState) => state.Collapsed);

  const { data, error, isLoading } = useGetUserDataQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  if (isLoading)
    return <div className="text-center p-3 text-blue-950">Loading...</div>;
  if (error) return <div className="text-center p-3 text-red-500">Error: </div>;
  if (!data)
    return (
      <div className="text-center p-3 text-blue-950">
        No user data available
      </div>
    );

  return (
    <>
      {/* Font imports */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&display=swap");
      `}</style>

      <Link href="/frontend/Donor/Profile" className="w-full no-underline">
        <div
          className={`flex p-3 items-center justify-center space-x-6 hover:bg-blue-800 transition-colors duration-200 ${
            pathname.startsWith("/frontend/Donor/Profile")
              ? "bg-blue-800 border-l-white border-l-8"
              : ""
          } `}
        >
          <div
            className={`flex flex-shrink-0 items-center justify-center ml-4`}
          >
            <Image
              src={data.ProfilePhoto || "/Avatar.svg"}
              alt="user image"
              width={collapsed ? 25 : 50}
              height={collapsed ? 25 : 50}
              className="rounded-full object-cover border-2 border-white"
            />
          </div>
          <div>
            <div
              className={`font-heading font-bold text-[20px] text-white ${
                collapsed ? "hidden" : "block"
              }`}
            >
              {data.fullName || "Guest"}
            </div>
            <div
              className={`font-heading font-semibold text-[16px] opacity-80 text-white ${
                collapsed ? "hidden" : "block"
              }`}
            >
              Donor
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}

"use client";
import Link from "next/link";
import Collaps from "../Collaps/page";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLogout } from "../../components/Logout";
import { useGetAllBloodDetailsQuery } from "@/app/lib/BloodBank";
import { useGetAllEventsQuery } from "@/app/lib/EventOrganizer";

const Page = () => {
  const logout = useLogout();
  const pathname = usePathname();

  const { refetch } = useGetAllBloodDetailsQuery();
  const { refetch: refactor } = useGetAllEventsQuery();

  return (
    <div className=" flex items-center justify-between w-full bg-gradient-to-r from-blue-800 to-blue-900 h-20 shadow-md px-4 sm:px-6 lg:px-8">
      <div>
        <Collaps />
      </div>

      <div className="hidden md:flex space-x-6">
        <Link href="/frontend/Donor/ViewEvent" passHref>
          <Button
            onClick={refactor}
            className={`font-semibold px-6 py-2 rounded-full shadow-md transition duration-200 ${
              pathname.includes("/frontend/Donor/ViewEvent")
                ? "bg-blue-800 text-white border-2 border-white hover:bg-blue-700"
                : "bg-white text-blue-900 hover:bg-gray-200"
            }`}
          >
            View Events
          </Button>
        </Link>
        <Link href="/frontend/Donor/ViewBloodBank" passHref>
          <Button
            onClick={refetch}
            className={`font-semibold px-6 py-2 rounded-full shadow-md transition duration-200 ${
              pathname.includes("/frontend/Donor/ViewBloodBank")
                ? "bg-blue-800 text-white border-2 border-white hover:bg-blue-700"
                : "bg-white text-blue-900 hover:bg-gray-200"
            }`}
          >
            View Blood Bank
          </Button>
        </Link>
      </div>

      <div className="flex items-center space-x-3">
        <Button
          onClick={logout}
          className="bg-transparent hover:bg-blue-900 shadow-none"
        >
          <div className="w-10 h-10 overflow-hidden border-white">
            <Image
              src="/Logo.png"
              alt="User Profile"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
        </Button>
      </div>
    </div>
  );
};

export default Page;

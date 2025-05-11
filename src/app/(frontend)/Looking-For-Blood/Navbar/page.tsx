"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Page = () => {
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-between w-full bg-gradient-to-r from-red-800 to-red-900 h-[80px] shadow-md px-4 sm:px-6 lg:px-8">
      <div></div>
      <div className="hidden md:flex space-x-6">
        <Link href=" /Looking-For-Blood/ViewBloodBank">
          <Button
            // onClick={refetch}
            className={`bg-white text-red-900 font-semibold px-6 py-2 rounded-full shadow-md hover:bg-gray-200 ${
              pathname == " /Looking-For-Blood/ViewBloodBank"
                ? "bg-red-900 text-white border-2 border-white hover:bg-red-900"
                : "bg-white text-red-900"
            }`}
          >
            View Blood Banks
          </Button>
        </Link>
      </div>

      <div className="flex items-center space-x-3">
        <Link href=" /">
          <div className="w-10 h-10 overflow-hidden  border-white">
            <Image
              src="/Logo.png"
              alt="User Profile"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Page;

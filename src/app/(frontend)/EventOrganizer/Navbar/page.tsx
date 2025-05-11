"use client";
import Collaps from "../Collaps/page";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useLogout } from "../../components/Logout";

const Page = () => {
  const logout = useLogout();
  return (
    <div className="flex items-center justify-between w-full bg-gradient-to-r from-green-700 to-green-700 h-[80px] shadow-md px-4 sm:px-6 lg:px-8">
      <div>
        <Collaps />
      </div>

      <div className="flex items-center space-x-3">
        <Button
          onClick={logout}
          className="bg-transparent hover:bg-green-900 shadow-none"
        >
          <div className="w-10 h-10 overflow-hidden  border-white">
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

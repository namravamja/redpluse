"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "../../../../lib/hooks";
import { RootState } from "../../../../lib/store";
import { usePathname } from "next/navigation";

export default function Page() {
  const pathname = usePathname();
  const collapsed = useAppSelector((state: RootState) => state.Collapsed);

  const url = "/frontend/admin/Logout";
  return (
    <>
      <Link
        href={"/frontend/admin/Logout"}
        className={`flex no-underline gap-4 items-center  justify-start pl-10  w-full h-16  hover:bg-red-900   ${
          pathname === url ? `bg-red-600 border-l-[#FED201] border-l-8` : null
        }   `}
      >
        <div className={`${collapsed ? "-ml-5" : " "}`}>
          <LogOut color="white" />
        </div>
        <div
          className={`font-[600]  text-white text-[18px] ${
            collapsed ? "hidden" : "block"
          }`}
        >
          Logout
        </div>
      </Link>
    </>
  );
}

"use client";

import { LogOut } from "lucide-react";
import { useAppSelector } from "../../../../lib/hooks";
import { RootState } from "../../../../lib/store";
import { usePathname } from "next/navigation";
import { useLogout } from "../../../components/Logout";

export default function Page() {
  const pathname = usePathname();
  const collapsed = useAppSelector((state: RootState) => state.Collapsed);
  const logout = useLogout();

  return (
    <>
      <button
        onClick={logout}
        className={`flex no-underline gap-4 items-center justify-start pl-10 w-full h-16 hover:bg-red-900 ${
          pathname === "/admin/Logout"
            ? `bg-red-600 border-l-[#FED201] border-l-8`
            : ""
        }`}
      >
        <div className={`${collapsed ? "-ml-5" : ""}`}>
          <LogOut color="white" />
        </div>
        <div
          className={`font-[600] text-white text-[18px] ${
            collapsed ? "hidden" : "block"
          }`}
        >
          Logout
        </div>
      </button>
    </>
  );
}

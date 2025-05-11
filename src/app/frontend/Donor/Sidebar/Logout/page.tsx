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
      {/* Font imports */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&display=swap");
      `}</style>

      <button
        onClick={logout}
        className={`flex no-underline gap-4 items-center justify-start pl-10 w-full h-16 hover:bg-blue-800 transition-colors duration-200 ${
          pathname === "/frontend/admin/Logout"
            ? `bg-blue-950 border-l-white border-l-8`
            : ""
        }`}
      >
        <div className={`${collapsed ? "-ml-5" : ""}`}>
          <LogOut color="white" />
        </div>
        <div
          className={`font-heading font-semibold text-white text-[18px] ${
            collapsed ? "hidden" : "block"
          }`}
        >
          Logout
        </div>
      </button>
    </>
  );
}

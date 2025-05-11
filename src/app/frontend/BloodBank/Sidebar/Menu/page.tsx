"use client";

import { useAppSelector } from "../../../../lib/hooks";
import { RootState } from "../../../../lib/store";
import { CheckCircle, LayoutDashboard, Plus, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuItem {
  icon: React.ElementType;
  label: string;
  link: string;
}

const menuItems: MenuItem[] = [
  {
    icon: Settings,
    label: "UpdateProfile",
    link: "/frontend/BloodBank/UpdateProfile",
  },
  {
    icon: Plus,
    label: "Collected Blood Dertails",
    link: "/frontend/BloodBank/CollectedBloodDetails",
  },
  {
    icon: CheckCircle,
    label: "Supplied Blood Dertails",
    link: "/frontend/BloodBank/SuppliedBloodDetails",
  },
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    link: "/frontend/BloodBank/Dashboard",
  },
];

export default function Page() {
  const pathname = usePathname();
  const collapsed = useAppSelector((state: RootState) => state.Collapsed);

  return (
    <>
      <div className="flex flex-col mt-5 w-full">
        {menuItems.map((item, index) => (
          <Link href={item.link} key={index} className="w-full no-underline">
            <div
              className={`flex items-center w-full h-16 space-x-4 hover:bg-red-900 ${
                pathname.startsWith(item.link) // Check if pathname starts with the item's link
                  ? "bg-red-600 border-l-[#FED201] border-l-8"
                  : ""
              }`}
            >
              <div className={`${collapsed ? "ml-4" : "ml-8"}`}>
                <item.icon size={24} color="white" />
              </div>
              <div
                className={`font-[600] text-white text-[18px] ${
                  collapsed ? "hidden" : "block"
                }`}
              >
                {item.label}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

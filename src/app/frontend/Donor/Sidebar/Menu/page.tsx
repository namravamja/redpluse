"use client";

import { useAppSelector } from "../../../../lib/hooks";
import { RootState } from "../../../../lib/store";
import { FileHeart, Settings, Trophy } from "lucide-react";
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
    label: "Update Profile",
    link: "/frontend/Donor/MakeProfile",
  },
  {
    icon: FileHeart,
    label: "Certification",
    link: "/frontend/Donor/Certification",
  },
  {
    icon: Trophy,
    label: "Reward",
    link: "/frontend/Donor/Reward",
  },
];

export default function Page() {
  const pathname = usePathname();
  const collapsed = useAppSelector((state: RootState) => state.Collapsed);

  return (
    <>
      {/* Font imports */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&display=swap");
      `}</style>

      <div className="flex flex-col mt-5 w-full">
        {menuItems.map((item, index) => (
          <Link href={item.link} key={index} className="w-full no-underline">
            <div
              className={`flex items-center w-full h-16 space-x-4 hover:bg-blue-600/100 transition-colors duration-200 ${
                pathname.startsWith(item.link) // Check if pathname starts with the item's link
                  ? "bg-blue-800 border-l-white border-l-8"
                  : ""
              }`}
            >
              <div className={`${collapsed ? "ml-4" : "ml-8"}`}>
                <item.icon size={24} color="white" />
              </div>
              <div
                className={`font-heading font-semibold text-white text-[18px] ${
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

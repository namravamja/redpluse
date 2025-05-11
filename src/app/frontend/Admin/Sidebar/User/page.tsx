"use client";
import { useAppSelector } from "../../../../lib/hooks";
import { RootState } from "../../../../lib/store";
import { UserCog } from "lucide-react";

export default function Page() {
  const collapsed = useAppSelector((state: RootState) => state.Collapsed);

  return (
    <>
      <div className="flex gap-5 items-center justify-between h-16 mb-5">
        <div className={` items-center justify-around`}>
          <UserCog size={35} strokeWidth={3} color="white" />
        </div>
        <div
          className={`font-[1000] text-4xl text-white ${
            collapsed ? "hidden" : "block"
          }`}
        >
          ADMIN
        </div>
      </div>
    </>
  );
}

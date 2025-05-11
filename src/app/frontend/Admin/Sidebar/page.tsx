"use client";
import User from "./User/page";
import Logout from "./Logout/page";
import Menu from "./Menu/page";
import { useAppSelector } from "@/app/lib/hooks";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Page() {
  const mainRef = useRef<HTMLDivElement>(null);
  const collapsed = useAppSelector((state) => state.Collapsed);

  useGSAP(() => {
    if (mainRef.current) {
      gsap.to(mainRef.current, {
        width: collapsed ? "60px" : "325px",
        duration: 0.5,
        ease: "power2.inOut",
      });
    }
  }, [collapsed]);

  return (
    <>
      <div
        className={`fixed h-[100vh] bg-red-950 top-0 left-0 ${
          collapsed ? "w-[60px]" : "w-[325px]"
        }`}
        ref={mainRef}
      >
        <div className="flex w-full flex-col items-start justify-around h-full">
          <div className="flex flex-col justify-start items-center w-full h-1/2">
            <User />
            <Menu />
          </div>
          <Logout />
        </div>
      </div>
    </>
  );
}

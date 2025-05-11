"use client";
import React, { useRef } from "react";
import Sidebar from "./Sidebar/page";
import Navbar from "./Navbar/page";
import { useAppSelector } from "../../lib/hooks";
import { RootState } from "../../lib/store";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const HomepageLayout = ({ children }: { children: React.ReactNode }) => {
  const collapsed = useAppSelector((state: RootState) => state.Collapsed);
  const mainRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (mainRef.current) {
      gsap.to(mainRef.current, {
        marginLeft: collapsed ? "60px" : "325px",
        duration: 0.5,
        ease: "power2.inOut",
      });
    }
  }, [collapsed]);

  return (
    <div>
      <Sidebar />
      <main ref={mainRef}>
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default HomepageLayout;

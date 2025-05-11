"use client";
import React, { useEffect, useRef } from "react";
import Navbar from "./Navbar/page";
import { useAppSelector } from "../../lib/hooks";
import { RootState } from "../../lib/store";
import { gsap } from "gsap";

const HomepageLayout = ({ children }: { children: React.ReactNode }) => {
  const collapsed = useAppSelector((state: RootState) => state.Collapsed);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mainRef.current) {
      gsap.to(mainRef.current, {
        marginLeft: collapsed ? "" : "",
        duration: 0.5,
        ease: "power2.inOut",
      });
    }
  }, [collapsed]);

  return (
    <div>
      <main ref={mainRef}>
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default HomepageLayout;

import React from "react";
import HeroSection from "./HeroSection/page";
import Section1 from "./Section1/page";
import Section2 from "./Section2/page";
import Section3 from "./Section3/page";
import Section4 from "./Section4/page";
import Section5 from "./Section5/page";

const page = () => {
  return (
    <>
      <div className="flex flex-col justify-between items-center">
        <HeroSection />
        <Section1 />
        <Section2 />
        <Section3 />
        <Section4 />
        <Section5 />
      </div>
    </>
  );
};

export default page;

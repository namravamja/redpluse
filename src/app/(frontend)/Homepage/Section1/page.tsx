"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const Page = () => {
  const redElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (redElementRef.current) {
      gsap.to(redElementRef.current, {
        height: "400px",
        scrollTrigger: {
          trigger: redElementRef.current,
          start: "-1300% center",
          end: "-300% 50%",
          // markers: true,
          scrub: 1,
        },
      });
    }
  }, []);

  return (
    <div className="h-[calc(100vh-120px)] mt-[140px] w-full flex justify-center items-center bg-white">
      <div className="h-full w-1/2 flex-col flex justify-start items-center">
        <div className="flex flex-col justify-start items-center relative">
          <div className="relative top-0">
            <Image
              src="/backBottel.svg"
              alt="Blood Drop"
              width={400}
              height={400}
            />
          </div>
          <div className="absolute bottom-20">
            <div
              className="w-[280px] h-[40px] bg-[#BB1616] opacity-80 rounded-b-2xl"
              ref={redElementRef}
            ></div>
          </div>
          <div className="absolute top-[100px]">
            <Image
              src="/frontBottel.svg"
              alt="Blood Drop"
              width={200}
              height={200}
            />
          </div>
        </div>
      </div>

      <div className="w-1/2 h-full flex flex-col justify-start items-start gap-4">
        <div className="text-[100px] leading-none font-extrabold">
          About Our Mission
        </div>
        <div className="text-[20px] text-left text-gray-600 opacity-80 font-bold mt-2 w-[600px]">
          At the heart of our organization is a deep-rooted commitment to
          community health and well-being. We believe that every blood donation
          has the power to transform lives, and we are dedicated to fostering a
          culture of selfless giving
        </div>
        <div>
          <ul className="text-[30px] text-left text-gray-900 opacity-80 gap-4 flex flex-col font-bold mt-2 w-[600px]">
            {[
              "Convenient Locations",
              "Flexible Scheduling",
              "Personalized Guidance",
              "Donor Rewards",
            ].map((item) => (
              <li key={item}>
                <Image
                  src="/BloodDrop.svg"
                  alt="Blood Drop"
                  width={40}
                  height={40}
                  className="inline-block mr-2"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Link href=" /Seeker/ViewBloodBank">
            <Button
              type="submit"
              className="h-14 border-4 rounded-3xl mt-8 bg-red-600 text-white p-2 font-extrabold pl-8 pr-8 text-[16px] hover:bg-white hover:text-red-600 border-red-600"
            >
              Find Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;

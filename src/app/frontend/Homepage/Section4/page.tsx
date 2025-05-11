import React from "react";
import Card from "./Card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const options = [
  {
    title: "Donate Today",
    img: "../../Empower1.svg",
    text: "Your donation can make all the difference in someone life. Sign up now and become a part of our mission to save lives",
  },
  {
    title: "Give Back",
    img: "../../Empower2.svg",
    text: "Together, we can build a more resilient and healthy community. Your contribution, no matter how small, can have a profound impact on those in need",
  },
  {
    title: "Get Involved",
    img: "../../Empower3.svg",
    text: "Your donation can save up to three lives. Join our mission and make a lasting difference in your community",
  },
];

const page = () => {
  return (
    <div className="h-auto mt-[140px]  w-full flex justify-center items-center bg-white">
      <div className="h-full  w-full flex-col flex justify-center items-center">
        <div className="text-[80px] w-[900px] text-center leading-none  font-extrabold">
          Become a Lifesaver
        </div>
        <div className="text-[30px] text-center text-gray-600 opacity-80 font-bold mt-4 w-[600px] ">
          Your Donation Matters!
        </div>
        <Link href="/frontend/DonorRegistration" passHref>
          <Button
            type="submit"
            className="h-14 border-4 border-red-600 rounded-3xl mt-8  bg-red-600 text-white p-2 font-extrabold pl-8 pr-8 text-[16px] hover:bg-white hover:text-red-600   "
          >
            Donate Now
          </Button>
        </Link>
        <div className="flex gap-5 mt-10">
          {options.map((option) => (
            <Card
              title={option.title}
              img={option.img}
              text={option.text}
              key={option.title}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;

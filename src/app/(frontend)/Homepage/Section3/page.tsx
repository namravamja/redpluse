import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const page = () => {
  return (
    <div className="h-[calc(100vh-120px)]  mt-[60px]  w-10/12 flex justify-center items-center  bg-white">
      <div className="w-3/5 h-full p-20  flex flex-col justify-start items-start gap-4">
        <div className="text-[100px] leading-none  font-extrabold">
          Our Donation Process
        </div>
        <div className="text-[20px] text-left text-gray-600 opacity-80 font-bold mt-2 w-[600px]">
          At blood donation centers, we strive to provide a seamless and
          comfortable experience for our donors
        </div>
        <div>
          <ul className="text-[30px] text-left text-gray-900 opacity-80 gap-4 flex flex-col font-bold mt-2 w-[600px]">
            <li>
              <Image
                src="../../BloodDrop.svg"
                alt="Blood Drop"
                width={40}
                height={40}
                className="inline-block mr-2"
              />
              Donor Testimonials
            </li>
            <li>
              <Image
                src="../../BloodDrop.svg"
                alt="Blood Drop"
                width={40}
                height={40}
                className="inline-block mr-2"
              />
              Donor Stories
            </li>
          </ul>
        </div>
        <div className="flex gap-10">
          <Link href="/Login/EventOrganizer">
            <Button
              type="submit"
              className="h-14 border-4  rounded-3xl mt-8  bg-red-600 text-white p-2 font-extrabold pl-8 pr-8 text-[16px] hover:bg-white hover:text-red-600 border-red-600  "
            >
              Schedule Appointment
            </Button>
          </Link>
          <Link href="/Login/Donor">
            <Button
              type="submit"
              className="h-14 border-4 rounded-3xl mt-8  bg-red-600 text-white p-2 font-extrabold pl-8 pr-8 text-[16px] hover:bg-white hover:text-red-600 border-red-600  "
            >
              Donor Rewards
            </Button>
          </Link>
        </div>
      </div>
      <div className="h-full mt-40 w-2/5 flex-col flex justify-center items-center ">
        <Image src="../../Table.svg" alt="table" width={600} height={600} />
      </div>
    </div>
  );
};

export default page;

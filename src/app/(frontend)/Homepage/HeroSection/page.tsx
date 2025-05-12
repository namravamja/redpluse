import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function page() {
  return (
    <div className="h-auto mt-[120px]  w-full flex justify-center items-center bg-white">
      <div className="h-full  w-full flex-col flex justify-start items-center mt-32">
        <div className="flex flex-col justify-start items-center gap-4">
          <div className="text-[120px] font-extrabold text-red-800 text-center h-[100px]  flex justify-center items-center">
            Your Blood,
          </div>
          <div className="text-[120px] font-extrabold text-red-800 text-center h-[100px]  flex justify-center items-center">
            Save Lives
          </div>
          <div className="w-[900px] text-[24px] text-center text-black font-bold mt-8">
            Welcome to our blood donation website, where we strive to make a
            meaningful difference in people lives. Our mission is to connect
            donors with those in need, ensuring a steady supply of this vital
            resource
          </div>
        </div>
        <div>
          <div className="flex w-full   items-center gap-4 mt-24">
            <Input
              type="email"
              placeholder="Become a Donor"
              className="w-[700px] pl-10 text-[16px] border-2 rounded-3xl h-14"
            />
            <Link href="/Login/Donor" passHref>
              <Button
                type="submit"
                className="h-14 border-4 border-red-600 rounded-3xl  bg-red-600 text-white p-2 font-extrabold pl-8 pr-8 text-[16px] hover:bg-white hover:text-red-600   "
              >
                Donate Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import Collaps from "../Collaps/page";
import Image from "next/image";

const Page = () => {
  return (
    <div className="flex items-center justify-between w-full bg-gradient-to-r from-red-800 to-red-900 h-[80px] shadow-md px-4 sm:px-6 lg:px-8">
      <div>
        <Collaps />
      </div>

      <div className="flex items-center space-x-3">

      <Link href="/frontend/Homepage" >
        <div className="w-10 h-10 overflow-hidden  border-white">
          <Image
            src="/Logo.png"
            alt="User Profile"
            width={40}
            height={40}
            className="object-cover"
            />
        </div>
        </Link>
      </div>
    </div>
  );
};

export default Page;

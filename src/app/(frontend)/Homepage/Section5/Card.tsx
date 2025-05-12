import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface CardProps {
  title: string;
  img: string;
  text: string;
  button: string;
  link: string;
}

const Card: React.FC<CardProps> = ({ title, img, text, button, link }) => {
  return (
    <Link
      href={link}
      className="w-[300px] h-[500px] flex flex-col justify-start border-2 border-black items-center p-5 bg-white shadow-2xl rounded-sm  m-4"
    >
      <div>
        <Image src={img} alt="image" width={80} height={80} />
      </div>
      <div className="text-[24px] text-center text-black font-bold mt-10">
        {title}
      </div>
      <div className="text-[18px] text-center text-gray-600 opacity-80 font-bold mt-4 ">
        {text}
      </div>
      <div>
        {" "}
        <Button
          type="submit"
          className="h-14 border-4 rounded-3xl mt-8  bg-red-600 text-white p-2 font-extrabold pl-8 pr-8 text-[16px] hover:bg-white hover:text-red-600 border-red-600  "
        >
          {button}
        </Button>
      </div>
    </Link>
  );
};

export default Card;

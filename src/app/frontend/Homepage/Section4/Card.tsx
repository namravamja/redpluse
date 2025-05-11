import Image from 'next/image'

interface CardProps {
  title: string;
  img: string;
  text: string;
}

const Card: React.FC<CardProps> = ({title, img, text}) => {
  return (
    <div className='w-[300px] h-[400px] flex flex-col justify-start border-2 border-black items-center p-5 bg-white shadow-2xl rounded-sm  m-4'>
        <div><Image src={img} alt="image" width={80} height={80} /></div>
        <div className='text-[24px] text-center text-black font-bold mt-10'>{title}</div> 
        <div className='text-[18px] text-center text-gray-600 opacity-80 font-bold mt-4 '>{text}</div>
    </div> 
  )
}

export default Card

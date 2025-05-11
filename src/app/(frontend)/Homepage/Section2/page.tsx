import React from 'react'
import Card from './Card'

const options = [
    { title: 'Donate Today', img: '../../Empower1.svg', text: 'Your donation can make all the difference in someone life. Sign up now and become a part of our mission to save lives' },
    { title: 'Give Back',img: '../../Empower2.svg', text: 'Together, we can build a more resilient and healthy community. Your contribution, no matter how small, can have a profound impact on those in need' },
    { title: 'Get Involved', img: '../../Empower3.svg', text: 'Your donation can save up to three lives. Join our mission and make a lasting difference in your community' },
]

const page = () => {
  return (
    <div className='h-auto mt-[200px]  w-full flex justify-center items-center bg-white'>
      <div className='h-full  w-full flex-col flex justify-center items-center'>
      
        <div className='text-[80px] w-[900px] text-center leading-none  font-extrabold'>Empowering Blood Donation</div>
        <div className='text-[30px] text-center text-gray-600 opacity-80 font-bold mt-2 w-[600px]'>Join Our Lifesaving Cause</div>
        <div className='flex gap-5 mt-10'>
           {options.map((option) => (
                <Card title={option.title} img={option.img} text={option.text} key={option.title} />
           ))}
        </div>
    </div>
   </div>
  )
}

export default page

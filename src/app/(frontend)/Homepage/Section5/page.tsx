import React from 'react'
import Card from './Card'

const options = [
    { button: 'Register Now', title: 'Get Started', img: '../../About1.svg', text: 'Signing up with RED+ is quick and easy. Simply create an account, fill in your personal details, and start your journey as a lifesaving donor' },
    { button: 'Get Involved', title: 'Our Mission',img: '../../About2.svg', text: 'At the heart of RED+ is a deep-rooted commitment to community health and well-being and immediate impact on someone life and  impact on someone life' },
    { button: 'Donate Now', title: 'Why Donate Blood?', img: '../../About3.svg', text: 'Donating blood is a simple yet powerful act of compassion. Its a way for you to make a direct and immediate impact on someone life' },
    { button: 'Check Location', title: 'Donor Locations', img: '../../About4.svg', text: 'We have a network of convenient blood donation centers across the region, making it easy for you to find a location that works best for you ' },
]

const page = () => {
  return (
    <div className='h-auto mt-[80px]  w-full flex justify-center items-center bg-white'>
      <div className='h-full  w-full flex-col flex justify-center items-center'>
      
        <div className='text-[80px] w-[900px] text-center leading-none  font-extrabold'>Empowering Blood Donation</div>
        <div className='text-[30px] text-center text-gray-600 opacity-80 font-bold mt-2 w-[600px]'>Join Our Lifesaving Cause</div>
        <div className='flex gap-5 mt-10'>
           {options.map((option) => (
                <Card title={option.title} img={option.img} text={option.text} key={option.title} button={option.button}/>
           ))}
        </div>
    </div>
   </div>
  )
}

export default page

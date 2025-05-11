import React from 'react'
import Image from 'next/image'
import Logo from '../../../../public/Logo.png'

const footerSections = [
  {
    title: 'Quick Links',
    links: ['Home', 'About Us', 'Services', 'Contact']
  },
  {
    title: 'Explore',
    links: ['Blog', 'Careers', 'Events', 'Gallery']
  },
  {
    title: 'Connect',
    links: ['Facebook', 'Twitter', 'LinkedIn', 'Instagram']
  }
]

const page = () => {
  return (
    <div className='h-[350px] mt-10 flex justify-end w-full bg-gradient-to-r from-red-600 to-red-950 p-10 text-white'>
        <div className='w-1/3 p-20 pt-14'>
            <Image src={Logo} alt="logo" width={120} height={120}></Image>
        </div>
      <div className='grid grid-cols-3 w-2/3 gap-10'>
        {footerSections.map((section, index) => (
          <div key={index}>
            <h2 className='font-bold text-2xl mb-4'>{section.title}</h2>
            <ul className='text-[16px] flex flex-col gap-4'>
              {section.links.map((link, idx) => (
                <li key={idx} className='hover:text-gray-400'><a href='#'>{link}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default page
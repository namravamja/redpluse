'use client';

import Image from 'next/image';
import gsap from 'gsap';
import Logo from '../../../../public/Logo.png';
import Link from 'next/link';
import { useRef } from 'react';

const options = [
    { name: 'Looking for Blood', href: '/Looking-For-Blood/ViewBloodBank' },
    { name: 'Want to Donate Blood', href: '/Login/Donor' },
    { name: 'Organize Event', href: '/Login/EventOrganizer' },
    { name: 'Blood Bank', href: '/Login/BloodBank' },
];

const Page: React.FC = () => {
    // Create an array of refs
    const bgDivRefs = useRef<(HTMLDivElement | null)[]>([]);

    const handleMouseEnter = (index: number) => {
        if (bgDivRefs.current[index]) {
            gsap.killTweensOf(bgDivRefs.current[index]); // Stop any ongoing animations
            gsap.to(bgDivRefs.current[index], {
                top: 0,
                scale: 1.1,
                duration: 0.4,
                ease: "power2.out"
            });
        }
    };

    const handleMouseLeave = (index: number) => {
        if (bgDivRefs.current[index]) {
            gsap.killTweensOf(bgDivRefs.current[index]); // Stop any ongoing animations
            gsap.to(bgDivRefs.current[index], {
                top: "40px",
                scale: 0,
                duration: 0.4,
                ease: "power2.out",
                onComplete: () => {
                    gsap.set(bgDivRefs.current[index], { clearProps: "all" }); // Reset styles after animation
                }
            });
        }
    };

    return (
        <>
            <div className='w-full h-auto bg-gradient-to-r from-red-600 to-red-950 flex justify-center items-center drop-shadow-2xl shadow-2xl fixed top-0 z-50'>
                <div className='w-10/12 h-[120px] flex justify-between items-center relative'>
                    <div className='flex justify-center items-center'>
                        <Image src={Logo} alt='logo' width={80} height={80} />
                    </div>
                    <div className='flex gap-10 justify-center items-center'>
                        {options.map((option, index) => (
                            <Link href={option.href} key={option.name}>
                                <div className='relative w-fit h-fit'>
                                    <button
                                        className='border overflow-hidden z-0 p-2 pl-4 pr-4 rounded-3xl font-extrabold text-red-950 bg-white relative hover:text-white'
                                        onMouseEnter={() => handleMouseEnter(index)}
                                        onMouseLeave={() => handleMouseLeave(index)}
                                    >
                                        <div
                                            ref={(el) => {(bgDivRefs.current[index] = el)}}
                                            className='absolute top-[40px] left-0 w-full h-full rounded-3xl border bg-red-900 p-1 pl-4 pr-4 z-0'
                                        ></div>
                                        <div className='relative z-10'>{option.name}</div>
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Page;

import React from 'react'
import { Button } from './ui/button';
import sectionImg from '../assets/section.jpg';
const Hero = () => {
    return (
        <section className='bg-gradient-to-r from-blue-500 to-purple-800 text-white py-16'>
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h1 className="text-xl md:text-6xl font-bold mb-4">NEW SEASON ARRIVALS</h1>
                        <p className='text-lg pb-5'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button className='bg-white text-blue-600 hover:bg-gray-100'>Shop Now</Button>
                            <Button variant='outline' className='border-white text-white hover:bg-white hover:text-blue-600 bg-transparent'>View Deals</Button>
                        </div>
                    </div>
                    {/* <div className="relative">
                        <img src={sectionImg} alt="image" className='rounded-lg shadow-2xl w-[300px] h-[500px]' />
                    </div> */}
                </div>
            </div>
        </section>
    )
}

export default Hero;

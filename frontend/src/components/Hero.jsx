import React from 'react'
import {
    Gift,
    Heart,
    Tag,
} from "lucide-react";
import { useNavigate } from 'react-router-dom'

import Section from '../assets/section.jpg'

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className="w-full bg-pink-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">

                {/* Main Hero */}
                <div className="grid lg:grid-cols-2 items-center gap-14">

                    {/* Left Content */}
                    <div className="space-y-8">
                        <div className="space-y-5">

                            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold leading-tight text-gray-900">
                                Elevate Your
                                <span className="block text-pink-500 italic font-semibold">
                                    Everyday Style
                                </span>
                            </h1>

                            <p className="text-gray-600 text-lg leading-relaxed max-w-lg">
                                Trendy outfits, premium quality & effortless looks —
                                all in one place.
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-wrap items-center gap-5">

                            <button
                                onClick={() => navigate('/products')}
                                className="bg-pink-500 hover:bg-pink-600 cursor-pointer transition-all duration-300 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-pink-200 hover:scale-105"
                            >
                                Shop Now
                            </button>

                            <button
                                onClick={() => navigate('/products')}
                                className="group flex items-center gap-2 cursor-pointer text-gray-800 font-semibold hover:text-pink-500 transition-all duration-300"
                            >
                                Explore Collection

                                <span className="group-hover:translate-x-1 transition-transform duration-300">
                                    →
                                </span>
                            </button>

                        </div>

                    </div>

                    {/* Right Side Image */}
                    <div className="relative flex justify-center">

                        {/* Background Circle */}
                        <div className="absolute w-[500px] h-[500px] bg-pink-100 rounded-full blur-3xl opacity-70"></div>

                        <div className="relative z-10">
                            <img
                                src={Section}
                                alt="Fashion"
                                className="w-full max-w-[580px] rounded-[40px] shadow-2xl object-cover"
                            />

                            {/* Floating Card */}
                            <div className="absolute -bottom-8 -left-8 bg-white/80 backdrop-blur-lg shadow-xl rounded-3xl p-5 border border-white">
                                <p className="text-sm text-gray-500">New Arrival</p>
                                <h3 className="text-xl font-bold text-gray-800">
                                    Summer Collection
                                </h3>
                                <p className="text-pink-500 font-semibold mt-1">
                                    Up to 50% Off
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Info Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-20">

                    <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-md hover:shadow-xl transition duration-300">
                        <div className="bg-pink-100 w-fit p-3 rounded-full mb-4">
                            <Gift className="text-pink-500" />
                        </div>
                        <h4 className="font-bold text-gray-800">New Arrivals</h4>
                        <p className="text-gray-500 text-sm mt-1">
                            Shop latest trends
                        </p>
                    </div>

                    <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-md hover:shadow-xl transition duration-300">
                        <div className="bg-pink-100 w-fit p-3 rounded-full mb-4">
                            <Tag className="text-pink-500" />
                        </div>
                        <h4 className="font-bold text-gray-800">Huge Discounts</h4>
                        <p className="text-gray-500 text-sm mt-1">
                            Up to 50% off today
                        </p>
                    </div>

                    <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-md hover:shadow-xl transition duration-300">
                        <div className="bg-pink-100 w-fit p-3 rounded-full mb-4">
                            <Gift className="text-pink-500" />
                        </div>
                        <h4 className="font-bold text-gray-800">Exclusive Offers</h4>
                        <p className="text-gray-500 text-sm mt-1">
                            Special deals for you
                        </p>
                    </div>

                    <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-md hover:shadow-xl transition duration-300">
                        <div className="bg-pink-100 w-fit p-3 rounded-full mb-4">
                            <Heart className="text-pink-500" />
                        </div>
                        <h4 className="font-bold text-gray-800">Timeless Fashion</h4>
                        <p className="text-gray-500 text-sm mt-1">
                            Style for every occasion
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero;

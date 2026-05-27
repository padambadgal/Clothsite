import { Headphones, Shield, Truck,BadgeCheck,ShieldCheck   } from 'lucide-react'
import React from 'react'


const Features = () => {
    return (
        <section className='py-12 '>
            <div className="max-w-7xl flex flex-wrap  justify-around mx-auto px-4">
                <div className="flex items-center gap-3">
                    <div className="bg-pink-100 p-3 rounded-full">
                        <BadgeCheck className="text-pink-500 w-6 h-6" />
                    </div>

                    <span className="text-gray-700 font-medium">
                        Premium Quality
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-pink-100 p-3 rounded-full">
                        <Truck className="text-pink-500 w-6 h-6" />
                    </div>

                    <span className="text-gray-700 font-medium">
                        Fast Shipping
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-pink-100 p-3 rounded-full">
                        <ShieldCheck className="text-pink-500 w-6 h-6" />
                    </div>

                    <span className="text-gray-700 font-medium">
                        Secure Payment
                    </span>
                </div>
            </div>
        </section>
    )
}

export default Features

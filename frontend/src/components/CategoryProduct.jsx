import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Categories = () => {

    const [categories, setCategories] = useState([])

    const navigate = useNavigate()

    const fetchCategories = async () => {

        try {

            const res = await axios.get(
                'http://localhost:8000/api/v1/product/categories'
            )

            if (res.data.success) {
                setCategories(res.data.categories)
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    return (
        <section className='py-20 bg-white'>

            <div className='max-w-7xl mx-auto px-6 lg:px-10'>

                {/* Heading */}
                <div className='text-center mb-14'>

                    <p className='text-pink-500 uppercase tracking-[5px] font-bold text-sm'>
                        Categories
                    </p>

                    <h2 className='text-4xl md:text-5xl font-black text-zinc-900 mt-4'>
                        Shop By Category
                    </h2>

                    <div className='w-28 h-1 bg-pink-500 mx-auto mt-5 rounded-full'></div>

                </div>

                {/* Categories Grid */}
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-7'>

                    {categories.map((item, index) => (

                        <div
                            key={index}
                            onClick={() =>
                                navigate(`/products?category=${item.category}`)
                            }
                            className='group cursor-pointer'
                        >

                            <div className='relative overflow-hidden rounded-[30px] bg-white shadow-md hover:shadow-2xl transition-all duration-500 border border-pink-100'>

                                {/* Image */}
                                <div className='overflow-hidden'>

                                    <img
                                        src={item.image}
                                        alt={item.category}
                                        className='w-full h-[220px] object-cover group-hover:scale-110 transition-all duration-700'
                                    />

                                </div>

                                {/* Overlay */}
                                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent'></div>

                                {/* Content */}
                                <div className='absolute bottom-0 left-0 w-full p-5'>

                                    <h3 className='text-white text-lg font-bold'>
                                        {item.category}
                                    </h3>

                                    <p className='text-pink-200 text-sm mt-1'>
                                        Starting From ₹{item.highestPrice}
                                    </p>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </section>
    )
}

export default Categories
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const BestSeller = () => {

    const [products, setProducts] = useState([])

    const navigate = useNavigate()

    const fetchProducts = async () => {

        try {

            const res = await axios.get(
                'http://localhost:8000/api/v1/product/best-seller'
            )

            if (res.data.success) {
                setProducts(res.data.products)
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    return (
        <section className='py-24 bg-white'>

            <div className='max-w-7xl mx-auto px-6 lg:px-10'>

                {/* Heading */}
                <div className='text-center mb-16'>

                    <p className='text-pink-500 uppercase tracking-[5px] font-semibold text-sm'>
                        Most Loved
                    </p>

                    <h2 className='text-4xl md:text-5xl font-black text-zinc-900 mt-3'>
                        Best Sellers
                    </h2>
                                        <div className='w-28 h-1 bg-pink-500 mx-auto mt-5 rounded-full'></div>


                </div>

                {/* Product Grid */}
                <div className='grid md:grid-cols-2 gap-10'>

                    {products.map((item) => (

                        <div
                            key={item._id}
                            className='group relative overflow-hidden rounded-[40px] bg-zinc-100'
                        >

                            {/* Image */}
                            <img
                                src={item.productImg}
                                alt={item.productName}
                                className='w-full h-[650px] object-cover group-hover:scale-105 transition-all duration-700'
                            />

                            {/* Overlay */}
                            <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent'></div>

                            {/* Content */}
                            <div className='absolute bottom-0 left-0 p-8 text-white w-full'>

                                <span className='bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm'>
                                    Best Seller
                                </span>

                                <h3 className='text-3xl font-black mt-5'>
                                    {item.productName}
                                </h3>

                                <div className='flex items-center gap-4 mt-4'>

                                    <span className='text-3xl font-bold'>
                                        ₹{item.productPrice}
                                    </span>

                                    <span className='line-through text-zinc-300'>
                                        ₹{item.oldPrice}
                                    </span>

                                </div>

                                <button
                                    onClick={() => navigate(`/product/${item._id}`)}
                                    className='mt-7 flex items-center gap-3 bg-white text-black px-7 py-4 rounded-full font-semibold hover:bg-pink-500 hover:text-white transition-all duration-300'
                                >
                                    Shop Now
                                    <ArrowRight size={18} />
                                </button>

                            </div>

                        </div>
                    ))}

                </div>

            </div>

        </section>
    )
}

export default BestSeller
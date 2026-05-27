import Breadcrums from '@/components/Breadcrumb'
import ProductDesc from '@/components/ProductDesc'
import ProductImg from '@/components/productImg'
import ProductCard from '@/components/productCard'
import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const SingleProduct = () => {
    const params = useParams()
    const productId = params.id

    const { products } = useSelector(store => store.product)
    const product = products.find((items) => items._id === productId)

    const relatedProducts = products.filter(
        (p) => p.category === product?.category && p._id !== productId
    ).slice(0, 5)

    return (
        <div className='pt-20 py-10 max-w-7xl mx-auto'>
            <Breadcrums product={product} />
            <div className="mt-1 grid grid-cols-2 items-start">
                <ProductImg images={product.productImg} />
                <ProductDesc product={product} />
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className='mt-16'>
                    <h2 className='text-2xl font-bold text-gray-800 mb-6'>
                        Related Products
                    </h2>

                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                        {relatedProducts.map((p) => (
                            <div key={p._id} className='scale-90 origin-top'>
                                <ProductCard product={p} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default SingleProduct

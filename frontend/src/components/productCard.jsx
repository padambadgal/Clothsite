import { ShoppingCart } from 'lucide-react';
import React from 'react'
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import axios from 'axios';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCart } from '@/redux/productSlice';

const ProductCard = ({ product, loading }) => {
    const { productImg, productPrice, productName } = product;
    const accessToken = localStorage.getItem("accessToken");
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const addToCart = async (productId) => {
        try {
            const res = await axios.post(
            'http://localhost:8000/api/v1/cart/add',
            {productId},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
            if (res.data.success) {
                toast.success('Product added to cart')
                dispatch(setCart(res.data.cart))
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='shadow-lg rounded-lg overflow-hidden h-max'>
            <div className="w-full h-full aspect-square overflow-hidden">
                {
                    loading ? <Skeleton className='w-full h-full rounded-lg' /> : <img 
                    onClick={()=>navigate(`/products/${product._id}`)}
                    src={productImg[0]?.url} alt={productName} 
                    className='w-full h-500h transition-transform duration-300 hover:scale-105 cursor-pointer' />
                }
            </div>
            {
                loading ? <div className="px-3 space-y-2 my-2">
                    <Skeleton className='w-[200px] h-4' />
                    <Skeleton className='w-[100px] h-4' />
                    <Skeleton className='w-[150px] h-8' />
                </div> : <div className='px-3 space-y-3'>
                    <h3 className='font-semibold h-15 line-clamp-2 text-sm'>{productName}</h3>
                    <p className='text-pink-600 font-bold'>₹{productPrice}</p>
                    <Button onClick={() => addToCart(product._id)} className='bg-pink-600 mb-3 w-full'><ShoppingCart />Add to Cart</Button>
                </div>
            }
        </div>
    )
}
export default ProductCard

import { Button } from '@/components/ui/button'
import axios from 'axios'
import { ArrowLeft } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
 

const MyOrder = () => {
    const navigate = useNavigate()
    const [userOrder, setUserOrder] = useState(null)
    const getUserOrders = async()=>{
        const accessToken = localStorage.getItem("accessToken")
        const res = await axios.get(`${import.meta.env.VITE_URL}//api/v1/orders/myorder`, {
            headers:{
                Authorization:`Bearer ${accessToken}`
            }
        })
        if(res.data.success){
            setUserOrder(res.data.orders)
        }
    }

    useEffect(()=>{
        getUserOrders()
    },{})

  return (
    <div className='pr-20 flex flec-col gap-3'>
        <div className="w-full p-6">
            <div className="flex items-center gap-4 mb-6">
                <Button onClick={()=>navigate(-1)}><ArrowLeft/></Button>
                <h1 className="text-2xl font-bold">Orders</h1>
            </div>
            {
                userOrder?.length === 0 ? (
                    <div className="text-gray-800 space-y-4 text-2xl">No Orders found for this user</div>
                ):(
                    <div className='space-y-6 w-full'>
                        {
                            userOrder?.map((order)=>{
                                <div key={order} className="shadow-lg rounded-2xl p-5 border border-gray-200">

                                    {/* order header */}
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className='text-lg font-semibold'>
                                            Order ID:{" "}
                                            <span className='text-gray-600'>{order._id}</span>
                                        </h2>
                                        <p className='text-sm text-gray-500'>Amount:{" "}
                                            <span className='font-bold'>
                                                {order.currency} {order.amount.toFixed(2)}
                                            </span>
                                        </p>
                                    </div>

                                    {/* user info */}
                                    <div className="flex justify-between items-center">
                                        <div className="mb-4">
                                            <p className='text-gray-700'>
                                                <span className='font-medium'>User:</span>{" "}
                                                {order.user?.firstName || 'Unknown'} {order.user?.lastName}
                                            </p>
                                            <p className='text-gray-500'>
                                                Email:{order.user?.email || "N/A"}
                                            </p>
                                        </div>
                                        <span className={`${order.status == "Paid" ? "bg-green-300": order.status === "Failed" ? 'bg-red-500' : "bg-orange-300"} text-white px-2 py-1 rounded-lg`}>{order.status}</span>
                                    </div>

                                    {/* products */}
                                    <div>
                                        <h2 className="font-medium mb-2">Products:</h2>
                                        <ul className='space-y-2'>
                                            {
                                                order.map((product, index)=>{
                                                    <li key={index} className='flex justify-between items-center bg-gray-50 p-3 rounded-lg'>
                                                        <img className='w-16 cursor-pointer' src={product.productid?.productImg?.[0].url} alt="" />
                                                        <span className='w-[300px] line-clamp-2 '>{product.productId?.productName}</span>
                                                        <span>{product?.productId?._id}</span>
                                                        <span className='fot-medium'>
                                                            ₹${product.productId?.productPrice} * [product.quantity]
                                                        </span>
                                                    </li>
                                                })
                                            }
                                        </ul>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                )
            }
        </div>
    </div>
  )
}

export default MyOrder
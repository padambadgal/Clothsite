import { CheckCircle, XCircle } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setCart } from '@/redux/productSlice'
import { toast } from 'sonner'

const OrderSuccess = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()
    const [status, setStatus] = useState('verifying') // verifying | success | failed

    const payment_id = searchParams.get('payment_id')
    const payment_request_id = searchParams.get('payment_request_id')
    const payment_status = searchParams.get('payment_status')

    useEffect(() => {
        const verifyPayment = async () => {
            if (!payment_id || !payment_request_id) {
                setStatus('failed')
                return
            }
            try {
                const accessToken = localStorage.getItem('accessToken')
                const { data } = await axios.post(
                    'http://localhost:8000/api/v1/orders/verify-payment',
                    { payment_id, payment_request_id, payment_status },
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                )
                if (data.success) {
                    setStatus('success')
                    dispatch(setCart({ items: [], totalPrice: 0 }))
                    toast.success('Payment Successful!')
                } else {
                    setStatus('failed')
                }
            } catch (error) {
                console.log(error)
                setStatus('failed')
            }
        }
        verifyPayment()
    }, [])

    if (status === 'verifying') {
        return (
            <div className='min-h-screen flex items-center justify-center bg-gray-50'>
                <p className='text-gray-600 text-lg animate-pulse'>Verifying your payment...</p>
            </div>
        )
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 p-6'>
            <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
                <div className="flex justify-center">
                    {status === 'success'
                        ? <CheckCircle className='h-20 w-20 text-green-500' />
                        : <XCircle className='h-20 w-20 text-red-500' />
                    }
                </div>
                <h1 className="text-2xl font-bold mt-4 text-gray-800">
                    {status === 'success' ? 'Payment Successful 🎉' : 'Payment Failed ❌'}
                </h1>
                <p className='text-gray-600 mt-2'>
                    {status === 'success'
                        ? 'Thank you for your purchase! Your order has been placed successfully.'
                        : 'Something went wrong with your payment. Please try again.'}
                </p>
                <div className="mt-6 flex flex-col gap-3">
                    <button onClick={() => navigate('/products')} className='w-full bg-pink-600 text-white py-3 rounded-xl hover:bg-pink-700 transition'>
                        Continue Shopping
                    </button>
                    {status === 'success' && (
                        <button onClick={() => navigate('/orders')} className='w-full border border-pink-600 text-pink-600 py-3 rounded-xl hover:bg-pink-50 transition'>
                            View My Orders
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default OrderSuccess

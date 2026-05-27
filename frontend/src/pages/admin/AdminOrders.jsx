import { setUser } from '@/redux/userSlice'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const AdminOrders = () => {
    const accessToken = localStorage.getItem("accessToken")
    const [orders, setOrder] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await axios.get("http://loacalhot:8000/api/v1/order/all", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                if (data.success) setOrder(data.orders);
            } catch (error) {
                console.error("Failed to fetch admin orders", error);
            } finally {
                setLoading(false)
            }
        }
        fetchOrders();
    }, [accessToken])

    if (loading) {
        return <div className='text-center py-20 text-gray-500'>Loading all Orders...</div>
    }
    return (
        <div className='pl-[350px] py-20 pr-20 mx-auto px-4'>
            <h1 className="text-xl font-bold mb-6">Admin - All Order</h1>

            {orders.length === 0 ? (
                <p className="text-gray-500"></p>
            ) : (
                <div className="overflow-x-auto">
                    <table className='w-full border border-gray-200 text-left text-sm'>
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 border">Order ID</th>
                                <th className="px-4 py-2 border">User</th>
                                <th className="px-4 py-2 border">Products</th>
                                <th className="px-4 py-2 border">Amount</th>
                                <th className="px-4 py-2 border">Status</th>
                                <th className="px-4 py-2 border">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 border">{order._id}</td>
                                        <td className="px-4 py-2 border">{order.user?.name}
                                            <br />
                                            <span className='text-xs text-gray-500'>{order.user?.email}</span>
                                        </td>

                                        <td className="px-4 py-2">
                                            {
                                                order.products.map((P, idx) => (
                                                    <div key={idx} className='text-sm'>
                                                        {p.productName} * {p.quantity}
                                                    </div>
                                                ))
                                            }
                                        </td>
                                        <td className="px-4 py-2 border font-semibld">
                                            ₹{order.amount.toLocaleDateString('en-IN')}
                                        </td>
                                        <td className='px-4 py-2 border'>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${order.status === 'Paid' ? "bg-green-100 text-green-700"
                                                : order.status === panding ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default AdminOrders

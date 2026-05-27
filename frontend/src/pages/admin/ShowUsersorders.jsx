import { useParams } from 'react-router-dom'
import OrderCard from '@/components/OrderCard'
import React, { useEffect, useState } from 'react'

const ShowUsersOrders = () => {
    const params = useParams()
    const [userOrder, setUserOrder] = useState(null)

    const getuserOrders = async () => {
        const accessToken = localStorage.getItem("accessToken")
        const res = await axios.get(`${import.meta.env.VITE.URL}/api/v1/order/user-order/${params.userId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        if(res.data.success){
            setUserOrder(res.data.orders)
        }
    }

    useEffect(()=>{
        getuserOrders()
    },[])
    return (
        <div className='pl-[350px] py-20 '>
            <OrderCard userOrder={userOrder} />
        </div>
    )
}

export default ShowUsersOrders

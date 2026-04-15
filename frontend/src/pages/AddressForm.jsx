import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { addAdress, deleteAddress, setAddresses, setCart, setSelectedAddress } from '@/redux/productSlice'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import axios from 'axios'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Separator } from '@/components/ui/separator'
import axios from 'axios'
import { Import } from 'lucide-react'
import { Toast } from 'radix-ui'
// import { current } from '@reduxjs/toolkit'
import { Navigate, useNavigate } from 'react-router-dom'

const AddressForm = () => {
    const emptyForm = { fullName: "", phone: "", email: "", address: "", city: "", state: "", zip: "", country: "" }
    const [formData, setFormData] = useState(emptyForm)
    const { cart, addresses = [], selectedAddress } = useSelector((store) => store.product)
    const [showForm, setShowForm] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate
    // const accessToken = localStorage.getItem('accessToken')


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSave = async (e) => {
        dispatch(addAdress(formData))
        setShowForm(false)
    }

    const SubTotal = cart.totalPrice
    const shipping = cart.SubTotal > 50 ? 0 : 10
    const tax = parseFloat((SubTotal * 0.5).toFixed(2))
    const total = SubTotal + shipping + tax

    const handlePayment = async (e) => {
        const accessToken = localStorage.getItem('accessToken')
        try {
            const { data } = await axios.post('http://localhost:8000/api/v1/orders/create-order',
                {
                    product: cart?.items?.map(item => ({
                        productId: item._id,
                        quantity: item.quantity,
                        price: item.price
                    })),
                    tax,
                    shipping,
                    amount: total,
                    Currency: "INR",
                }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            if (!data.success) return Toast.error("something went wrong")

            const optons = {
                key: Import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.order.amount,
                Currency: data.order.Currency,
                order_id: data.order.id,
                name: "Clothsite",
                description: "Order Payment",
                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post('http://localhost:8000/api/v1/orders/verify-payment',
                            response,
                            {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`
                                }
                            })
                        if (verifyRes.data.success) {
                            toast.success("✅ Payment Successfull")
                            dispatch(setCart({ items: [], totalPrice: 0 }))
                            navigate('/order-success')
                        }
                        else {
                            toast.error("❌ Payment verification failed")
                        }
                    } catch (error) {
                        toast.error("Error verifyimg payment")
                    }
                },
                modal: {
                    ondismiss: async function () {
                        //Handle user closing the popup
                        await axios.post('http://localhost:8000/api/v1/orders/verify-payment',
                            {
                                razorpay_order_iid: data.order.id
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`
                                }
                            });
                        toast.error("Payment cancelled or failed")
                    }
                },
                prefill: {
                    name: formData.fullName,
                    email: formData.email,
                    contact: formData.phone
                },
                theme: { color: "#f472B6" }
            };

            const rzp = new window.Razorpay(optons)

            // Listen for payment failed
            rzp.on("Payment Failed", async function (response) {
                await axios.post('http://localhost:8000/api/v1/orders/verify-payment', {
                    razorpay_order_id: data.order.id,
                    paymentFailed: true
                }, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                })
                toast.error("payment Failed. Please try again")
            })
            rzp.open()

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong while processing payment")
        }
    }
    return (
        <div className='max-w-7xl mx-auto grid place-items-center p-10'>
            <div className="grid grid-cols-2 items-start gap-20 mt-10 max-w-7xl mx-auto">
                <div className="space-y-4 p-6 bg-white">
                    {
                        showForm ? (
                            <>
                                <div>
                                    <Label htmlFor="fullname">Full Name</Label>
                                    <Input value={formData.fullName} name="fullName" onChange={handleChange} id="fullname" required placeholder="John Doe" />
                                </div>
                                <div>
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input value={formData.phone} name="phone" onChange={handleChange} id="phone" required placeholder="+91 9988554466" />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input value={formData.email} name="email" onChange={handleChange} id="email" required placeholder="rahul76@email.com" />
                                </div>
                                <div>
                                    <Label htmlFor="address">Address</Label>
                                    <Input value={formData.address} name="address" onChange={handleChange} id="address" required placeholder="123 street, Area" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="city">City</Label>
                                        <Input value={formData.city} name="city" onChange={handleChange} id="city" required placeholder="Amritsar" />
                                    </div>
                                    <div>
                                        <Label htmlFor="state">State</Label>
                                        <Input value={formData.state} name="state" onChange={handleChange} id="state" required placeholder="Punjab" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="zip">Zip Code</Label>
                                        <Input value={formData.zip} name="zip" onChange={handleChange} id="zip" required placeholder="155745" />
                                    </div>
                                    <div>
                                        <Label htmlFor="country">Country</Label>
                                        <Input value={formData.country} name="country" onChange={handleChange} id="country" required placeholder="India" />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={handleSave} className="w-full">Save & Continue</Button>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold">Saved Addresses</h2>
                                {
                                    addresses.map((addr, index) => {
                                        return <div key={index}
                                            onClick={() => dispatch(setSelectedAddress(index))}
                                            className={`border p-4 rounded-md cursor-pointer relative 
                                        ${selectedAddress === index ?
                                                    'border-pink-600 bg-pink-50' :
                                                    'border-gray-300'}`}>
                                            <p className='font-medium'>{addr.fullName}</p>
                                            <p> {addr.phone}</p>
                                            <p>{addr.email}</p>
                                            <p>{addr.address}, {addr.city}, {addr.state} - {addr.zip}, {addr.country}</p>
                                            <button onClick={(e) => dispatch(deleteAddress(index))} className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm">Delete</button>
                                        </div>
                                    })
                                }
                                <Button variant='outline' className=
                                    "w-full" onClick={() => setShowForm(true)}>+ Add New Address</Button>
                                <Button 
                                disabled={selectedAddress === null}
                                onClick={handlePayment} 
                                className='w-full bg-pink-600'>Procced to Checkout</Button>
                            </div>
                        )
                    }
                </div>

                {/* Right side order summary */}
                <div>
                    <Card className="w-[400px]">
                        <CardHeader>
                            <CardTitle>
                                Order Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span>SubTotal ({cart.items.length}) items</span>
                                    <span>₹{SubTotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>₹{shipping}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax</span>
                                    <span>₹{tax}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>₹{total}</span>
                                </div>
                                <div className="text-sm text-muted-foreground pt-4">
                                    <p>* Star free shipping on orders over 299 </p>
                                    <p>* 10-days return policy</p>
                                    <p>* Secure checkout with SSM encryption</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default AddressForm

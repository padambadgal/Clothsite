import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { deleteAddress, setAddresses, setCart, setSelectedAddress } from '@/redux/productSlice'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const emptyForm = { fullName: "", phone: "", email: "", address: "", city: "", state: "", zip: "", country: "" }

const AddressForm = () => {
    const [formData, setFormData] = useState(emptyForm)
    const { cart, addresses = [], selectedAddress } = useSelector((store) => store.product)
    const [showForm, setShowForm] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const accessToken = localStorage.getItem('accessToken')

    const SubTotal = cart?.totalPrice || 0
    const shipping = SubTotal > 299 ? 0 : 10
    const tax = parseFloat((SubTotal * 0.05).toFixed(2))
    const total = SubTotal + shipping + tax

    const fetchAddresses = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/v1/user/get-addresses', {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            if (res.data.success) {
                dispatch(setAddresses(res.data.addresses))
                if (res.data.addresses.length === 0) setShowForm(true)
            }
        } catch (error) {
            console.log(error)
            setShowForm(true)
        }
    }

    useEffect(() => {
        fetchAddresses()
    }, [])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSave = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post('http://localhost:8000/api/v1/user/add-address', formData, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            if (res.data.success) {
                dispatch(setAddresses(res.data.addresses))
                toast.success('Address saved')
                setFormData(emptyForm)
                setShowForm(false)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save address')
        }
    }

    const handlePayment = async () => {
        if (selectedAddress === null) {
            toast.error('Please select an address')
            return
        }
        try {
            const { data } = await axios.post(
                'http://localhost:8000/api/v1/orders/create-order',
                {
                    products: cart?.items?.map((item) => ({
                        productId: item.productId._id,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                    tax,
                    shipping,
                    amount: total,
                },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            )
            if (!data.success) return toast.error('Something went wrong')
            window.location.href = data.paymentUrl
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'Payment Failed')
        }
    }

    return (
        <div className='pt-20 max-w-7xl mx-auto grid place-items-center p-10'>
            <div className="grid grid-cols-2 items-start gap-20 mt-10 max-w-7xl mx-auto">
                <div className="space-y-4 p-6 bg-white">
                    {showForm ? (
                        <>
                            <div>
                                <Label htmlFor="fullname">Full Name</Label>
                                <Input value={formData.fullName || ''} name="fullName" onChange={handleChange} id="fullname" required placeholder="John Doe" />
                            </div>
                            <div>
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input value={formData.phone || ''} name="phone" onChange={handleChange} id="phone" required placeholder="+91 9988554466" />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input value={formData.email || ''} name="email" onChange={handleChange} id="email" required placeholder="rahul76@email.com" />
                            </div>
                            <div>
                                <Label htmlFor="address">Address</Label>
                                <Input value={formData.address || ''} name="address" onChange={handleChange} id="address" required placeholder="123 street, Area" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="city">City</Label>
                                    <Input value={formData.city || ''} name="city" onChange={handleChange} id="city" required placeholder="Amritsar" />
                                </div>
                                <div>
                                    <Label htmlFor="state">State</Label>
                                    <Input value={formData.state || ''} name="state" onChange={handleChange} id="state" required placeholder="Punjab" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="zip">Zip Code</Label>
                                    <Input value={formData.zip || ''} name="zip" onChange={handleChange} id="zip" required placeholder="155745" />
                                </div>
                                <div>
                                    <Label htmlFor="country">Country</Label>
                                    <Input value={formData.country || ''} name="country" onChange={handleChange} id="country" required placeholder="India" />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={handleSave} className="w-full">Save & Continue</Button>
                                {addresses.length > 0 && (
                                    <Button variant="outline" onClick={() => { setShowForm(false); setFormData(emptyForm) }}>Cancel</Button>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">Saved Addresses</h2>
                            {addresses.map((addr, index) => (
                                <div key={index} onClick={() => dispatch(setSelectedAddress(index))}
                                    className={`border p-4 rounded-md cursor-pointer relative ${selectedAddress === index ? 'border-pink-600 bg-pink-50' : 'border-gray-300'}`}>
                                    <p className='font-medium'>{addr.fullName}</p>
                                    <p>{addr.phone}</p>
                                    <p>{addr.email}</p>
                                    <p>{addr.address}, {addr.city}, {addr.state} - {addr.zip}, {addr.country}</p>
                                    <button onClick={(e) => { e.stopPropagation(); dispatch(deleteAddress(index)) }}
                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm">Delete</button>
                                </div>
                            ))}
                            <Button variant='outline' className="w-full" onClick={() => setShowForm(true)}>+ Add New Address</Button>
                            <Button disabled={selectedAddress === null} onClick={handlePayment} className='w-full bg-pink-600'>
                                Proceed to Checkout
                            </Button>
                        </div>
                    )}
                </div>

                <div>
                    <Card className="w-[400px]">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span>SubTotal ({cart?.items?.length || 0} items)</span>
                                    <span>₹{SubTotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax (5%)</span>
                                    <span>₹{tax}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>₹{total.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="text-sm text-muted-foreground pt-4">
                                    <p>* Free shipping on orders over ₹299</p>
                                    <p>* 10-days return policy</p>
                                    <p>* Secure checkout</p>
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

import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { Label } from '@/components/ui/label';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


const UserInfo = () => {
    const [updateUser, setUpdateUser] = useState(null)
    const [file, setFile] = useState()
    const navigate = useNavigate()
    const params = useParams()
    const userId = params.id   // ✅ correct.id
    const [loading, setLoading] = useState(false);
    const address = useSelector((store)=>store.address)


    const handleChange = (e) => {
        setUpdateUser({
            ...updateUser, [e.target.name]: e.target.value
        })
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile)
        setUpdateUser({ ...updateUser, profilePic: URL.createObjectURL(selectedFile) })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true)

        try {
            const accessToken = localStorage.getItem('accessToken')
            const formData = new FormData()
            formData.append('firstName', updateUser.firstName)
            formData.append('lastName', updateUser.lastName)
            formData.append('email', updateUser.email)
            formData.append('phoneNo', updateUser.phoneNo)
            formData.append('address', updateUser.address)
            formData.append('city', updateUser.city)
            formData.append('zipCode', updateUser.zipCode)
            formData.append('role', updateUser.role)

            if (file) {
                formData.append('file', file)
            }
            const res = await axios.put(`http://localhost:8000/api/v1/user/update/${userId}`, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            })
            if (res.data.success) {
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Failed to update profile")
        } finally {
            setLoading(false)
        }
    }

    const getUserDetails = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/v1/user/get-user/${userId}`)
            if (res.data.success) {
                setUpdateUser(res.data.user)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getUserDetails()
    }, [])
    return (
        <div className='pt-5 h-screen bg-gray-100'>
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
                    <div className="flex justify-between gap-10">
                        <Button onClick={() => navigate(-1)}><ArrowLeft /></Button>
                        <h1 className='mb-7 font-bold text-2xl text-gray-800'>Update Profile</h1>
                    </div>
                    <div className="w-full flex gap-10 justify-between items-start px-7 max-w-2xl">
                        {/* profile picture */}
                        <div className='flex flex-col items-center'>
                            <img src={updateUser?.profilePic} alt="profile" className='w-34 h-34 rounded-full object-cover border-4 border-pink-800' />
                            <Label className='mt-4 cursor-pointer bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700'>Change Picture
                                <input type="file" accept='image/*' className='hidden' onChange={handleFileChange} />
                            </Label>
                        </div>
                        {/* profile form */}
                        <form onSubmit={handleSubmit} className='space-y-4 shadow-lg p-5 rounded-lg bg-white'>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className='block text-sm font-medium'>First Name
                                    </Label>
                                    <Input type='text' name='firstName' value={updateUser?.firstName} onChange={handleChange} placeholder='John' className='w-full border rounded-lg px-3 py-2 mt-1' />
                                </div>
                                <div>
                                    <Label className='block text-sm font-medium'>Last Name</Label>
                                    <Input type='text' name='lastName' value={updateUser?.lastName} onChange={handleChange} placeholder='Doe' className='w-full border rounded-lg px-3 py-2 mt-1' />
                                </div>
                            </div>
                            <div>
                                <Label className='block text-sm font-medium'>Email</Label>
                                <Input type='email' name='email' value={updateUser?.email} onChange={handleChange} disabled className='w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed' />
                            </div>
                            <div>
                                <Label className='block text-sm font-medium'>phone Number</Label>
                                <Input type='text' name='phoneNo' value={updateUser?.phoneNo} onChange={handleChange} placeholder='Enter your Contact number' className='w-full border rounded-lg px-3 py-2 mt-1' />
                            </div>
                            <div>
                                <Label className='block text-sm font-medium'>Address</Label>
                                <Input type='text' name='address' value={updateUser?.address} onChange={handleChange} placeholder='Enter your Address' className='w-full border rounded-lg px-3 py-2 mt-1' />
                            </div>
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <Label className='block text-sm font-medium'>City</Label>
                                    <Input type='text' name='city' value={updateUser?.city} onChange={handleChange} placeholder='Enter your City' className='w-full border rounded-lg px-3 py-2 mt-1' />
                                </div>
                                <div>
                                    <Label className='block text-sm font-medium'>Zip Code</Label>
                                    <Input type='text' name='zipCode' value={updateUser?.zipCode || ''} onChange={handleChange} placeholder='Enter your ZipCode' className='w-full border rounded-lg px-3 py-2 mt-1' />
                                </div>

                            </div>
                            <div className="flex gap-3 items-center">
                                <Label>Role:</Label>
                                <RadioGroup onValueChange={(value) => setUpdateUser({ ...updateUser, role: value })} value={updateUser?.role} className="flex items-center ">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="user" id="user" />
                                        <Label htmlFor="user">User</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="admin" id="admin" />
                                        <Label htmlFor="admin">Admin</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            <Button type='submit' className='w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-lg'>
                                {loading ? <><Loader2 className='h-4 w-4 animate-spin mr-2' />Please wait</> :
                                    "Update Profile"}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserInfo

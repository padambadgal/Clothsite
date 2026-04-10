import { useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import axios from 'axios'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Eye, EyeOff, Loader2 } from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setUser } from '@/redux/userSlice'


const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const [formData, setformData] = useState({
        email: "",
        password: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setformData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const submitHandle = async (e) => {
        e.preventDefault()
        console.log(formData)
        try {
            setLoading(true)
            const res = await axios.post("http://localhost:8000/api/v1/user/login", formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (res.data.success) {
                navigate('/')
                dispatch(setUser(res.data.user))
                localStorage.setItem("accessToken", res.data.token)
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-00'>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Create your account</CardTitle>
                    <CardDescription>
                        Enter given details below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-3">
                        {/* <div className="grid grid-cols-2 gap-2">
                            <div className='grid gap-2'>
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    placeholder="John"
                                    required
                                    onChange={handleChange}
                                    value={formData.firstName}
                                />                                </div>
                            <div className='grid gap-2'>
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    placeholder="Doe"
                                    required
                                    onChange={handleChange}
                                    value={formData.lastName}
                                />                                </div>
                        </div> */}
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                onChange={handleChange}
                                value={formData.email}
                            />
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password" onChange={handleChange} value={handleChange.password} >Password</Label>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"   // ✅ FIXED
                                    placeholder="Enter a password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    onChange={handleChange}
                                    value={formData.password}
                                />                                    {
                                    showPassword ? <EyeOff onClick={() => setShowPassword(false)} className='w-5 h-5  text-gray-700 absolute right-5 bottom-2' /> :
                                        <Eye onClick={() => setShowPassword(true)} className='w-5 h-5  text-grey-700 absolute right-5 bottom-2' />
                                }
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button onClick={submitHandle} type="submit" className="w-full cursor-pointer bg-pink-600 hover:bg-pink-500">
                        {loading ? <><Loader2 className='h-4 w-4 animate-spin mr-2' />Please wait</> : "Login"}
                    </Button>
                    <p className='text-gray-700 text-sm'>Don't have an account? <Link to={'/signup'} className='hover:underline cursor-pointer text-pink-800'>Signup</Link></p>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Login


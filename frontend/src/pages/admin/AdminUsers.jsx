import { Input } from '@/components/ui/input'
import axios from 'axios'
import { Edit, Eye, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import UserLogo from '../../assets/images.png'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom';

const AdminUsers = () => {
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [searchTerm, setsearchTerm] = useState("")

    const getAllUsers = async () => {
        const accessToken = localStorage.getItem("accessToken")
        try {
            const res = await axios.get('http://localhost:8000/api/v1/user/all-user',{
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }                
            })
            if (res.data.users) {
                setUsers(res.data.users)
            }
        } catch (error) {
            console.log(error);

        }
    }

    const filteredUser = users.filter(user=>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    useEffect(() => {
        getAllUsers()
    }, [])

    

    return (
        <div className='pl-[350px] py-20 pr-20 mx-auto px-4'>
            <h1 className='font-bold text-2xl'>User Management</h1>
            <p className=''>View and manage register users</p>
            <div className="flex relative w-[300px] mt-6">
                <Search className='absolute left-2 top-1 text-gray-600 w-5' />
                <Input value={searchTerm} onChange={(e)=> setsearchTerm(e.target.value)} placeholder="Search Users..." className="pl-10" />
            </div>
            <div className="grid grid-cols-3 gap-7 mt-7">
                {
                    filteredUser.map((user, index) => {
                        return <div key={index} className="bg-pink-100 rounded-lg p-4">
                            <div className="flex items-center gap-2">
                            <img src={user?.profilePic || UserLogo} alt="" className="rounded-full w-16 aspect-square object-cover border-pink-600" />
                            <div className='min-w-0'>
                                <h1 className='font-semibold truncate'>{user?.firstName} {user?.lastName}</h1>
                                <h3 className='text-sm text-gray-600 truncate'>{user?.email}</h3>
                            </div>
                            </div>
                            <div className="flex gap-3 mt-3">
                                <Button onClick={()=>navigate(`/dashboard/users/${user._id}`)} variant="outline" ><Edit/>Edit</Button>
                                <Button><Eye />Show Order</Button>
                            </div>
                        </div>
                    })
                }
            </div>
        </div>
    )
}

export default AdminUsers

import { Input } from '@/components/ui/input'
import { Edit, Search, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card } from '@/components/ui/card'
import { useDispatch, useSelector } from 'react-redux'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import ImageUpload from '@/components/ImageUpload'
import { Textarea } from '@/components/ui/textarea'
import { setProducts } from '@/redux/productSlice'
import axios from 'axios'
import { toast } from 'sonner'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

const AdminProduct = () => {
    const accessToken = localStorage.getItem('accessToken')
    const { products } = useSelector(store => store.product)
    const dispatch = useDispatch()
    const [editProduct, setEditProduct] = useState(null)
    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [sortOrders, setSortOrders] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target
        setEditProduct(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSave = async (e) => {
        e.preventDefault()
        const formData = new FormData()

        formData.append('productName', editProduct.productName)
        formData.append('productPrice', editProduct.productPrice)
        formData.append('productDesc', editProduct.productDesc)
        formData.append('brand', editProduct.brand)
        formData.append('category', editProduct.category)

        // Add existing images public_ids
        const existingImages = editProduct.productImg
            .filter((img) => !(img instanceof File) && img.public_id)
            .map((img) => img.public_id)

        formData.append('existingImages', JSON.stringify(existingImages))

        // Add new files
        editProduct.productImg
            .filter((img) => img instanceof File)
            .forEach((file) => {
                formData.append('files', file)
            })

        try {
            const res = await axios.put(`http://localhost:8000/api/v1/product/update/${editProduct._id}`, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            if (res.data.success) {
                toast.success('Product Updated Successfully')
                const updatedProducts = products.map((p) =>
                    p._id === editProduct._id ? res.data.product : p
                )
                dispatch(setProducts(updatedProducts))
            }

            setOpen(false)
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'Something went wrong')
        }
    }

    const deleteProducthandle = async (productId) => {
        try {
            const remainingProducts = products.filter((product) => product._id !== productId)
            const res = await axios.delete(`http://localhost:8000/api/v1/product/delete/${productId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            if (res.data.success) {
                toast.success(res.data.message)
                dispatch(setProducts(products.filter((p) => p._id !== productId)))
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'Something went wrong')
        }
    }

    let filterProducts = (products || []).filter((product) =>
        product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (sortOrders === "lowToHigh") {
        filterProducts = [...filterProducts].sort((a, b) => a.productPrice - b.productPrice)
    }
    if (sortOrders === "highToLow") {
        filterProducts = [...filterProducts].sort((a, b) => b.productPrice - a.productPrice)
    }

    return (
        <div className='pl-[350px] py-20 pr-20 flex flex-col gap-3 bg-gray-100'>
            <div className="flex justify-between gap-4">
                <div className="relative bg-white rounded-lg">
                    <Input onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} type='text' placeholder='Search Products...' className='items-center w-[400px]' />
                    <Search className='absolute top-1.5 text-gray-500 right-3' />
                </div>
                <Select onValueChange={(value)=> setSortOrders(value)}>
                    <SelectTrigger className="w-[200px] bg-white">
                        <SelectValue placeholder="Sort by Price" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
                            <SelectItem value="highToLow">Price: High to Low</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            {
                filterProducts.map((product, index) => {
                    return <Card key={product._id || index} className='px-4 py-3'>
                        <div className="flex items-center justify-between">
                            <div className="flex gap-2 items-center">
                                <img src={product.productImg?.[0]?.url} alt={product.productName} className='w-24 h-24 object-cover rounded-md' />
                                <h1 className='font-bold w-[150px] truncate text-gray-700'>{product.productName}</h1>
                            </div>
                            <h1 className='font-semibold text-gray-800'>₹{product.productPrice}</h1>
                            <div className="flex gap-3">
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                        <Edit onClick={() => { setOpen(true); setEditProduct(product) }} className='text-green-500 cursor-pointer' />
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[625px] max-h-[600px] overflow-y-scroll">
                                        <DialogHeader>
                                            <DialogTitle>Edit Product</DialogTitle>
                                            <DialogDescription>
                                                Make changes to your product here. Click save when you&apos;re done.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="flex flex-col gap-2">
                                            <div className="grid gap-2">
                                                <Label>Product Name</Label>
                                                <Input type='text' name='productName' value={editProduct?.productName} onChange={handleChange} placeholder='Product Name' required />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Price</Label>
                                                <Input type='number' name='productPrice' value={editProduct?.productPrice} onChange={handleChange} required />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label>Brand</Label>
                                                    <Input type='text' name='brand' value={editProduct?.brand} onChange={handleChange} placeholder='Ex-apple' required />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label>Category</Label>
                                                    <Input type='text' name='category' value={editProduct?.category} onChange={handleChange} placeholder='Ex-mobile' required />
                                                </div>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Description</Label>
                                                <Textarea name='productDesc' value={editProduct?.productDesc} onChange={handleChange} placeholder='Enter brief description of product' />
                                            </div>
                                            <ImageUpload productData={editProduct} setProductData={setEditProduct} />
                                        </div>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button variant="outline">Cancel</Button>
                                            </DialogClose>
                                            <Button onClick={handleSave} type="submit">Save changes</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Trash2 className='text-red-500 cursor-pointer' />
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete your account
                                                from our servers.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => deleteProducthandle(product._id)}>Continue</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    </Card>
                })
            }
        </div>
    )
}

export default AdminProduct
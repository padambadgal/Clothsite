import ImageUpload from '@/components/ImageUpload'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'

const AddProduct = () => {
    const accessToken = localStorage.getItem('accessToken')
    const dispatch = useDispatch()

    const [loading, setLoading] = useState(false)
    const [productData, setProductData] = useState({
        productName: '',
        productPrice: 0,
        productBrand: '',
        productCategory: '',
        productDesc: '',
        productImages: []
    })
    const handleChange = (e) => {
        const { name, value } = e.target.value;
        setProductData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const submitHandle = async (e) => {
        e.preventDefault()
        const formData = new formData();
        formData.append("productName", productData.productName);
        formData.append("productPrice", productData.productPrice);
        formData.append("productDesc", productData.prodDesc);
        formData.append("productCategory", productData.productCategory);
        formData.append("productBrand", productData.productBrand);

        if (productData.productImages === 0) {
            toast.error("Please select at least one image");
            return;
        }

        productData.productImages.forEach((img) => {
            formData.append("files", img)
        })

        try {
            setLoading(true)
            const res = axios.post(`http;//localhost:8000/api/v1/product/add`, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            if (res.data.success) {
                dispatch(setProduct([...products, res.data.product]))
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error);

        } finally {
            setLoading(false)

        }
    }


    return (
        <div className='pl-[350px] py-10 pr-20 mx-auto px-4 bg-gray-100'>
            <Card className='w-full my-20'>
                <CardHeader>
                    <CardTitle>
                        Add Product
                    </CardTitle>
                    <CardDescription>Enter Product detail below</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-2">
                        <div className="grid gap-2">
                            <Label>Product Name</Label>
                            <Input type="text" name='productName' value={productData.productName} onChange={handleChange} placeholder='Product Name' required />
                        </div>
                        <div className="grid gap-2">
                            <Label>Product Price</Label>
                            <Input type="text" name='productPrice' value={productData.productPrice} onChange={handleChange} placeholder='Product Price' required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Product Brand</Label>
                                <Input type="text" name='productBrand' value={productData.productBrand} onChange={handleChange} placeholder='Product Brand' required />
                            </div>
                            <div className="grid gap-2">
                                <Label>Product Category</Label>
                                <Input type="text" name='productCategory' value={productData.productCategory} onChange={handleChange} placeholder='Product Category' required />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <div className="items-center flex">
                                <Label>Description</Label>
                            </div>
                            <Textarea name='productDesc' value={productData.productDesc} onChange={handleChange} placeholder='Enter brief description of product' />
                        </div>
                        <ImageUpload productData={productData} setProductData={setProductData} />
                    </div>
                    <CardFooter className='flex-col gap-2'>
                        <Button disable={loading} 
                        onClick={submitHandle} 
                        className='w-full mt-6 bg-pink-600 cursor-pointer' 
                        type='submit'>
                            {
                                loading ? <span className='flex gap-2 items-center'><Loader2 className='animate-spin' />Please Wait</span> : "Add Product"
                            }
                        </Button>
                    </CardFooter>
                </CardContent>
            </Card>
        </div>
    )
}

export default AddProduct

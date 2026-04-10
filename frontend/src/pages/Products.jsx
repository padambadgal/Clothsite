import React, { useEffect, useState } from 'react'
import FilterSidebar from '@/components/FilterSidebar'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import ProductCard from '@/components/productCard'
import axios from 'axios'
import { toast } from 'sonner'
import { setProducts } from '@/redux/productSlice'
import { useSelector , useDispatch} from 'react-redux'
// import store from '@/redux/store'

const Products = () => {
    const {products} = useSelector(store => store.product)
    const [allProducts, setAllProducts] = useState([]);
    const [search, setSearch] = useState('')
    const [brand, setBrand] = useState('All')
    const [category, setCategory] = useState('All')
    const [priceRange, setPriceRange] = useState([0, 999999])
    const [loading, setLoading] = useState(false);
    const [sortOrder, setSortOrder] = useState('')
    const dispatch = useDispatch()
    
    const getAllProduct = async () => {
        try {
            setLoading(true)
            const res = await axios.get('http://localhost:8000/api/v1/product/getallproducts');
            if (res.data.success) {
                setAllProducts(res.data.products)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (allProducts.length === 0) return;

        let filtered = [...allProducts]
        if (search.trim() !== "") {
            filtered = filtered.filter(p => p.productName?.toLowerCase().includes(search.toLowerCase()))
        }

        if (category !== 'All') {
            filtered = filtered.filter(p => p.category === category)
        }

        if (brand !== 'All') {
            filtered = filtered.filter(p => p.brand === brand)
        }

        filtered = filtered.filter(p => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1])

        if (sortOrder === 'lowtohigh') {
            filtered.sort((a, b) => a.productPrice - b.productPrice)
        } else if (sortOrder === 'hightolow') {
            filtered.sort((a, b) => b.productPrice - a.productPrice)
        }

        dispatch(setProducts(filtered))
    },[search,category, brand, sortOrder, priceRange, allProducts, dispatch])

    useEffect(() => {
        getAllProduct()
    }, [])

    return (
        <div className='pt-20 pb-10'>
            <div className="max-w-7xl mx-auto flex gap-7">
                {/* sidebar */}
                <FilterSidebar
                    allProducts={allProducts}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    category={category}
                    setCategory={setCategory}
                    brand={brand}
                    setBrand={setBrand}
                    search={search}
                    setSearch={setSearch}
                />
                {/* Main Product Section */}
                <div className="flex flex-col flex-1">
                    <div className="flex justify-end mb-4">
                        <Select onValueChange={(value) => setSortOrder(value)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Sort by Price" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="lowtohigh">Price : Low to High</SelectItem>
                                    <SelectItem value="hightolow">Price : High to Low</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-7">
                        {
                            (products || []).map((product) => (
                                <ProductCard key={product._id} product={product} loading={loading} />
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Products

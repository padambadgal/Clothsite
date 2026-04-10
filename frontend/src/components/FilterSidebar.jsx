import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'

const FilterSidebar = ({ allProducts, priceRange, setPriceRange, search, setSearch, setBrand, brand, category, setCategory }) => {

    const Categories = allProducts.map(p => p.category)
    const UniqueCategories = ['All', ...new Set(Categories)]

    const Brand = allProducts.map(p => p.brand)
    const UniqueBrand = ['All', ...new Set(Brand)]
    console.log(UniqueBrand)

    const handleCategoryClick = (val) => {
        setCategory(val)
    }

    const handleBrandChange = (e) => {
        setBrand(e.target.value)
    }

    const handleMinChange = (e) => {
        const value = Number(e.target.value)
        if (value <= priceRange[1]) setPriceRange([value, priceRange[1]])
    }

    const handleMaxChange = (e) => {
        const value = Number(e.target.value)
        if (value >= priceRange[0]) setPriceRange([priceRange[0], value])
    }

    const resetFilter = () => {
        setSearch("");
        setCategory("All");
        setBrand("All");
        setPriceRange([0, 999999])
    }
    return (
        <div className='bg-gray-100 mt-10 p-4 rounded-md h-max hidden md:block w-70'>
            {/* Search */}
            <Input type='text' value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search...' className='bg-white p-2 rounded-md border-gray-400 border-2 w-full' />

            {/* category */}
            <h1 className='mt-5 font-semibold text-xl'>Category</h1>
            <div className="flex flex-col gap-2 mt-3">
                {
                    UniqueCategories.map((cat, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <input type="checkbox" checked={category === cat} onChange={() => handleCategoryClick(cat)} id={cat} className='mr-2' />
                            <label htmlFor={cat}>{cat}</label>
                        </div>
                    ))
                }
            </div>

            {/* brand */}
            <h1 className='mt-5 font-semibold text-xl'>Brand</h1>
            <select name="" id="" className='bg-white w-full p-2 border-gray-300 border-2 rounded-md' value={brand} onChange={handleBrandChange}>
                {
                    UniqueBrand.map((brand, index) => (
                        <option key={index} value={brand}>{brand.toUpperCase()}</option>
                    ))
                }
            </select>

            {/* Price Range*/}
            <h1 className="mt-5 font-semibold text-xl mb-3 ">Price Range</h1>
            <div className="flex flex-col gap-2">
                <label>
                    Price Range : ₹{priceRange[0]} - ₹{priceRange[1]}
                </label>
                <div className="flex gap-2 items-center">
                    <input type="number" min='0' max='5000' value={priceRange[0]} onChange={handleMinChange} className='w-20 p-1 border border-gray-300 rounded' />
                    <span>-</span>
                    <input type="number" min='0' max='999999' value={priceRange[1]} onChange={handleMaxChange} className='w-25 p-1 border border-gray-300 rounded' />
                </div>
                <input type="range" min='0' max='5000' step='100' className='w-full' value={priceRange[0]} onChange={handleMinChange} />
                <input type="range" min='0' max='999999' step='100' className='w-full' value={priceRange[1]} onChange={handleMaxChange} />
            </div>

            {/* reset button */}
            <Button onClick={resetFilter} className='mt-5 bg-pink-600 text-white px-4 py-2 cursor-pointer w-full'>Reset Filters</Button>
        </div>
    )
}
export default FilterSidebar

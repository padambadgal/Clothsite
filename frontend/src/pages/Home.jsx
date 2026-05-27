import BestSeller from '@/components/BestSeller'
import Categories from '@/components/CategoryProduct'
import Features from '@/components/Features'
import Hero from '@/components/Hero'
import React from 'react'

const Home = () => {
  return (
    <div>
        <Hero/>
        <Categories/>
        <BestSeller/>
        <Features/>
    </div>
  )
}

export default Home

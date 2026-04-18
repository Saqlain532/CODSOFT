import React from 'react'
import Navbar from '../components/Navbar';
import Categories from '../components/Categories';
import Mainbanner from '../components/Mainbanner';
import FeaturedProducts from '../components/FeaturedProducts';
import Footer from '../components/Footer';


const HomePage = () => {
  return (
    <div className='bg-mbg min-h-screen w-full '>
      <Navbar />
      <Mainbanner />
      <Categories />
      <FeaturedProducts />
      <Footer />
    </div>
  )
}

export default HomePage

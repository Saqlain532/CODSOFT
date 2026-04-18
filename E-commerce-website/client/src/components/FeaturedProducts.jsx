import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { categoryProductMap } from '../assets/productsData';

const FeaturedProducts = () => {
    // Get a selection of random products across categories
    const featuredList = useMemo(() => {
        const allProducts = Object.values(categoryProductMap).flat();
        // Shuffle and take 8 products
        return [...allProducts]
            .sort(() => 0.5 - Math.random())
            .slice(0, 8);
    }, []);

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 w-full mx-auto">
            <div className="flex flex-col md:flex-row items-end justify-between mb-10 gap-4">
                <div className="border-l-4 border-indigo-600 pl-4">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight uppercase">
                        Featured <span className="text-indigo-400">Products</span>
                    </h2>
                    <p className="text-gray-400 mt-2 text-lg">Handpicked selections just for you based on current trends.</p>
                </div>
                <Link 
                    to="/products" 
                    className="group flex items-center gap-2 text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
                >
                    Explore Full Catalog
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {featuredList.map(product => (
                    <div key={product.id} className="flex">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
            
            <div className="mt-16 bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl p-8 md:p-12 border border-gray-700 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                    <h3 className="text-2xl font-bold text-white mb-2">Can't find what you're looking for?</h3>
                    <p className="text-gray-400">Check out our full range of products across all 10 premium categories.</p>
                </div>
                <Link 
                    to="/products" 
                    className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full transition-all shadow-lg shadow-indigo-600/20 whitespace-nowrap"
                >
                    Browse All Products
                </Link>
            </div>
        </section>
    );
};

export default FeaturedProducts;
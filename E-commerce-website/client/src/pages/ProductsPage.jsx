import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { categoryProductMap } from '../assets/productsData';
import { categoriesData } from '../assets/categoryData';

const ProductsPage = () => {
    const { categoryId } = useParams();

    // Find category info
    const category = categoriesData.find(c => c.id === parseInt(categoryId));

    // Directly pull the hardcoded product array specific to this category
    const filteredProducts = categoryProductMap[parseInt(categoryId)] || [];

    // Scroll to top on load since we changed page
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!category) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center">
                    <h2 className="text-3xl font-bold text-gray-900">Category Not Found</h2>
                    <Link to="/" className="mt-4 text-indigo-600 hover:underline">Return to Home</Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-mbg min-h-screen flex flex-col w-full">
            <Navbar />

            {/* Category Header Banner */}
            <div className="bg-gray-900 py-16 px-4 sm:px-6 lg:px-8 mt-6 border-b border-gray-500">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
                    <div className="w-full md:w-1/3">
                        <img src={category.image} alt={category.name} className="h-48 w-full object-cover rounded-2xl shadow-xl opacity-90" />
                    </div>
                    <div className="w-full md:w-2/3">
                        <Link to="/" className="text-indigo-400 hover:text-indigo-300 text-sm mb-4 inline-flex items-center gap-1 font-semibold transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Categories
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">{category.name} Collections</h1>
                        <p className="text-gray-400 text-lg max-w-2xl">{category.description}</p>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="flex-grow">
                <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">

                    <div className="flex justify-between items-center mb-8">
                        <p className="text-gray-600 font-semibold text-sm">Showing {filteredProducts.length} premium results</p>
                        <div className="flex gap-2">
                            <select className="bg-white border-gray-300 text-gray-700 sm:text-sm rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2 pl-3 pr-10">
                                <option>Sort by: Featured</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                                <option>Customer Rating</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 ">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg">No products found for this category yet.</p>
                        </div>
                    )}

                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ProductsPage;

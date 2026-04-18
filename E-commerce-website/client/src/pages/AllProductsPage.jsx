import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { categoryProductMap } from '../assets/productsData';
import { categoriesData } from '../assets/categoryData';

const AllProductsPage = () => {
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-mbg min-h-screen flex flex-col font-sans">
            <Navbar />

            {/* Header */}
            <div className="bg-gray-900 py-12 px-4 border-b border-gray-700">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Our Full Collection</h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Browse through our entire catalog organized by categories to find exactly what you're looking for.
                    </p>
                </div>
            </div>

            {/* Category Wise Products */}
            <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-20">
                {categoriesData.map(category => {
                    const products = categoryProductMap[category.id] || [];
                    if (products.length === 0) return null;

                    return (
                        <section key={category.id} className="scroll-mt-24">
                            <div className="flex items-center justify-between mb-8 border-l-4 border-indigo-600 pl-4">
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight">
                                        {category.name}
                                    </h2>
                                    <p className="text-gray-400 text-sm mt-1">{category.description}</p>
                                </div>
                                <Link 
                                    to={`/category/${category.id}`} 
                                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors text-sm"
                                >
                                    View All {category.name}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {products.slice(0, 4).map(product => (
                                    <div key={product.id} className="flex">
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                            
                            {products.length > 4 && (
                                <div className="mt-6 text-center">
                                     <Link 
                                        to={`/category/${category.id}`} 
                                        className="inline-block px-6 py-2 border border-gray-700 text-gray-400 hover:text-white hover:border-indigo-600 rounded-full transition-all text-sm font-medium"
                                    >
                                        + {products.length - 4} more in {category.name}
                                    </Link>
                                </div>
                            )}
                        </section>
                    );
                })}
            </div>

            <Footer />
        </div>
    );
};

export default AllProductsPage;
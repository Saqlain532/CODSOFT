import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppContext } from '../AppContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { categoryProductMap } from '../assets/productsData';
import { toast } from 'react-toastify';

const ProductDetailsPage = () => {
    const { productId } = useParams();
    const { cart, addToCart, updateQuantity } = useContext(AppContext);
    const [similarProducts, setSimilarProducts] = useState([]);

    // Find the product across all categories
    const allProducts = Object.values(categoryProductMap).flat();
    const product = allProducts.find(p => p.id === parseInt(productId));

    const cartItem = cart.find(item => item.id === parseInt(productId));
    const isAdded = !!cartItem;

    useEffect(() => {
        if (product) {
            // Suggest products from the same category, excluding the current one
            const sameCategory = categoryProductMap[product.categoryId] || [];
            const suggestions = sameCategory
                .filter(p => p.id !== product.id)
                .slice(0, 4); // Show top 4 similar products
            setSimilarProducts(suggestions);
        }
        window.scrollTo(0, 0);
    }, [productId, product]);

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col bg-mbg text-white text-center py-20">
                <Navbar />
                <h1 className="text-3xl font-bold">Product not found</h1>
                <Link to="/" className="mt-4 text-indigo-400">Return Home</Link>
                <Footer />
            </div>
        );
    }

    const handleAddToCart = () => {
        addToCart(product);
        toast.success(`${product.name} added to cart!`);
    };

    return (
        <div className="bg-mbg min-h-screen flex flex-col font-sans text-white">
            <Navbar />
            
            <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
                <Link to={-1} className="inline-flex items-center text-indigo-400 hover:text-indigo-300 mb-8 transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back 
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-gray-800 rounded-3xl p-6 md:p-10 border border-gray-700 shadow-2xl transition-all">
                    {/* Image Section */}
                    <div className="relative group">
                        <div className="aspect-square rounded-2xl overflow-hidden bg-gray-700">
                            <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col">
                        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">{product.name}</h1>
                        
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-3xl font-bold text-indigo-400">${product.price.toFixed(2)}</span>
                            <div className="flex items-center bg-gray-700 px-3 py-1 rounded-full text-sm">
                                <span className="text-yellow-400 mr-2">★ {product.rating}</span>
                                <span className="text-gray-400">({product.reviews} reviews)</span>
                            </div>
                        </div>

                        <p className="text-gray-300 text-lg leading-relaxed mb-8 border-b border-gray-700 pb-8">
                            {product.description}
                        </p>

                        <div className="mt-auto space-y-6">
                            {!isAdded ? (
                                <button 
                                    onClick={handleAddToCart}
                                    className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-3 text-xl"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Add to Cart
                                </button>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between bg-gray-700 rounded-2xl p-2 border border-gray-600">
                                        <button 
                                            onClick={() => updateQuantity(product.id, -1)}
                                            className="w-14 h-14 flex items-center justify-center rounded-xl bg-gray-800 text-white hover:bg-gray-600 transition-colors"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4" />
                                            </svg>
                                        </button>
                                        <span className="text-2xl font-bold">{cartItem.quantity} Added</span>
                                        <button 
                                            onClick={() => updateQuantity(product.id, 1)}
                                            className="w-14 h-14 flex items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                    </div>
                                    <Link to="/cart" className="block text-center text-indigo-400 hover:underline font-semibold">
                                        View in Shopping Cart
                                    </Link>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                    Free Global Shipping
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                    2-Year Warranty
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Similar Products Section */}
                {similarProducts.length > 0 && (
                    <div className="mt-20">
                        <div className="flex items-center justify-between mb-8 border-l-4 border-indigo-600 pl-4">
                            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">Similar Products</h2>
                            <Link to={`/category/${product.categoryId}`} className="text-indigo-400 hover:text-indigo-300 font-semibold text-sm">
                                View Entire Category
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {similarProducts.map(item => (
                                <div key={item.id} className="flex">
                                    <ProductCard product={item} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default ProductDetailsPage;
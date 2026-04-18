import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../AppContext';
import { toast } from 'react-toastify';

const Mainbanner = () => {
    const { addToCart } = useContext(AppContext);

    // Featured product data (Matches the ID in our shop data)
    const featuredProduct = { 
        id: 101, 
        categoryId: 1, 
        name: "Noise Cancelling Headphones Pro", 
        description: "Industry-leading active noise cancellation.", 
        price: 199.00, 
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e" 
    };

    const handleShopSale = () => {
        addToCart(featuredProduct);
        toast.success(`${featuredProduct.name} added to cart!`);
    };

    return (
        <div className="relative w-full  mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            {/* Main Gradient Background */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-indigo-900 via-purple-900 to-black w-full min-h-[450px] flex items-center">

                {/* Abstract floating shapes for background depth */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute top-1/2 -right-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
                </div>

                {/* Content Container */}
                <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between p-8 md:p-16">

                    {/* Left Text Content */}
                    <div className="w-full md:w-1/2 flex flex-col items-start justify-center text-left space-y-6">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                            <span className="text-sm font-bold text-pink-300 uppercase tracking-widest">
                                limited time offer
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
                            Next-Gen <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400">
                                Audio Experience
                            </span>
                        </h1>

                        <p className="text-lg text-gray-300 max-w-md">
                            Elevate your sound with our premium noise-cancelling wireless headphones. Now up to <span className="font-bold text-white">40% off</span> during our summer tech event.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button 
                                onClick={handleShopSale}
                                className="px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg hover:scale-105 hover:bg-gray-100 transition-all duration-300 shadow-lg shadow-white/20"
                            >
                                Add to Cart
                            </button>
                            <Link 
                                to={`/product/${featuredProduct.id}`}
                                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-bold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300 text-center"
                            >
                                View Details
                            </Link>
                        </div>
                    </div>

                    {/* Right Image Content */}
                    <div className="w-full md:w-1/2 mt-12 md:mt-0 flex justify-center md:justify-end">
                        <div className="relative w-72 h-72 md:w-[450px] md:h-[450px]">
                            {/* Decorative glowing ring behind image */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-pink-500 rounded-full blur-[60px] opacity-40 animate-pulse"></div>

                            <img
                                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80"
                                alt="Premium Headphones"
                                className="relative z-10 w-full h-full object-cover rounded-full shadow-2xl border-4 border-white/10 transform hover:scale-105 hover:-rotate-6 transition-all duration-500 ease-out"
                            />

                            {/* Price Badge Badge placed dynamically */}
                            <div className="absolute top-4 -right-4 md:top-12 md:-right-8 z-20 bg-gradient-to-br from-pink-500 to-orange-400 w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-2xl border-4 border-gray-900 transform rotate-12 hover:rotate-0 transition-all duration-300 cursor-pointer">
                                <span className="text-xs text-white uppercase font-bold tracking-widest mt-1">Only</span>
                                <span className="text-2xl font-extrabold text-white leading-none">$199</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Mainbanner;
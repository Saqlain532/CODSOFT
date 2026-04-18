import React from 'react';
import { ZenithNavIcon } from '../assets/ZenithNavIcon';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12 mt-16 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-extrabold text-white tracking-tight"><ZenithNavIcon /></h3>
                        <p className="text-sm text-gray-400">
                            Your one-stop destination for the best premium products. Fast shipping, great customer service, and unbeatable prices.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Home</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Shop</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Categories</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">About Us</a></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Customer Service</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Contact Us</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Shipping Policy</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Returns & Exchanges</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">FAQs</a></li>
                        </ul>
                    </div>

                    {/* Newsletter / Social */}
                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Stay Connected</h4>
                        <p className="text-sm text-gray-400 mb-4">Subscribe to our newsletter for exclusive offers.</p>
                        <form className="flex">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-2 bg-gray-800 text-white rounded-l-md focus:outline-none focus:ring-1 focus:ring-indigo-500 border border-gray-700"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 font-semibold text-white rounded-r-md hover:bg-indigo-700 transition-colors"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Zenith Mart. All rights reserved.</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

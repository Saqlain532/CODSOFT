import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../AppContext';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';

const CartPage = () => {
    const { cart, updateQuantity, removeFromCart, placeOrder, startStripeCheckout, isAuthenticated, user, addAddress } = useContext(AppContext);
    const [isOrdering, setIsOrdering] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
    const [newAddress, setNewAddress] = useState({ street: '', city: '', zipCode: '' });
    const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        if (user?.addresses?.length > 0) {
            setSelectedAddressIndex(0);
        }
    }, [user]);

    const handleAddAddress = async (e) => {
        e.preventDefault();
        const result = await addAddress(newAddress);
        if (result.success) {
            toast.success('Address added!');
            setShowAddressForm(false);
            setNewAddress({ street: '', city: '', zipCode: '' });
        } else {
            toast.error(result.message);
        }
    };

    const handleUpdateQuantity = (id, delta, name) => {
        const item = cart.find(i => i.id === id);
        if (item.quantity === 1 && delta === -1) {
            toast.error(`${name} removed from cart`);
        } else if (delta === 1) {
            toast.info(`Increased ${name} quantity`);
        } else {
            toast.info(`Decreased ${name} quantity`);
        }
        updateQuantity(id, delta);
    };

    const handleRemove = (id, name) => {
        removeFromCart(id);
        toast.error(`${name} removed from cart`);
    };

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax mock
    const total = subtotal + tax;

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            toast.warning('Please login to place an order');
            return;
        }

        if (selectedAddressIndex === null) {
            toast.error('Please select or add a shipping address');
            return;
        }

        setIsOrdering(true);
        const addr = user.addresses[selectedAddressIndex];
        const orderData = {
            items: cart.map(item => ({
                productId: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            })),
            totalAmount: total,
            shippingAddress: `${addr.street}, ${addr.city}, ${addr.zipCode}`,
            paymentMethod: paymentMethod
        };

        if (paymentMethod === 'Online Payment') {
            const result = await startStripeCheckout(orderData);
            setIsOrdering(false);
            if (!result.success) {
                toast.error(result.message);
            }
            return;
        }

        const result = await placeOrder(orderData);
        setIsOrdering(false);

        if (result.success) {
            toast.success('Order placed successfully!');
            navigate('/profile');
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="bg-mbg min-h-screen flex flex-col font-sans">
            <Navbar />

            <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-extrabold text-white mb-8">Shopping Cart</h1>

                {cart.length === 0 ? (
                    <div className="bg-gray-800 rounded-2xl p-12 text-center border border-gray-700 shadow-xl">
                        <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Browse our top categories and find something you love!</p>
                        <Link to="/" className="inline-flex px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full transition-colors duration-300">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Cart Items List */}
                        <div className="lg:w-2/3 space-y-4">
                            {cart.map((item) => (
                                <div key={item.id} className="bg-gray-800 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6 border border-gray-700 shadow-sm relative">
                                    <div className="w-full sm:w-32 h-32 shrink-0 bg-gray-200 rounded-xl overflow-hidden relative group">
                                         <Link to={`/category/${item.categoryId}`} className="absolute inset-0 z-10"></Link>
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    </div>
                                    
                                    <div className="flex-grow text-center sm:text-left w-full">
                                        <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{item.name}</h3>
                                        <p className="text-sm text-gray-400 mb-4 line-clamp-1">{item.description}</p>
                                        <div className="text-indigo-400 font-bold text-lg">${item.price.toFixed(2)}</div>
                                    </div>

                                    <div className="flex flex-col items-center gap-3 shrink-0">
                                        <div className="flex items-center bg-gray-900 rounded-lg border border-gray-600 overflow-hidden">
                                            <button 
                                                onClick={() => handleUpdateQuantity(item.id, -1, item.name)}
                                                className="px-3 py-1.5 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                                            </button>
                                            <div className="px-4 py-1.5 font-semibold text-white bg-gray-800 min-w-[3rem] text-center border-x border-gray-600">
                                                {item.quantity}
                                            </div>
                                            <button 
                                                onClick={() => handleUpdateQuantity(item.id, 1, item.name)}
                                                className="px-3 py-1.5 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                            </button>
                                        </div>
                                        <button 
                                            onClick={() => handleRemove(item.id, item.name)}
                                            className="text-xs text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors"
                                        >
                                            Remove Item
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:w-1/3">
                            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl sticky top-24">
                                <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
                                
                                <div className="space-y-4 text-sm text-gray-300 border-b border-gray-700 pb-6 mb-6">
                                    <div className="flex justify-between">
                                        <span>Subtotal ({cart.length} items)</span>
                                        <span className="text-white font-medium">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Estimated Tax (8%)</span>
                                        <span className="text-white font-medium">${tax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span className="text-green-400 font-medium">Free</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mb-8">
                                    <span className="text-lg font-bold text-white">Total</span>
                                    <span className="text-2xl font-extrabold text-indigo-400">${total.toFixed(2)}</span>
                                </div>

                                {/* Address Selection Section */}
                                <div className="mb-6 p-4 bg-gray-700/30 rounded-xl border border-gray-700">
                                    <h3 className="text-white font-bold mb-3 flex justify-between items-center">
                                        Shipping Address
                                        <button 
                                            onClick={() => setShowAddressForm(!showAddressForm)}
                                            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                                        >
                                            {showAddressForm ? 'Cancel' : '+ Add New'}
                                        </button>
                                    </h3>

                                    {showAddressForm ? (
                                        <form onSubmit={handleAddAddress} className="space-y-3 mb-4">
                                            <input 
                                                type="text" 
                                                placeholder="Street" 
                                                className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-sm text-white"
                                                value={newAddress.street}
                                                onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                                                required
                                            />
                                            <div className="flex gap-2">
                                                <input 
                                                    type="text" 
                                                    placeholder="City" 
                                                    className="w-1/2 bg-gray-800 border border-gray-600 rounded-lg p-2 text-sm text-white"
                                                    value={newAddress.city}
                                                    onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                                                    required
                                                />
                                                <input 
                                                    type="text" 
                                                    placeholder="Zip" 
                                                    className="w-1/2 bg-gray-800 border border-gray-600 rounded-lg p-2 text-sm text-white"
                                                    value={newAddress.zipCode}
                                                    onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})}
                                                    required
                                                />
                                            </div>
                                            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs py-2 rounded-lg font-bold">
                                                Save Address
                                            </button>
                                        </form>
                                    ) : (
                                        <div className="space-y-2">
                                            {user?.addresses?.length > 0 ? (
                                                user.addresses.map((addr, idx) => (
                                                    <div 
                                                        key={idx}
                                                        onClick={() => setSelectedAddressIndex(idx)}
                                                        className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedAddressIndex === idx ? 'bg-indigo-600/20 border-indigo-500' : 'bg-gray-800/40 border-gray-700 hover:border-gray-600'}`}
                                                    >
                                                        <p className="text-xs text-white font-medium">{addr.street}</p>
                                                        <p className="text-[10px] text-gray-400">{addr.city}, {addr.zipCode}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-xs text-gray-500 italic">No addresses saved. Click "+ Add New" to continue.</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Payment Method Selection */}
                                <div className="mb-6 p-4 bg-gray-700/30 rounded-xl border border-gray-700">
                                    <h3 className="text-white font-bold mb-3">Payment Method</h3>
                                    <select 
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="Cash on Delivery">Cash on Delivery</option>
                                        <option value="Online Payment">Online Payment (Mock)</option>
                                    </select>
                                    <p className="mt-2 text-[10px] text-gray-500 italic">
                                        {paymentMethod === 'Cash on Delivery' ? 'Pay when you receive the items.' : 'Process your payment securely online.'}
                                    </p>
                                </div>

                                <button 
                                    onClick={handleCheckout}
                                    disabled={isOrdering || cart.length === 0}
                                    className={`w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all duration-300 transform hover:-translate-y-0.5 ${isOrdering ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isOrdering ? 'Processing Order...' : 'Proceed to Checkout'}
                                </button>
                                
                                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Secure SSL Encrypted Checkout
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default CartPage;
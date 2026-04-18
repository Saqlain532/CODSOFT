import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../AppContext';
import { toast } from 'react-toastify';

const OrderDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AppContext);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
            return;
        }
        fetchOrderDetails();
    }, [id, isAuthenticated]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
            const response = await fetch(`${apiUrl}/orders/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.status === 'success') {
                setOrder(data.data.order);
            }
        } catch (error) {
            console.error('Error fetching order:', error);
            toast.error('Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-mbg pt-24 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-mbg pt-24 text-center text-white">
                <h2 className="text-2xl font-bold">Order not found</h2>
                <Link to="/profile" className="text-indigo-500 hover:underline mt-4 inline-block">Back to Profile</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-mbg pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Link to="/profile" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group">
                    <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Back to Orders</span>
                </Link>

                <div className="bg-cbg rounded-3xl overflow-hidden shadow-xl border border-gray-800">
                    {/* Header */}
                    <div className="bg-indigo-600 p-8 text-white flex justify-between items-center flex-wrap gap-4">
                        <div>
                            <p className="text-indigo-200 text-sm font-mono uppercase tracking-widest">Order ID: #{order._id}</p>
                            <h1 className="text-3xl font-extrabold mt-1">Order Details</h1>
                        </div>
                        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/30 text-center">
                            <p className="text-xs uppercase font-bold opacity-70">Status</p>
                            <p className="font-bold">{order.status}</p>
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Status & Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-800/40 p-5 rounded-2xl border border-gray-700">
                                <p className="text-gray-400 text-xs uppercase font-bold mb-2">Ordered on</p>
                                <p className="text-white font-bold">{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                            </div>
                            <div className="bg-gray-800/40 p-5 rounded-2xl border border-gray-700">
                                <p className="text-gray-400 text-xs uppercase font-bold mb-2">Payment Method</p>
                                <p className="text-white font-bold">{order.paymentMethod}</p>
                                <p className={`text-xs font-bold mt-1 ${order.paymentStatus === 'Paid' ? 'text-green-500' : 'text-yellow-500'}`}>
                                    {order.paymentStatus}
                                </p>
                            </div>
                            <div className="bg-gray-800/40 p-5 rounded-2xl border border-gray-700">
                                <p className="text-gray-400 text-xs uppercase font-bold mb-2">Shipping Address</p>
                                <p className="text-white text-sm leading-relaxed">{order.shippingAddress}</p>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div>
                            <h3 className="text-xl font-bold text-white mb-4">Items Ordered</h3>
                            <div className="space-y-4">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 bg-gray-800/20 p-4 rounded-2xl border border-gray-700">
                                        <div className="w-16 h-16 bg-gray-700 rounded-xl overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-white font-bold">{item.name}</h4>
                                            <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white font-bold">${item.price.toFixed(2)}</p>
                                            <p className="text-gray-400 text-xs">per unit</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="pt-8 border-t border-gray-800 flex justify-end">
                            <div className="w-full md:w-64 space-y-2">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span>${order.totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Shipping</span>
                                    <span className="text-green-500 font-bold">FREE</span>
                                </div>
                                <div className="flex justify-between text-white text-2xl font-black pt-4 border-t border-gray-800">
                                    <span>Total</span>
                                    <span>${order.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsPage;
import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../AppContext';
import { Navigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProfilePage = () => {
    const { user, isAuthenticated, logoutUser, getOrders, clearCart } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState('info');
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    useEffect(() => {
        if (isAuthenticated && activeTab === 'orders') {
            fetchOrders();
        }
    }, [isAuthenticated, activeTab]);

    const fetchOrders = async () => {
        setLoadingOrders(true);
        const result = await getOrders();
        if (result.success) {
            setOrders(result.orders);
        }
        setLoadingOrders(false);
    };

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        if (query.get('payment') === 'success') {
            toast.success('Payment successful! Your order is being processed.');
            clearCart();
        }
        if (query.get('payment') === 'cancel') {
            toast.error('Payment cancelled. Please try again.');
        }
    }, []);

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    return (
        <div className="min-h-screen bg-mbg pt-24 pb-12 px-4 relative">
            {/* Close Button */}
            <Link 
                to="/" 
                className="absolute top-28 right-8 md:right-20 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full border border-gray-700 transition-all shadow-lg z-10"
                title="Close and return to home"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </Link>

            <div className="max-w-4xl mx-auto">
                <div className="bg-cbg rounded-3xl overflow-hidden shadow-xl border border-gray-800">
                    {/* Header */}
                    <div className="bg-indigo-600 p-8 text-white">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold backdrop-blur-md">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold">{user?.name}</h1>
                                <p className="opacity-80">{user?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex border-b border-gray-800">
                        <button 
                            onClick={() => setActiveTab('info')}
                            className={`flex-1 py-4 font-bold transition-all ${activeTab === 'info' ? 'text-indigo-500 border-b-2 border-indigo-500 bg-indigo-500/5' : 'text-gray-400 hover:text-white'}`}
                        >
                            Profile Info
                        </button>
                        <button 
                            onClick={() => setActiveTab('orders')}
                            className={`flex-1 py-4 font-bold transition-all ${activeTab === 'orders' ? 'text-indigo-500 border-b-2 border-indigo-500 bg-indigo-500/5' : 'text-gray-400 hover:text-white'}`}
                        >
                            My Orders
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="p-8">
                        {activeTab === 'info' ? (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-white mb-4">Personal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Username</p>
                                        <p className="text-white bg-gray-800/50 p-3 rounded-xl border border-gray-700">{user?.name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Email Address</p>
                                        <p className="text-white bg-gray-800/50 p-3 rounded-xl border border-gray-700">{user?.email}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Account Status</p>
                                        <p className="inline-block px-3 py-1 bg-green-500/10 text-green-500 rounded-full border border-green-500/20 text-sm font-bold">Active</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Role</p>
                                        <p className="text-white capitalize">{user?.role || 'User'}</p>
                                    </div>
                                </div>
                                <div className="pt-8 border-t border-gray-800 flex justify-end">
                                    <button 
                                        onClick={logoutUser}
                                        className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-600/20"
                                    >
                                        Logout Account
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-white mb-4">Order History</h3>
                                {loadingOrders ? (
                                    <div className="flex justify-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                                    </div>
                                ) : orders.length > 0 ? (
                                    <div className="space-y-4">
                                        {orders.map(order => (
                                            <Link 
                                                key={order._id} 
                                                to={`/order/${order._id}`}
                                                className="bg-gray-800/40 p-5 rounded-2xl border border-gray-700 flex flex-wrap justify-between items-center gap-4 hover:border-indigo-500/50 hover:bg-gray-800/60 transition-all cursor-pointer block"
                                            >
                                                <div>
                                                    <p className="text-indigo-400 font-mono text-sm uppercase">#{order._id.slice(-6)}</p>
                                                    <p className="text-white font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                    <p className="text-gray-400 text-sm">{order.items.length} Items</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xl font-black text-white">${order.totalAmount.toFixed(2)}</p>
                                                    <div className="flex flex-col items-end gap-1">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                                                            order.status === 'Delivered' ? 'bg-green-500/10 text-green-500' : 
                                                            order.status === 'Processing' ? 'bg-yellow-500/10 text-yellow-500' :
                                                            'bg-indigo-500/10 text-indigo-500'
                                                        }`}>
                                                            {order.status}
                                                        </span>
                                                        <span className="text-[10px] text-gray-400 font-medium">
                                                            {order.paymentMethod} • {order.paymentStatus}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-gray-400">You haven't placed any orders yet.</p>
                                        <Link to="/products" className="mt-4 inline-block text-indigo-400 hover:underline">Start Shopping</Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
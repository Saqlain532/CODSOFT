import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cart, setCart] = useState(() => {
        const localData = localStorage.getItem('cart');
        return localData ? JSON.parse(localData) : [];
    });

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(localStorage.getItem('token') || null);

   
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    const loginUser = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_URL}/users/login`, { email, password });
            const { token, data } = response.data;
            setToken(token);
            setUser(data.user);
            setLoading(false);
            return { success: true };
        } catch (error) {
            setLoading(false);
            const msg = error.response?.data?.message || 'Login failed';
            setError(msg);
            return { success: false, message: msg };
        }
    };

    const signupUser = async (name, email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_URL}/users/signup`, { name, email, password });
            const { token, data } = response.data;
            setToken(token);
            setUser(data.user);
            setLoading(false);
            return { success: true };
        } catch (error) {
            setLoading(false);
            const msg = error.response?.data?.message || 'Signup failed';
            setError(msg);
            return { success: false, message: msg };
        }
    };

    const logoutUser = () => {
        setToken(null);
        setUser(null);
    };

    const addAddress = async (addressData) => {
        try {
            const response = await axios.post(`${API_URL}/users/address`, addressData);
            setUser(prev => ({ ...prev, addresses: response.data.data.addresses }));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to add address' };
        }
    };

    const clearCart = () => {
        setCart([]);
    };

    const placeOrder = async (orderData) => {
        try {
            const response = await axios.post(`${API_URL}/orders`, orderData);
            clearCart();
            return { success: true, order: response.data.data.order };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Failed to place order' 
            };
        }
    };

    const startStripeCheckout = async (orderData) => {
        try {
            const response = await axios.post(`${API_URL}/orders/create-checkout-session`, orderData);
            if (response.data.url) {
                window.location.href = response.data.url; // Redirect to Stripe
            }
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Failed to initiate payment' 
            };
        }
    };

    const getOrders = async () => {
        try {
            const response = await axios.get(`${API_URL}/orders/my-orders`);
            return { success: true, orders: response.data.data.orders };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Failed to fetch orders' 
            };
        }
    };

    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item => 
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, delta) => {
        setCart(prevCart => {
            const updatedCart = prevCart.map(item => {
                if (item.id === productId) {
                    const newQuantity = item.quantity + delta;
                    return { ...item, quantity: newQuantity };
                }
                return item;
            }).filter(item => item.quantity > 0);
            return updatedCart;
        });
    };


    return (
        <AppContext.Provider value={{ 
            loading, error,
            cart, addToCart, removeFromCart, updateQuantity, clearCart,
            user, loginUser, signupUser, logoutUser, addAddress,
            placeOrder, getOrders, startStripeCheckout,
            isAuthenticated: !!token 
        }}>
            {children}
        </AppContext.Provider>
    );
};

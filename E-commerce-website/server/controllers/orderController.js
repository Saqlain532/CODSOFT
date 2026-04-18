import Order from '../models/Order.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
    try {
        const { items, shippingAddress } = req.body;

        const lineItems = items.map(item => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                    images: item.image ? [item.image] : [],
                },
                unit_amount: Math.round(item.price * 100), // Stripe expects cents
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/profile?payment=success`,
            cancel_url: `${process.env.CLIENT_URL}/cart?payment=cancel`,
            customer_email: req.user.email,
            metadata: {
                userId: req.user._id.toString(),
                shippingAddress,
                items: JSON.stringify(items.map(i => ({ 
                    id: i.productId, 
                    qty: i.quantity,
                    name: i.name,
                    price: i.price,
                    image: i.image 
                })))
            }
        });

        res.status(200).json({
            status: 'success',
            url: session.url
        });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

export const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

        const newOrder = await Order.create({
            user: req.user._id,
            items,
            totalAmount,
            shippingAddress,
            paymentMethod,
            paymentStatus: paymentMethod === 'Online Payment' ? 'Paid' : 'Pending',
            status: paymentMethod === 'Cash on Delivery' ? 'Confirmed' : 'Processing'
        });

        res.status(201).json({
            status: 'success',
            data: {
                order: newOrder
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort('-createdAt');

        res.status(200).json({
            status: 'success',
            results: orders.length,
            data: {
                orders
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ status: 'fail', message: 'Order not found' });
        }

        // Check if order belongs to user
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ status: 'fail', message: 'Not authorized' });
        }

        res.status(200).json({
            status: 'success',
            data: { order }
        });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};
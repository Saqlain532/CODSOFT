import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import Order from './models/Order.js';
import Stripe from 'stripe';

dotenv.config();
const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const allowedOrigins = [
    'http://localhost:5173',
    'https://codsoft-312e.vercel.app',
    'https://codsoft-pink-chi.vercel.app'
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

let cachedConnection = null;

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB successfully");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
};

// Middleware to ensure DB connection for all /api routes
app.use(async (req, res, next) => {
    if (req.path.startsWith('/api')) {
        await connectDB();
    }
    next();
});

// Stripe Webhook MUST use express.raw() and be placed BEFORE express.json()
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    await connectDB();
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
        const session = event.data.object;

        // Create or Update the order in DB after successful payment
        const metadata = session.metadata;
        const items = JSON.parse(metadata.items);

        // We use findOneAndUpdate with upsert to handle potential duplicate events from Stripe
        await Order.findOneAndUpdate(
            { 'metadata.stripeSessionId': session.id },
            {
                user: metadata.userId,
                items: items.map(item => ({
                    productId: item.id,
                    name: item.name || 'Product',
                    price: item.price,
                    quantity: item.qty,
                    image: item.image
                })),
                totalAmount: session.amount_total / 100,
                shippingAddress: metadata.shippingAddress,
                paymentMethod: 'Online Payment',
                paymentStatus: 'Paid',
                status: 'Confirmed'
            },
            { upsert: true, new: true }
        );
        console.log(`Order finalized for session ${session.id}`);
    }

    if (event.type === 'checkout.session.async_payment_failed' || event.type === 'checkout.session.expired') {
        const session = event.data.object;
        console.log(`Payment failed or session expired for: ${session.id}`);
        
        // Optionally mark order as failed if it was pre-created
        await Order.findOneAndUpdate(
            { 'metadata.stripeSessionId': session.id },
            { 
                paymentStatus: 'Failed',
                status: 'Cancelled'
            }
        );
    }

    res.json({ received: true });
});

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send(`Server started on Port ${PORT}`);
});

export default app;
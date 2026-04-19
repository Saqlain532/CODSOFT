import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(` Database Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(` Database Connection Error: ${error.message}`);
        // Removed process.exit(1) to prevent Vercel Function from crashing on startup if DB is slow
    }
};

export default connectDB;

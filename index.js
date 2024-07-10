import express from 'express';

import mongoose from 'mongoose';
import cookieParser from 'cookie-parser'
import cors from 'cors'
import authRouter from '../fsb/routes/auth.route.js'
import dotenv from 'dotenv';
dotenv.config()

const app = express();

const PORT = 4000;

app.use(express.json())
app.use(cookieParser())
app.use(cors())


const connectWithRetry = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        // Retry connection after a delay
        setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
    }
};

const connect = async () => {
    await connectWithRetry();
};

app.listen(PORT, ()=> {
    connect();
    console.log(`Server is running on port ${PORT}`);
});

app.use("/api/auth",authRouter)


app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    })
})
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './routes/auth.route.js';
import thingRouter from './routes/thing.route.js';
import userRouter from './routes/user.route.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "*" }));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
  });



// Start server
app.listen(PORT, () => {
    
    console.log(`Server is running on port ${PORT}`);
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/thing", thingRouter);
app.use("/api/user", userRouter);

// Error handler middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

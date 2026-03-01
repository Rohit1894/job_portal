import express from "express";
import cookieParser from "cookie-parser";
import mongoose, { connect } from "mongoose";
import connectDB from "./utils/db.js";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import companyRoutes from "./routes/company.routes.js";
import jobRoutes from "./routes/job.routes.js";
import applicationRoutes from "./routes/application.routes.js";



dotenv.config();
let port = process.env.PORT || 5000;


const app = express();

app.get('/', (req, res) => {
    return res.status(200).json({ message: 'Hello from backend', success: true });
});


//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));


//apis
app.use('/api/v1/user', userRouter);
app.use('/api/v1/company', companyRoutes);
app.use('/api/v1/job', jobRoutes);
app.use("/api/v1/application", applicationRoutes);


app.listen(port, () => {
    connectDB();
    console.log(`Listening on port ${port}`)});
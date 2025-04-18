import express from "express";
import helmet from 'helmet';
import path from "path";
import cookieParser from 'cookie-parser';
import verifyToken from "./middlewares/verifyTokenMiddleware.js";
import authorizedRole from "./middlewares/roleMiddleware.js";

import userRoutes from "./routes/user.js";
import authRoutes from "./routes/auth.js";

import connectDB from "./connection.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// middlewares
app.use(helmet());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Serve static frontend files
app.use(express.static(path.resolve("./", 'frontend', 'dist')));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Frontend route
app.get("/", (req, res) => {
    res.sendFile(path.resolve("./", 'frontend', 'dist', 'index.html'));
});

// Protected route - SCP Dashboard
app.get("/scp/dashboard", verifyToken, authorizedRole("SCP"), (req, res) => {
    res.sendFile(path.resolve("./", 'frontend', 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(` Server Running on port ${PORT}`);
});
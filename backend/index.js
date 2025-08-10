import "dotenv/config";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import connectToMongo from "./config/db.js";
import authRoutes from "./routes/auth.js";

const app = express();

// ✅ Allow only your frontend URL
app.use(cors({
    origin: "https://auth-with-otp-verification-1.onrender.com", // Your frontend Render URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());

connectToMongo();

app.get('/', (req, res) => {
    res.send("hello");
});

app.use("/api/auth", authRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

import "dotenv/config"
import mongoose from "mongoose"
import express from "express"
import cors from "cors"
import connectToMongo  from "./config/db.js";
import authRoutes from "./routes/auth.js";

const app=express();
app.use(express.json());
app.use(cors());
connectToMongo();
app.get('/',(req,res)=>{
    res.send("hello");
})
app.use("/api/auth", authRoutes);
const port =process.env.PORT;
app.listen(port,()=>{
    console.log(`http://localhost:${port}`);
})

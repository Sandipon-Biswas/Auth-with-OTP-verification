import crypto from 'crypto';

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import sendEmail from "../utils/emailService.js";

// register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check user
    const existingUser = await User.findOne({ email });

    if (existingUser) return res.status(400).json({ message: "email alredy used" });

    // hashed
    const hashedPassword = await bcrypt.hash(password, 10);

    // new user
    await User.create({ name, email, password: hashedPassword });

    // otp random
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // OTP save
    await Otp.create({ email, otp: otpCode });

    // send
    await sendEmail(email, "Your OTP Code", `Your OTP is: ${otpCode}`);

    res.status(201).json({ message: "রেজিস্ট্রেশন সফল , ইমেইল OTP পাঠানো হয়েছে" });
  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};

// OTP verfication router
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const storedotp = await Otp.findOne({ email, otp });
    if (!storedotp) return res.status(400).json({ message: "ভুল OTP" });

    await User.findOneAndUpdate({ email }, { isVerified: true });
    await Otp.deleteMany({ email });

    res.json({ message: "ইমেইল ভেরিফাই সম্পন্ন" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// user login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "Email not found" });

    if (!user.isVerified) return res.status(400).json({ message: "ইমেইল ভেরিফাই হয়নি" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ message: "ভুল পাসওয়ার্ড" });

    const token = jwt.sign({ id: user._id, name: user.name  }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "লগইন সফল", token });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





export const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'ইমেইল দিন' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User পাওয়া যায়নি' });

    if (user.isVerified)
      return res.status(400).json({ message: 'User ইতিমধ্যেই ভেরিফায়েড' });

    // আগের OTP মুছে ফেলো email দিয়ে
    await Otp.deleteMany({ email });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.create({ email, otp });

    await sendEmail(
      email,
      'Your OTP code (Resend)',
      `আপনার নতুন OTP কোড: ${otp}. ৫ মিনিটের মধ্যে ব্যবহার করুন।`
    );

    return res.status(200).json({ message: 'নতুন OTP পাঠানো হয়েছে' });
  } catch (error) {
    next(error);
  }
};

// src/pages/VerifyOtp.jsx
import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  // Register থেকে ইমেইল পেয়ে থাকলে তা এখানে ধরে রাখবো, নাহলে ইউজার নিজেরাই দিবে
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [msg, setMsg] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const { data } = await API.post('/auth/verify-otp', { email, otp });
      setMsg(data.message);

      // সফল হলে login page এ পাঠানো হবে
      navigate('/login');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error occurred');
    }
  };

const handleResend = async () => {
  setMsg('');
  if (!email) {
    setMsg('ইমেইল দিতে হবে');
    return;
  }
  try {
    const { data } = await API.post('/auth/resend-otp', { email });
    setMsg(data.message);
  } catch (err) {
    setMsg(err.response?.data?.message || 'OTP পাঠাতে সমস্যা হয়েছে');
  }
};

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl mb-4 font-semibold">Verify OTP</h2>
      {msg && <p className="mb-4 text-red-600">{msg}</p>}
      <form onSubmit={handleVerify} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="OTP"
          value={otp}
          onChange={e => setOtp(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Verify OTP
        </button>
      </form>
      <button
        onClick={handleResend}
        className="mt-4 w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-700"
      >
        Resend OTP
      </button>
    </div>
  );
}

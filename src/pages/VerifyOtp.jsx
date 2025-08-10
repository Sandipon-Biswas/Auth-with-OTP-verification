import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [msg, setMsg] = useState('');
  const [loadingVerify, setLoadingVerify] = useState(false); // Verify বাটনের loading
  const [loadingResend, setLoadingResend] = useState(false); // Resend বাটনের loading

  const handleVerify = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoadingVerify(true);
    try {
      const { data } = await API.post('/auth/verify-otp', { email, otp });
      setMsg(data.message);
      
setTimeout(() => {
  navigate('/login');
}, 4000);  // ২ সেকেন্ড পর রিডাইরেক্ট করবে
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error occurred');
    }
    setLoadingVerify(false);
  };

  const handleResend = async () => {
    setMsg('');
    if (!email) {
      setMsg('ইমেইল দিতে হবে');
      return;
    }
    setLoadingResend(true);
    try {
      const { data } = await API.post('/auth/resend-otp', { email });
      setMsg(data.message);
    } catch (err) {
      setMsg(err.response?.data?.message || 'OTP পাঠাতে সমস্যা হয়েছে');
    }
    setLoadingResend(false);
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
          disabled={loadingVerify || loadingResend} // লোডিং হলে ইনপুট ডিসেবল
        />
        <input
          type="text"
          placeholder="OTP"
          value={otp}
          onChange={e => setOtp(e.target.value)}
          className="w-full p-2 border rounded"
          required
          disabled={loadingVerify || loadingResend}
        />
        <button
          type="submit"
          disabled={loadingVerify}
          className={`w-full py-2 rounded text-white ${
            loadingVerify ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loadingVerify ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>

      <button
        onClick={handleResend}
        disabled={loadingResend}
        className={`mt-4 w-full py-2 rounded text-white ${
          loadingResend ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-500 hover:bg-gray-700'
        }`}
      >
        {loadingResend ? 'Sending...' : 'Resend OTP'}
      </button>
    </div>
  );
}

import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false); // loading state যোগ করলাম
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);  // API কল শুরু হওয়ার আগে loading true করি
    try {
      const { data } = await API.post('/auth/register', form);
      setMsg(data.message);
      // OTP verify পেজে email state পাঠাচ্ছি
      navigate('/verify', { state: { email: form.email } });
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
    }
    setLoading(false); // API কল শেষ হলে loading false করি
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl mb-4 font-semibold">Register</h2>
      {msg && <p className="mb-4 text-red-600">{msg}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
          disabled={loading} // লোডিং হলে ইনপুট ডিসেবল করতে পারেন
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
          disabled={loading}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading} // লোডিং হলে বাটন ডিসেবল করলাম
          className={`w-full py-2 rounded text-white ${
            loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Loading...' : 'Register'}
        </button>
      </form>
    </div>
  );
}

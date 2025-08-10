
import axios from 'axios';
const API = axios.create({
  baseURL: 'https://auth-with-otp-verification.onrender.com/api',
});

export default API;

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor: unwrap data
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message = err.response?.data?.message || err.message || 'Something went wrong';
    return Promise.reject({ message, status: err.response?.status });
  }
);

export default api;

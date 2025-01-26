// src/service/api.js
import axios from 'axios';
import { getToken } from '../context/AuthContext';

const api = axios.create({
  baseURL: 'http://localhost:3009/api', // Assurez-vous que c'est la bonne URL de votre backend
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


const unprotectedRoutes = ['/login', '/register'];

//an interceptor to add the token to the request
api.interceptors.request.use(
  (config) => {
    if (!unprotectedRoutes.some(route => config.url.includes(route))) {
      const token = getToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);



export default api;

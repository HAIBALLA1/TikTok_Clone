import axios from 'axios';
import { getToken } from '../context/AuthContext';

const api = axios.create({
  baseURL: 'http://localhost:3009/api', 
  timeout: 150000,
  headers: {
    'Content-Type': 'application/json',
  },
});


const unprotectedRoutes = ['/login', '/register'];


// interceptor to add the token to the request
api.interceptors.request.use(
  (config) => {
    console.log('Request:', config);
    if (!unprotectedRoutes.some(route => config.url.includes(route))) {
      const token = getToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('Response:', response);
    return response;
  },
  (error) => {
    console.error('Response Error:', error.response || error);
    return Promise.reject(error);
  }
);



export default api;

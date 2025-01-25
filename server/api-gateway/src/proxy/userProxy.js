import { createProxyMiddleware } from 'http-proxy-middleware';
import { userServiceUrl } from '../config/config.js';

const userProxy = createProxyMiddleware({
    target: userServiceUrl,
    changeOrigin: true,
    //pathRewrite: {
       // '^/api/users': '', // Remove /api/users from the request path
},
);

export default userProxy;
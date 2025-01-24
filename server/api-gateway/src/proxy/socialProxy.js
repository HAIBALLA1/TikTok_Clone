import { createProxyMiddleware } from 'http-proxy-middleware';
import { socialServiceUrl } from '../config/config.js';

const socialProxy = createProxyMiddleware({
    target: socialServiceUrl,
    changeOrigin: true,
    pathRewrite: {
        '^/api/social': '', // Remove /api/social from the request path
    },
});

export default socialProxy;
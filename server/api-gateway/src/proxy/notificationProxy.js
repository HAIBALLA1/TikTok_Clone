import { createProxyMiddleware } from 'http-proxy-middleware';
import { notificationServiceUrl } from '../config/config.js';

const notificationProxy = createProxyMiddleware({
    target: notificationServiceUrl,
    changeOrigin: true,
    pathRewrite: {
        '^/api/notifications': '', // Remove /api/notifications from the request path
    },
});

export default notificationProxy;
import { createProxyMiddleware } from 'http-proxy-middleware';
import { notificationServiceUrl } from '../config/config.js';

const notificationProxy = createProxyMiddleware({
    target: notificationServiceUrl,
    changeOrigin: true,

});

export default notificationProxy;
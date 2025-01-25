import { createProxyMiddleware } from 'http-proxy-middleware';
import { socialServiceUrl } from '../config/config.js';

const socialProxy = createProxyMiddleware({
    target: socialServiceUrl,
    changeOrigin: true,

});

export default socialProxy;
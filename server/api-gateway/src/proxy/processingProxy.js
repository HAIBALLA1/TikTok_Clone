import { createProxyMiddleware } from 'http-proxy-middleware';
import { processingServiceUrl } from '../config/config.js';

const processingProxy = createProxyMiddleware({
    target: processingServiceUrl,
    changeOrigin: true,
    
});

export default processingProxy;
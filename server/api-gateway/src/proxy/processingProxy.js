import { createProxyMiddleware } from 'http-proxy-middleware';
import { processingServiceUrl } from '../config/config.js';

const processingProxy = createProxyMiddleware({
    target: processingServiceUrl,
    changeOrigin: true,
    pathRewrite: {
        '^/api/processing': '', // Remove /api/processing from the request path
    },
});

export default processingProxy;
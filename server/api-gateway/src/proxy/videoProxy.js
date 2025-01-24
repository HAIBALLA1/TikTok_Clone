import { createProxyMiddleware } from 'http-proxy-middleware';
import { videoServiceUrl } from '../config/config.js';

const videoProxy = createProxyMiddleware({
    target: videoServiceUrl,
    changeOrigin: true,
    pathRewrite: {
        '^/api/videos': '', // Remove /api/videos from the request path
    },
});

export default videoProxy;
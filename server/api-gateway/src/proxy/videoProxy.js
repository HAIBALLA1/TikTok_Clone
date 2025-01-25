import { createProxyMiddleware } from 'http-proxy-middleware';
import { videoServiceUrl } from '../config/config.js';

const videoProxy = createProxyMiddleware({
    target: videoServiceUrl,
    changeOrigin: true,
   
});

export default videoProxy;
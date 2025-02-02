import { createProxyMiddleware } from 'http-proxy-middleware';
import { videoServiceUrl } from '../config/config.js';


const videoProxy = createProxyMiddleware({
    target: videoServiceUrl,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        if (req.headers['x-user-id']) {
            proxyReq.setHeader('x-user-id', req.headers['x-user-id']);
            console.log('[Proxy Vidéo] Forwarding x-user-id:', req.headers['x-user-id']);
        }
    },

});

export default videoProxy;

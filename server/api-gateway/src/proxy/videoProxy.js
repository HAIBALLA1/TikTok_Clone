import { createProxyMiddleware } from 'http-proxy-middleware';
import { videoServiceUrl } from '../config/config.js';

const videoProxy = createProxyMiddleware({
    target: videoServiceUrl,
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
        // Vérifiez si la requête est multipart/form-data
        if (!req.is('multipart/form-data') && req.body) {
            const bodyData = JSON.stringify(req.body);
            if (!proxyReq.writableEnded) {
                proxyReq.setHeader('Content-Type', 'application/json');
                proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                proxyReq.write(bodyData);
            }
        }
    },
});

export default videoProxy;

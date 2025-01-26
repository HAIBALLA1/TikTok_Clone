// backend/proxy/userProxy.js
import { createProxyMiddleware } from 'http-proxy-middleware';
import { userServiceUrl } from '../config/config.js';

const userProxy = createProxyMiddleware({
    target: process.env.USER_SERVICE_URL || 'http://user-service:3001',
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
        if (req.body && !proxyReq.writableEnded) {
            const bodyData = JSON.stringify(req.body);
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
        }
    },
    onError: (err, req, res) => {
        console.error(`[Proxy] Erreur : ${err.message}`);
        res.status(500).send('Proxy error occurred');
    },
});


export default userProxy;

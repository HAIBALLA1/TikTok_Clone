import { createProxyMiddleware } from 'http-proxy-middleware';

const videoProxy = createProxyMiddleware({
    target: 'http://video-service:3002',
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        if (req.headers['x-user-id']) {
            proxyReq.setHeader('x-user-id', req.headers['x-user-id']);
            console.log('[Proxy Vidéo] Forwarding x-user-id:', req.headers['x-user-id']);
        }
    },
    logLevel: 'debug', // Pour des logs détaillés
});

export default videoProxy;

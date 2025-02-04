import { createProxyMiddleware } from 'http-proxy-middleware';
import { videoServiceUrl } from '../config/config.js';

const videoProxy = createProxyMiddleware({
    target: videoServiceUrl, // Assure-toi que cette URL est correcte (ex: "http://video-service:3002")
    changeOrigin: true,
    pathRewrite: { '^/api/videos': '/' }, // Pour que l'URL du service vidéo soit correctement formée
    timeout: 120000,
    proxyTimeout: 120000,
    onProxyReq: (proxyReq, req) => {
        // Transmettre le header x-user-id
        if (req.headers['x-user-id']) {
            proxyReq.setHeader('x-user-id', req.headers['x-user-id']);
            console.log('[Proxy Vidéo] Forwarding x-user-id:', req.headers['x-user-id']);
        }
        // Pour les requêtes multipart, on laisse Express gérer le body
    },
    parseReqBody: false,
});

export default videoProxy;

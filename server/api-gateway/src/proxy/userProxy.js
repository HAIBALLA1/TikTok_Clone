// backend/proxy/userProxy.js
import { createProxyMiddleware } from 'http-proxy-middleware';
import { userServiceUrl } from '../config/config.js';

const userProxy = createProxyMiddleware({
    target: userServiceUrl,
    changeOrigin: true,
    preserveHeaderKeyCase: true,
    // Supprimez ou commentez le bloc onProxyReq
    /*
    onProxyReq: (proxyReq, req, res) => {
        // Assurez-vous que le corps de la requête est prêt
        if (req.body && !proxyReq.writableEnded) {
            const bodyData = JSON.stringify(req.body);
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
        }

        // Ajoutez les en-têtes utilisateur, uniquement si disponibles
        if (req.user) {
            proxyReq.setHeader('X-User-Id', req.user.id);
            proxyReq.setHeader('X-User-Email', req.user.email);
        }
    },
    */
    onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.status(500).send('Proxy error occurred');
    },
});

export default userProxy;

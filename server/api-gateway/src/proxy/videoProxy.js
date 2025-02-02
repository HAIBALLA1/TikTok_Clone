import { createProxyMiddleware } from 'http-proxy-middleware';
import { videoServiceUrl } from '../config/config.js';


const videoProxy = createProxyMiddleware({
    target: videoServiceUrl,
    changeOrigin: true,
    timeout: 120000, 
    proxyTimeout: 120000,
    onProxyReq: (proxyReq, req, res) => {
      if (req.headers['x-user-id']) {
        proxyReq.setHeader('x-user-id', req.headers['x-user-id']);
        console.log('[Proxy Vidéo] Forwarding x-user-id:', req.headers['x-user-id']);
      }
      
      if (req.headers['content-type']) {
        proxyReq.setHeader('content-type', req.headers['content-type']);
      }
  
      console.log('[Proxy Vidéo] Forwarding headers:', req.headers);
    },
  });
  

export default videoProxy;

import { createProxyMiddleware } from 'http-proxy-middleware';
import { videoServiceUrl } from '../config/config.js';

const videoProxy = createProxyMiddleware({
  target: videoServiceUrl || 'http://video-service:3002',
  changeOrigin: true,
  timeout: 120000,
  proxyTimeout: 120000,
  pathRewrite: { '^/api/videos': '/api/videos' },
  onProxyReq: (proxyReq, req) => {
      if (req.body) {
          const bodyData = JSON.stringify(req.body);
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
          proxyReq.end();
      }
  },
  selfHandleResponse: false,
});


export default videoProxy;

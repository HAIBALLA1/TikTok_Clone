import { createProxyMiddleware } from 'http-proxy-middleware';
import { recommenderServiceUrl } from '../config/config.js';

const recommenderProxy = createProxyMiddleware({
    target: recommenderServiceUrl,
    changeOrigin: true,
    pathRewrite: {
        '^/api/recommender': '', // Remove /api/recommender from the request path
    },
});

export default recommenderProxy;
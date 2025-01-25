import { createProxyMiddleware } from 'http-proxy-middleware';
import { recommenderServiceUrl } from '../config/config.js';

const recommenderProxy = createProxyMiddleware({
    target: recommenderServiceUrl,
    changeOrigin: true,

});

export default recommenderProxy;
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log('[API Gateway] Authorization Header:', authHeader);
    const token = authHeader && authHeader.split(' ')[1]; // Extraire le token de 'Bearer TOKEN'

    if (!token) {
        console.error('[API Gateway] No token provided');
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error('[API Gateway] Invalid token:', err.message);
            return res.status(403).json({ error: 'Invalid token' });
        }

        console.log('[API Gateway] Token decoded successfully:', user);

        req.user = user;
        console.log('[API Gateway] req.user:', req.user); // Log supplémentaire

        if (user && user.id) {
            req.headers['x-user-id'] = user.id; // Ajout de l'ID utilisateur
            console.log('[API Gateway] x-user-id added to headers:', req.headers['x-user-id']);
        } else {
            console.error('[API Gateway] User ID missing in token payload');
        }

        next();
    });
};

export default authenticateToken;
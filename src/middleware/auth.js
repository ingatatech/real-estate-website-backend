import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;
export const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required. Please provide a valid token.',
        });
    }
    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Authentication token is missing.',
        });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = { id: decoded.id, role: decoded.role };
        return next();
    }
    catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token. Please log in again.',
        });
    }
};

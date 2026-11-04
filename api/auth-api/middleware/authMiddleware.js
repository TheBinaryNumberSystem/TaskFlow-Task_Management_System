import jwt from 'jsonwebtoken';

// Protect routes: verifies the JWT token
export const protect = async (req, res, next) => {
    let token;

    // Check for Bearer token in the Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Format is "Bearer <token>" -> split by space and get token
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach decoded user data (id and role) to request
            req.user = {
                id: decoded.id,
                role: decoded.role,
            };

            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

// Role-based authorization check (RBAC)
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Forbidden: role '${req.user?.role}' does not have access to this resource`,
            });
        }
        next();
    };
};
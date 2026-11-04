import jwt from 'jsonwebtoken';

/**
 * Verifies JWT token and attaches req.user = { id, role }
 */
export const protect = (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify token with shared secret
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user identity and role to the request
            req.user = {
                id: decoded.id,
                role: decoded.role,
                email: decoded.email,
            };

            return next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

/**
 * Restricts access based on roles (RBAC)
 * Example usage: authorize('manager')
 */
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
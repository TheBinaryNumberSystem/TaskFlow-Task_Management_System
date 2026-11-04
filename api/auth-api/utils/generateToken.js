import jwt from 'jsonwebtoken';


export const generateToken = (userId, role, email) => {
    return jwt.sign(
        { id: userId, role, email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );
};
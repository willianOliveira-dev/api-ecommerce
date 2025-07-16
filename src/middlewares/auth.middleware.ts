import jwt from 'jsonwebtoken';
import { type Request, type Response, type NextFunction } from 'express';

const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({
            message: 'Access Denied',
            details: 'Token required',
        });
        return;
    }
    try {
        const secret = process.env.JWT_SECRET as string;
        const verified = jwt.verify(token, secret);
        req.user = verified;
        next();
    } catch (err: any) {
        res.status(401).json({
            message: 'Access Denied',
            details: 'Invalid token',
        });
    }
};

export default authMiddleware;

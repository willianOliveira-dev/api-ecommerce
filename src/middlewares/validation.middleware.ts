import { type Request, type Response, type NextFunction } from 'express';
import Joi from 'joi';

export default function validation(
    schemaValidation: Joi.Schema
): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error } = schemaValidation.validate(req.body, {
            abortEarly: false,
        });
        if (error) return next(error);
        next();
    };
}

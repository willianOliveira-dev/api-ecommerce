import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export default function validation(schemaValidation: Joi.Schema) {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schemaValidation.validate(req.body, {
            abortEarly: false,
        });
        if (error) return next(error);
        next();
    };
}

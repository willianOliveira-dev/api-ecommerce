import { ValidationError } from 'joi';
import { type Request, type Response, type NextFunction } from 'express';
type CustomerError = ValidationError | Error;

export default function errorHandler(
    err: CustomerError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    res.status(400).json({
        message: 'Validation Error',
        details:
            err instanceof ValidationError
                ? err.details?.map((err) => err.message) ?? err.message
                : err.message,
    });
}

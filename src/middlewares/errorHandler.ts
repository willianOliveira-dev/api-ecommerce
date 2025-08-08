import { ValidationError } from 'joi';
import NotFoundError from '@utils/errors/NotFoundError';
import ConflictError from '@utils/errors/ConflictError';
import Unauthorize from '@utils/errors/ForbiddenError';
import { type Request, type Response, type NextFunction } from 'express';

type CustomerError =
    | ValidationError
    | NotFoundError
    | ConflictError
    | Error
    | Unauthorize;

export default function errorHandler(
    err: CustomerError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (err instanceof NotFoundError) {
        return res.status(404).json({
            message: 'Not Found',
            details: [err.message],
        });
    }

    if (err instanceof ConflictError) {
        return res.status(409).json({
            message: 'Conflict',
            details: [err.message],
        });
    }

    if (err instanceof Unauthorize) {
        return res.status(403).json({
            message: 'Forbidden',
            details: [err.message],
        });
    }

    return res.status(400).json({
        message: 'Validation Error',
        details:
            err instanceof ValidationError
                ? err.details?.map((err) => err.message) ?? [err.message]
                : [err.message],
    });
}

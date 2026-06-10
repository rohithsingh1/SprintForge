import {AppError} from "../utils/AppError.js";

export const errorHandler=(err, req, res, next) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: err.statusCode,
            code: err.code,
            message: err.message
        })
    }

    // Prisma: unique constraint violation
    if (err.code==="P2002") {
        return res.status(409).json({
            status: 409,
            code: "CONFLICT",
            message: `A record with that ${err.meta?.target?.join(', ')} already exists`
        })
    }

    // Prisma: record not found
    if (err.code==='P2025') {
        return res.status(404).json({
            status: 404,
            code: 'NOT_FOUND',
            message: 'Resource not found'
        })
    }

    // Unhandled / programming error — don't leak internals
    console.error('[Unhandled Error]', err)
    return res.status(500).json({
        status: 500,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred'
    })
}
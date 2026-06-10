/**
 * Operational error — expected failures we handle gracefully.
 * Any error that is NOT an AppError is treated as a bug (500).
 */

export class AppError extends Error {
    constructor(statusCode, code, message) {
        super(message)
        this.statusCode=statusCode
        this.code=code
        this.isOperational=true
    }
}
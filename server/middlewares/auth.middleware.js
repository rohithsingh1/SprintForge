import {verifyAccessToken} from "../utils/jwt.js";
import {AppError} from "../utils/AppError.js";

export const authenticate=(req, res, next) => {
    try {
        const authHeader=req.headers.authorization
        if (!authHeader) {
            throw new AppError(401, "UNAUTHORIZED",
                "Authorization header is missing")
        }

        const token=authHeader.split(" ")[1];

        if (!token) {
            throw new AppError(401, "UNAUTHORIZED",
                "Access token is missing")
        }

        try {
            const payload=verifyAccessToken(token)

            req.user={
                userId: payload.userId,
                email: payload.email,
                role: payload.role
            }

            next()
        } catch (error) {
            throw new AppError(401, "UNAUTHORIZED", "Invalid Token")
        }

    } catch (error) {
        next(error)
    }
}
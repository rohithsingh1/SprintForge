import {verifyAccessToken} from "../utils/jwt.js";
import {AppError} from "../utils/AppError.js";

export const authenticate=(req, res, next) => {
    try {
        const cookieToken=req.cookies?.accessTokens

        if (!cookieToken) {
            throw new AppError(401, "UNAUTHORIZED",
                "Access token is missing")
        }


        try {
            const payload=verifyAccessToken(cookieToken)

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

import jwt from "jsonwebtoken"
import {env} from "../config/env.js"

/**
 * Signs an access token.
 * Payload shape: { userId, email, role, exp }
 * Expires in: 15m (from JWT_ACCESS_TOKEN_EXPIRE_TIME)
 */
export const signAccessToken=({userId, email, role}) => {
    return jwt.sign({userId, email, role},
        env.JWT_ACCESS_TOKEN_SECRET_KEY,
        {expiresIn: env.JWT_ACCESS_TOKEN_EXPIRE_TIME})
}

/**
 * Signs a refresh token.
 * Payload shape: { userId, exp }
 * Expires in: 7d (from JWT_REFRESH_TOKEN_EXPIRE_TIME)
 */
export const signRefreshToken=({userId}) => {
    return jwt.sign({userId},
        env.JWT_REFRESH_TOKEN_SECRET_KEY,
        {expiresIn: env.JWT_REFRESH_TOKEN_EXPIRE_TIME})
}

/**
 * Verifies an access token.
 * Throws TokenExpiredError if expired, JsonWebTokenError if invalid.
 */
export const verifyAccessToken=(token) => {
    return jwt.verify(token, env.JWT_ACCESS_TOKEN_SECRET_KEY)
}

/**
 * Verifies a refresh token.
 * Throws TokenExpiredError if expired, JsonWebTokenError if invalid.
 */
export const verifyRefreshToken=(token) => {
    return jwt.verify(token, env.JWT_REFRESH_TOKEN_SECRET_KEY
    )
}
import {registerUser, loginUser, refreshTokens, logoutUser} from "./auth.service.js"
import {AppError} from "../../utils/AppError.js"
import {registerSchema, loginSchema, refreshTokenSchema} from "./auth.validation.js"

const isProduction=process.env.NODE_ENV==="production"
const accessTokenCookieOptions={
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 15*60*1000
}
const refreshTokenCookieOptions={
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7*24*60*60*1000
}

const setAuthCookies=(res, {accessToken, refreshToken}) => {
    res.cookie("accessTokens", accessToken, accessTokenCookieOptions)
    res.cookie("refreshTokens", refreshToken, refreshTokenCookieOptions)
}

const clearAuthCookies=(res) => {
    res.clearCookie("accessTokens", accessTokenCookieOptions)
    res.clearCookie("refreshTokens", refreshTokenCookieOptions)
}

const validate=(schema, data) => {
    const result=schema.safeParse(data)
    if (!result.success) {
        throw new AppError(400, 'VALIDATION_ERROR', result.error.issues[0].message)
    }
    return result.data
}
export const register=async (req, res, next) => {
    try {
        const body=validate(registerSchema, req.body)
        const user=await registerUser(body)
        return res.status(201).json(
            {
                status: 201,
                message: 'User registered successfully',
                data: {user}
            })
    } catch (error) {
        next(error)
    }
}

export const login=async (req, res, next) => {
    try {
        const body=validate(loginSchema, req.body)
        const result=await loginUser(body)
        setAuthCookies(res, result)

        return res.status(200).json({
            status: 200,
            message: 'Login successful',
            data: {user: result.user}
        })
    } catch (error) {
        next(error)
    }
}

export const refresh=async (req, res, next) => {
    try {
        const refreshToken=req.cookies?.refreshTokens || validate(refreshTokenSchema, req.body).refreshToken
        const tokens=await refreshTokens(refreshToken)
        setAuthCookies(res, tokens)

        return res.status(200).json({
            status: 200,
            message: 'Tokens refreshed successfully',
            data: {user: tokens.user}
        })
    } catch (error) {
        next(error)
    }
}

export const logout=async (req, res, next) => {
    try {
        const refreshToken=req.cookies?.refreshTokens || validate(refreshTokenSchema, req.body).refreshToken
        await logoutUser(refreshToken)
        clearAuthCookies(res)

        return res.status(200).json({
            status: 200,
            message: 'Logged out successfully',
            data: null
        })
    } catch (err) {next(err)}
}

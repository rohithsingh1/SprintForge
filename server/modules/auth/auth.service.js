import bcrypt from "bcryptjs";
import prisma from "../../config/db.js";
import {signAccessToken, signRefreshToken, verifyRefreshToken} from "../../utils/jwt.js";
import {AppError} from "../../utils/AppError.js";

const SALT_ROUNDS=12
const REFRESH_TOKEN_TTL_MS=7*24*60*60*1000 // 7 days

export const registerUser=async ({name, email, password, role}) => {
    const existingUser=await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (existingUser) {
        throw new AppError(409, 'EMAIL_IN_USE', 'An account with this email already exists')
    }

    const hasedPassword=await bcrypt.hash(password, SALT_ROUNDS)

    const user=await prisma.user.create({
        data: {name, email, password: hasedPassword, role},
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
        }
    })

    return user
}

export const loginUser=async ({email, password}) => {
    const user=await prisma.user.findUnique({
        where: {
            email
        }
    })

    const isPasswordMatch=await bcrypt.compare(password, user?.password? user.password:'')

    if (!user||!isPasswordMatch) {
        throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password')
    }

    return issueTokenPair(user)
}

export const refreshTokens=async (incomingToken) => {
    let payload
    try {
        payload=verifyRefreshToken(incomingToken)
    } catch (error) {
        throw new AppError(401, 'INVALID_TOKEN', 'Refresh token is invalid or expired')
    }

    const stored=await prisma.refreshToken.findUnique({
        where: {
            token: incomingToken
        }
    })

    if (!stored) {
        // Token was already rotated — possible replay attack
        // Invalidate every session for this user as a safety measure
        await prisma.refreshToken.deleteMany({
            where: {
                user: payload.userId
            }
        })
        throw new AppError(401, 'TOKEN_REUSE_DETECTED', 'Token reuse detected. Please log in again')
    }

    if (stored.expiresAt<new Date()) {
        await prisma.refreshToken.delete({where: {token: incomingToken}})
        throw new AppError(401, 'TOKEN_EXPIRED', 'Refresh token has expired. Please log in again')
    }

    const user=await prisma.user.findUnique({
        where: {
            id: payload.userId
        }
    })

    if (!user) {
        throw new AppError(401, 'USER_NOT_FOUND', 'User no longer exists')
    }

    // 3. Rotate — delete old, issue new pair atomically
    await prisma.refreshToken.delete({where: {token: incomingToken}})
    return issueTokenPair(user)
}

export const logoutUser=async (token) => {
    // deleteMany is intentional — silently ignores missing tokens (idempotent)
    await prisma.refreshToken.deleteMany({where: {token}})
}

export const issueTokenPair=async (user) => {
    const accessToken=signAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role
    })

    const refreshToken=signRefreshToken({userId: user.id})

    const expiresAt=new Date(Date.now()+REFRESH_TOKEN_TTL_MS)

    await prisma.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
            expiresAt
        }
    })

    return {
        user: {id: user.id, name: user.name, email: user.email, role: user.role},
        accessToken,
        refreshToken
    }
}
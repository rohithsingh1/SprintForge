import {z} from "zod"

export const registerSchema=z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters')
        .max(72, 'Password must not exceed 72 characters'),
    role: z.enum([
        "ADMIN",
        "MANAGER",
        "MEMBER"
    ])
})

export const loginSchema=z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
})

export const refreshTokenSchema=z.object({
    refreshToken: z.string().min(1, 'Refresh token is required')
})
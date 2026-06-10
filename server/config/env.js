import "dotenv/config"

const required=[
    "JWT_ACCESS_TOKEN_SECRET_KEY",
    "JWT_REFRESH_TOKEN_SECRET_KEY",
    "JWT_ACCESS_TOKEN_EXPIRE_TIME",
    "JWT_REFRESH_TOKEN_EXPIRE_TIME",
    "DATABASE_URL",
    "PORT"
]

for (const key of required) {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`)
    }
}

export const env={
    PORT: parseInt(process.env.PORT||'4000'),
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_ACCESS_TOKEN_SECRET_KEY: process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    JWT_REFRESH_TOKEN_SECRET_KEY: process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
    JWT_ACCESS_TOKEN_EXPIRE_TIME: process.env.JWT_ACCESS_TOKEN_EXPIRE_TIME,
    JWT_REFRESH_TOKEN_EXPIRE_TIME: process.env.JWT_REFRESH_TOKEN_EXPIRE_TIME
}
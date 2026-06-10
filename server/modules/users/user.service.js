import bcrypt from "bcryptjs";
import prisma from "../../config/db.js";
import {AppError} from "../../utils/AppError.js";

const SALT_ROUNDS=12

// Fields returned for every user response — password is always excluded
const USER_SELECT={
    id: true,
    name: true,
    email: true,
    role: true,
    createdAt: true,
    updatedAt: true
}

export const getAllUsers=async () => {
    return prisma.user.findMany({
        select: USER_SELECT,
        orderBy: {createdAt: "desc"}
    })
}

export const getUserById=async (id) => {
    const user=await prisma.user.findUnique({
        where: {
            id
        }
    })

    if (!user) {
        throw new AppError(404, "USER_NOT_FOUND", "User not found")
    }

    return user
}

export const createUser=async ({name, email, password, role}) => {
    const existing=await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (existing) {
        throw new AppError(409, "EMAIL_IN_USE", "An account with this email already exists")
    }

    const hashedPassword=await bcrypt.hash(password, SALT_ROUNDS)

    return await prisma.user.create({
        data: {
            name, email, password: hashedPassword, role
        },
        select: USER_SELECT
    })
}

export const updateUser=async (id, {name, email, password, role}) => {
    const existing=await prisma.user.findUnique({
        where: {
            id
        }
    })

    if (!existing) {
        throw new AppError(404, "USER_NOT_FOUND", "User not found")
    }

    if (email&&email!==existing.email) {
        const emailTaken=await prisma.user.findUnique({where: {email}})

        if (emailTaken) {
            throw new AppError(409, "EMAIL_IN_USE", "An account with this email already exists")
        }
    }

    const data={}
    if (name!==undefined) data.name=name
    if (email!==undefined) data.email=email
    if (role!==undefined) data.role=role
    if (password!==undefined) data.password=await bcrypt.hash(password, SALT_ROUNDS)

    return await prisma.user.update({
        where: {id},
        data,
        select: USER_SELECT
    })
}

export const deleteUser=async (id, requesterId) => {
    if (id===requesterId) {
        throw new AppError(400, "SELF_DELETE_FORBIDDEN", "You cannot delete your own account")
    }

    const existing=await prisma.user.findUnique({
        where: {
            id
        }
    })

    if (!existing) {
        throw new AppError(404, "USER_NOT_FOUND", "User not found")
    }

    return await prisma.user.delete({where: {id}})
}
import {AppError} from "../../utils/AppError.js";
import {createUserSchema, updateUserSchema} from "./user.validation.js";
import * as UserService from "./user.service.js"

const validate=(schema, data) => {
    const result=schema.safeParse(data)
    if (!result.success) {
        throw new AppError(400, "VALIDATION_ERROR", result.error.issues[0].message)
    }
    return result.data
}

export const getUsers=async (req, res, next) => {
    try {
        const users=await UserService.getAllUsers()
        return res.status(200).json({
            status: 200,
            message: "Users retrieved successfully",
            data: {users}
        })
    } catch (error) {
        next(error)
    }
}

export const getUser=async (req, res, next) => {
    try {
        const user=await UserService.getUserById(req.params.id)
        return res.status(200).json({
            status: 200,
            message: "User retrieved successfully",
            data: {user}
        })
    } catch (error) {
        next(error)
    }
}

export const createUser=async (req, res, next) => {
    try {
        const body=validate(createUserSchema, req.body)
        const user=await UserService.createUser(body)
        return res.status(201).json({
            status: 201,
            message: "User created successfully",
            data: {user}
        })
    } catch (error) {
        next(error)
    }
}

export const updateUser=async (req, res, next) => {
    try {
        const body=validate(updateUserSchema, req.body)
        const user=await UserService.updateUser(req.params.id, body)
        return res.status(200).json({
            status: 200,
            message: "User updated successfully",
            data: {user}
        })
    } catch (error) {
        next(error)
    }
}

export const deleteUser=async (req, res, next) => {
    try {
        await UserService.deleteUser(req.params.id, req.user.userId)
        return res.status(200).json({
            status: 200,
            message: "User deleted successfully",
            data: null
        })
    } catch (error) {
        next(error)
    }
}
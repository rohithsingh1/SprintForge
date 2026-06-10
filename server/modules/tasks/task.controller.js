import {AppError} from "../../utils/AppError.js";
import {createTaskSchema, updateTaskSchema, transitionStatusSchema} from "./task.validation.js";
import * as TaskService from "./task.service.js"

const validate=(schema, data) => {
    const result=schema.safeParse(data)
    if (!result.success) {
        throw new AppError(400, "VALIDATION_ERROR", result.error.issues[0].message)
    }
    return result.data
}

export const getTasks=async (req, res, next) => {
    try {
        // Optional query-string filters: ?status=TODO&priority=HIGH&assigneeId=xxx
        const {status, priority, assigneeId}=req.query||{}
        const tasks=await TaskService.getAllTasks({status, priority, assigneeId})

        return res.status(200).json({
            status: 200,
            message: "Tasks retrieved successfully",
            data: {tasks}
        })
    } catch (error) {
        next(error)
    }
}

export const getTask=async (req, res, next) => {
    try {
        const task=await TaskService.getTaskById(req.params.id)

        return res.status(200).json({
            status: 200,
            message: "Task retrieved successfully",
            data: {task}
        })
    } catch (error) {
        next(error)
    }
}

export const createTask=async (req, res, next) => {
    try {
        const body=validate(createTaskSchema, req.body)
        const task=await TaskService.createTask(body, req.user.userId)

        return res.status(201).json({
            status: 201,
            message: "Task created successfully",
            data: {task}
        })
    } catch (error) {
        next(error)
    }
}

export const updateTask=async (req, res, next) => {
    try {
        const body=validate(createTaskSchema, req.body)
        const task=await TaskService.updateTask(
            req.params.id,
            body,
            req.user.userId,
            req.user.role
        )

        return res.status(200).json({
            status: 200,
            message: "Task updated successfully",
            data: {task}
        })
    } catch (error) {
        next(error)
    }
}

export const deleteTask=async (req, res, next) => {
    try {
        await TaskService.deleteTask(req.params.id, req.user.userId, req.user.role)

        return res.status(200).json({
            status: 200,
            message: "Task deleted successfully",
            data: null
        })
    } catch (error) {
        next(error)
    }
}

export const updateTaskStatus=async (req, res, next) => {
    try {
        const {status}=validate(transitionStatusSchema, req.body)

        const task=await TaskService.transitionTaskStatus(req.params.id, status, req.user.userId, req.user.role)


        return res.status(200).json({
            status: 200,
            message: "Task status updated successfully",
            data: {task}
        })
    } catch (error) {
        next(error)
    }
}
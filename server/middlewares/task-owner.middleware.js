import {AppError} from "../utils/AppError.js";
import prisma from "../config/db.js";


const TASK_SELECT={
    id: true,
    title: true,
    description: true,
    priority: true,
    status: true,
    dueDate: true,
    createdAt: true,
    updatedAt: true,
    assignee: {
        select: {id: true, name: true, email: true, role: true}
    },
    createdBy: {
        select: {id: true, name: true, email: true, role: true}
    }
}

export const taskAuthorize=(...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(
                new AppError(401, "UNAUTHORIZED", "Authentication required")
            );
        }

        const {role, userId}=req.user

        const task=await prisma.task.findUnique({
            where: {
                id: req.params.id
            },
            select: TASK_SELECT
        })

        if (!roles.includes(role)) {
            if (userId!==task.assignee.id) {
                return next(
                    new AppError(403, "FORBIDDEN", "Only the task creator or a manager or admin can update/delete this task")
                )
            }
            return next()
        }
        return next()
    }
}
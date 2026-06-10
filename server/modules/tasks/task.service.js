import prisma from "../../config/db.js";
import {AppError} from "../../utils/AppError.js";

/**
 * Allowed status transitions.
 * DONE is a terminal state — no further transitions.
 * BLOCKED is reachable from any active state and can be unblocked back
 * to any active state.
 */
const STATUS_TRANSITIONS={
    TODO: ["IN_PROGRESS", "BLOCKED"],
    IN_PROGRESS: ["IN_REVIEW", "BLOCKED"],
    IN_REVIEW: ["DONE", "BLOCKED"],
    DONE: [],
    BLOCKED: ["TODO", "IN_PROGRESS", "IN_REVIEW"]
}

// Consistent shape returned for every task response
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
        select: {id: true, name: true, email: true}
    }
}

export const getAllTasks=async (filters={}) => {
    const where={}
    if (filters.status) {
        where.status=filters.status
    }
    if (filters.priority) where.priority=filters.priority
    if (filters.assigneeId) where.assigneeId=filters.assigneeId

    return await prisma.task.findMany({
        where,
        select: TASK_SELECT,
        orderBy: {createdAt: "desc"}
    })
}

export const getTaskById=async (id) => {
    const task=await prisma.task.findUnique({
        where: {
            id
        },
        select: TASK_SELECT
    })

    if (!task) {
        throw new AppError(404, "TASK_NOT_FOUND", "Task not found")
    }

    return task
}

export const createTask=async (body, createdById) => {
    const {title, description, priority, assigneeId, dueDate}=body

    if (assigneeId) {
        const assignee=await prisma.user.findUnique({
            where: {
                id: assigneeId
            }
        })

        if (!assignee) {
            throw new AppError(404, "ASSIGNEE_NOT_FOUND", "Assignee user not found")
        }
    }

    const data={}
    if (title!==undefined) data.title=title
    if (description!==undefined) data.description=description
    if (priority!==undefined) data.priority=priority
    if (assigneeId!==undefined) data.assigneeId=assigneeId   // null clears it
    if (dueDate!==undefined) data.dueDate=dueDate      // null clears it

    return await prisma.task.create({
        data,
        select: TASK_SELECT
    })
}

export const updateTask=async (id, body, requesterId, requesterRole) => {
    const task=await prisma.task.findUnique({
        where: {
            id
        }
    })
    if (!task) {
        throw new AppError(404, "TASK_NOT_FOUND", "Task not found")
    }

    // // Only the task creator, task assignee, a MANAGER, or an ADMIN may update task fields
    const canUpdate=task.createdById===requesterId||task.assigneeId===requesterId||requesterRole==="MANAGER"||requesterRole==="ADMIN"

    if (!canUpdate) {
        throw new AppError(403, "FORBIDDEN", "Only the task creator or a manager can update this task")
    }

    const {title, description, priority, assigneeId, dueDate}=body

    if (assigneeId) {
        const assignee=await prisma.user.findUnique({
            where: {
                id: assigneeId
            }
        })
        if (!assignee) {
            throw new AppError(404, "ASSIGNEE_NOT_FOUND", "Assignee user not found")
        }
    }

    const data={}
    if (title!==undefined) data.title=title
    if (description!==undefined) data.description=description
    if (priority!==undefined) data.priority=priority
    if (assigneeId!==undefined) data.assigneeId=assigneeId   // null clears it
    if (dueDate!==undefined) data.dueDate=dueDate      // null clears it

    return await prisma.task.update({
        where: {
            id
        },
        data,
        select: TASK_SELECT
    })
}

export const deleteTask=async (id, requesterId, requesterRole) => {
    const task=await prisma.task.findUnique({where: {id}})
    if (!task) throw new AppError(404, "TASK_NOT_FOUND", "Task not found")

    // // Only the task creator, task assignee, a MANAGER, or an ADMIN may update task fields
    const canDelete=task.createdById===requesterId||task.assigneeId===requesterId||requesterRole==="MANAGER"||requesterRole==="ADMIN"

    if (!canDelete) {
        throw new AppError(403, "FORBIDDEN", "Only the task creator or an admin can delete this task")
    }

    await prisma.task.delete({where: {id}})
}

export const transitionTaskStatus=async (id, newStatus, requesterId, requesterRole) => {
    const task=await prisma.task.findUnique({where: {id}})
    if (!task) throw new AppError(404, "TASK_NOT_FOUND", "Task not found")

    // // Only the task creator, task assignee, a MANAGER, or an ADMIN may update task fields
    const canTransition=task.createdById===requesterId||task.assigneeId===requesterId||requesterRole==="MANAGER"||requesterRole==="ADMIN"

    if (!canTransition) {
        throw new AppError(403, "FORBIDDEN", "Only the task assignee or a manager can change the task status")
    }

    const allowed=STATUS_TRANSITIONS[task.status]

    if (!allowed.includes(newStatus)) {
        const hint=allowed.length? allowed.join(', '):"none (terminal state)"
        throw new AppError(
            422,
            "INVALID_TRANSITION",
            `Cannot transition from ${task.status} → ${newStatus}. Allowed: ${hint}`
        )
    }

    return await prisma.task.update({
        where: {
            id
        },
        data: {
            status: newStatus
        },
        select: TASK_SELECT
    })
}
import {z} from "zod"

export const createTaskSchema=z.object({
    title: z.string().min(1, "Title is required").max(255, "Title must not exceed 255 characters"),
    description: z.string().optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
    assigneeId: z.string().cuid("Invalid assignee ID").optional(),
    dueDate: z.coerce.date({invalid_type_error: "Invalid date format"}).refine(
        date => date>new Date(),
        {
            message:
                "due_date must be a future date"
        }
    ).optional()
})

export const updateTaskSchema=z.object({
    title: z.string().min(1, "Title is required").max(255, "Title must not exceed 255 characters").optional(),
    description: z.string().optional().nullable(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
    assigneeId: z.string().cuid("Invalid assignee ID").optional().nullable(),
    dueDate: z.coerce.date({invalid_type_error: "Invalid date format"}).refine(
        date => date>new Date(),
        {
            message:
                "due_date must be a future date"
        }
    ).optional().nullable()
}).refine(
    (data) => Object.keys(data).length>0,
    {message: "At least one field must be provided for update"}
)

export const transitionStatusSchema=z.object({
    status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE", "BLOCKED"], {
        required_error: "status is required",
        invalid_type_error: "status must be one of: TODO, IN_PROGRESS, IN_REVIEW, DONE, BLOCKED"
    })
})
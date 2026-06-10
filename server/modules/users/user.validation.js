import {z} from "zod"

export const createUserSchema=z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(72, "Password must not exceed 72 characters"),
    role: z.enum(["ADMIN", "MANAGER", "MEMBER"])
})

export const updateUserSchema=z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    email: z.email("Invalid email address").optional(),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(72, "Password must not exceed 72 characters")
        .optional(),
    role: z.enum(["ADMIN", "MANAGER", "MEMBER"]).optional()
}).refine(
    (data) => Object.keys(data).length>0,
    {message: "At least one field must be provided for update"}
)
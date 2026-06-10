import {Router} from "express";
import authRoutes from "../modules/auth/auth.routes.js"
import userRoutes from "../modules/users/user.routes.js"
import taskRoutes from "../modules/tasks/task.routes.js"

const router=Router()

// GET /api/healthcheck
router.get("/healthcheck", (req, res) => {
    return res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    })
})

// POST /api/auth/register
// POST /api/auth/login
router.use("/auth", authRoutes)
router.use("/users", userRoutes)
router.use("/tasks", taskRoutes)

export default router
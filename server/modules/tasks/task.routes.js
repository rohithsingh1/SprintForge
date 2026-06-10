import {Router} from "express";
import {authenticate} from "../../middlewares/auth.middleware.js";
import {getTask, getTasks, createTask, updateTask, deleteTask, updateTaskStatus} from "./task.controller.js";

const router=Router()

router.use(authenticate)

router.get("/", getTasks)
router.get("/:id", getTask)
router.post("/", createTask)
router.put("/:id", updateTask)
router.delete("/:id", deleteTask)
router.patch("/:id/status", updateTaskStatus)

export default router
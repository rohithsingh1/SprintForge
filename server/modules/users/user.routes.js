import {Router} from "express";
import {authenticate} from "../../middlewares/auth.middleware.js";
import {authorize} from "../../middlewares/role.middleware.js";
import {getUsers, getUser, createUser, updateUser, deleteUser} from "./user.controller.js";

const router=Router()

router.use(authenticate, authorize("ADMIN"))

router.get("/", getUsers)
router.get("/:id", getUser)
router.post("/", createUser)
router.put("/:id", updateUser)
router.delete("/:id", deleteUser)

export default router
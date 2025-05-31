import express from "express"
import { createTask, syncTasks } from "../controllers/taskController.js"

const router = express.Router()

router.get("/tasks", syncTasks)
router.post("/tasks", createTask)

export default router

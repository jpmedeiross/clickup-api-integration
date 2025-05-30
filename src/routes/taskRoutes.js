import { Router } from "express"
import { syncTasks } from "../controllers/taskController.js"

const router = Router()

router.get("/tasks", syncTasks)

export default router

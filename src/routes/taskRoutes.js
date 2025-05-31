import express from "express"
import { syncTasks } from "../controllers/taskController.js"

const router = express.Router()

router.get("/tasks", syncTasks)

export default router

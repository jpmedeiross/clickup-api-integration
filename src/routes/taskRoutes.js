import express from "express"
import {
  createTask,
  deleteTask,
  syncTasks
} from "../controllers/taskController.js"

const router = express.Router()

router.get("/tasks", syncTasks)
router.post("/tasks", createTask)
router.delete("/tasks/:id", deleteTask)

export default router

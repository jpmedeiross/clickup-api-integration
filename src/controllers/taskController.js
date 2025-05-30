import prisma from "../database/prismaClient.js"
import { fetchTasksFromClickUp } from "../services/clickupService.js"

export async function syncTasks(req, res) {
  try {
    const clickupTasks = await fetchTasksFromClickUp()

    const upsertedTasks = await Promise.all(
      clickupTasks.map(async (task) => {
        return prisma.task.upsert({
          where: { clickupId: task.id },
          update: {
            title: task.name,
            description: task.description || null,
            status: task.status?.status || null,
            startDate: task.start_date
              ? new Date(Number(task.start_date))
              : null,
            dueDate: task.due_date ? new Date(Number(task.due_date)) : null
          },
          create: {
            clickupId: task.id,
            title: task.name,
            description: task.description || null,
            status: task.status?.status || null,
            startDate: task.start_date
              ? new Date(Number(task.start_date))
              : null,
            dueDate: task.due_date ? new Date(Number(task.due_date)) : null
          }
        })
      })
    )

    res.json(upsertedTasks)
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: "Erro ao sincronizar tarefas com o ClickUp" })
  }
}

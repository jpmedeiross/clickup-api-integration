import prisma from "../database/prismaClient.js"
import {
  createTaskInClickup,
  fetchTasksFromClickup
} from "../services/clickupService.js"

export async function syncTasks(req, res) {
  try {
    const clickupTasks = await fetchTasksFromClickup()

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

export async function createTask(req, res) {
  const { title, description, status, startDate, dueDate } = req.body

  if (!title) {
    return res.status(400).json({ error: "O título é obrigatório." })
  }

  try {
    const clickupTask = await createTaskInClickup({
      title,
      description,
      status,
      startDate,
      dueDate
    })

    const task = await prisma.task.create({
      data: {
        clickupId: clickupTask.id,
        title: clickupTask.name,
        description: clickupTask.description || null,
        status: clickupTask.status?.status || "to do",
        startDate: clickupTask.start_date
          ? new Date(Number(clickupTask.start_date))
          : null,
        dueDate: clickupTask.due_date
          ? new Date(Number(clickupTask.due_date))
          : null
      }
    })

    res.status(201).json(task)
  } catch (error) {
    console.error(
      "Erro ao criar tarefa:",
      error.response?.data || error.message
    )
    res.status(500).json({ error: "Erro ao criar tarefa no ClickUp" })
  }
}

export async function deleteTask(req, res) {
  const { id } = req.params

  try {
    const existingTask = await prisma.task.findUnique({
      where: { id }
    })

    if (!existingTask) {
      return res
        .status(404)
        .json({ message: "Tarefa não encontrada ou já foi excluída" })
    }

    const task = await prisma.task.delete({
      where: { id }
    })

    res.json({ message: "Tarefa excluída com sucesso", task })
  } catch (error) {
    console.error("Erro ao excluir tarefa:", error.message)
    res.status(500).json({ error: "Erro ao excluir tarefa" })
  }
}

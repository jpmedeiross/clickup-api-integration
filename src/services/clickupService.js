import axios from "axios"

const clickupApi = axios.create({
  baseURL: "https://api.clickup.com/api/v2/",
  headers: {
    Authorization: process.env.CLICKUP_API_TOKEN
  }
})

export async function fetchTasksFromClickup() {
  try {
    const listId = process.env.CLICKUP_LIST_ID

    const response = await clickupApi.get(`list/${listId}/task`)
    return response.data.tasks
  } catch (error) {
    console.error(
      "Erro ao buscar tarefas no Clickup:",
      error.response?.data || error.message
    )
    throw new Error("Erro ao buscar tarefas no Clickup")
  }
}

export async function createTaskInClickup({
  title,
  description,
  status,
  startDate,
  dueDate
}) {
  const listId = process.env.CLICKUP_LIST_ID

  const data = {
    name: title,
    description,
    status,
    start_date: startDate ? new Date(startDate).getTime() : undefined,
    due_date: dueDate ? new Date(dueDate).getTime() : undefined
  }

  Object.keys(data).forEach(
    (key) => data[key] === undefined && delete data[key]
  )

  const response = await clickupApi.post(`list/${listId}/task`, data)
  return response.data
}

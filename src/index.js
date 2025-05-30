import dotenv from "dotenv"
import express from "express"

dotenv.config()

const app = express()
app.use(express.json())

app.get("/", (req, res) => {
  res.send("API de integração com Clickup no ar")
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})

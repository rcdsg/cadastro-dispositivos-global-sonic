import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import mysql from 'mysql2/promise'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*'
  }
})

// Conexão MySQL
const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
})

// Criação da tabela se não existir
await db.execute(`
CREATE TABLE IF NOT EXISTS devices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  mac VARCHAR(32) NOT NULL UNIQUE,
  status ENUM('ATIVO','INATIVO') NOT NULL DEFAULT 'ATIVO',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
)
`)

// Rotas
app.post('/api/devices', async (req, res) => {
  try {
    const { name, mac } = req.body
    if (!name || !mac) return res.status(400).json({ error: 'Nome e MAC obrigatórios' })

    const [result] = await db.execute(
      'INSERT INTO devices (name, mac) VALUES (?, ?)',
      [name, mac]
    )

    const [rows] = await db.execute('SELECT * FROM devices WHERE id = ?', [result.insertId])
    const device = rows[0]

    io.emit('device:created', device)
    res.status(201).json(device)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro interno ao criar dispositivo' })
  }
})

app.get('/api/devices', async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM devices ORDER BY id DESC')
  res.json(rows)
})

app.patch('/api/devices/:id/status', async (req, res) => {
  try {
    const { id } = req.params
    const [rows] = await db.execute('SELECT * FROM devices WHERE id = ?', [id])
    if (rows.length === 0) return res.status(404).json({ error: 'Dispositivo não encontrado' })

    const device = rows[0]
    const newStatus = device.status === 'ATIVO' ? 'INATIVO' : 'ATIVO'

    await db.execute('UPDATE devices SET status = ? WHERE id = ?', [newStatus, id])
    io.emit('device:status', { id: Number(id), status: newStatus })
    res.json({ id: Number(id), status: newStatus })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro interno ao atualizar status' })
  }
})

server.listen(3000, () => console.log('🚀 Servidor rodando em http://localhost:3000'))

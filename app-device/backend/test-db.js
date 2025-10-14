import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
dotenv.config()

const connect = async () => {
  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    })
    console.log('✅ Conectado ao MySQL com sucesso!')
    const [rows] = await db.query('SELECT NOW() AS agora')
    console.log(rows)
    await db.end()
  } catch (err) {
    console.error('❌ Erro de conexão MySQL:', err.message)
  }
}

connect()

import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATA
}

export const query = async (sql, params = []) => {
  const connection = await mysql.createConnection(config)
  try {
    const [rows] = await connection.execute(sql, params)
    return rows
  } finally {
    await connection.end()
  }
}

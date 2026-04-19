import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATA
}

export const query = async (sql, params) => {
  const connection = await mysql.createConnection(config)
  const [rows] = await connection.execute(sql, params)
  await connection.end()
  return rows
}

// ✅ CREATE USER (แก้แล้ว)
export const createUser = async ({ username, password, email, roleId }) => {

  // 🔥 กันข้อมูลว่าง
  if (!username || !password || !email) {
    throw new Error("กรุณากรอกข้อมูลให้ครบ")
  }

  if (email.trim() === "") {
    throw new Error("Email ห้ามว่าง")
  }

  // 🔥 hash password
  const hashPassword = await bcrypt.hash(password, 10)

  const sql = `
    INSERT INTO users (username, password, email, role_id, status)
    VALUES (?, ?, ?, ?, ?)
  `

  const params = [username, hashPassword, email, roleId, 'active']

  return await query(sql, params)
}

// ✅ เช็ค username
export const getUserByUsername = async (username) => {
  const sql = 'SELECT * FROM users WHERE username = ?'
  const result = await query(sql, [username])
  return result[0]
}

// ✅ 🔥 เพิ่มอันนี้ (สำคัญมาก)
export const getUserByEmail = async (email) => {
  const sql = 'SELECT * FROM users WHERE email = ?'
  const result = await query(sql, [email])
  return result[0]
}

// ✅ ROLE
export const getRolenamebyUserId = async (id) => {
  const sql = `
    SELECT 
      u.id, 
      u.username, 
      r.name AS role
    FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE u.id = ?
  `
  return await query(sql, [id])
}
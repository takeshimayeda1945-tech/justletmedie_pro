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

const query = async (sql, params) =>{
    const connection = await mysql.createConnection(config)
    const [rows] = await connection.execute(sql, params)
    await connection.end()
    return rows
}

export const createUser = async ({username, password, email, roleId, phone = ''}) => {
    const hashPassword = await bcrypt.hash(password, 10)

    const sql = 'INSERT INTO users (username, password, email, role_id, status, phone) VALUES (?, ?, ?, ?, ?, ?)'
    const params = [username, hashPassword, email, roleId, 'active', phone]

    const rows = await query(sql, params)
    return rows
}

export const getUserByUsername = async (username) => {
    const sql = 'SELECT * FROM users WHERE username = ?'
    const params = [username]
    const result = await query(sql, params)
    return result[0]
}

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
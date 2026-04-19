import mysql from 'mysql2/promise'

const db = mysql.createPool({
  host: 'localhost',
  user: 'admin',
  password: '1234',
  database: 'jwt' // << ชื่อ DB ที่คุณสร้าง
})

export default db
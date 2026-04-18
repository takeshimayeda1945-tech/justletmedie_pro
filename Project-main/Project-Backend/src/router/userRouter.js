import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

import {
  createUser,
  getRolenamebyUserId,
  getUserByUsername
} from '../controllers/usersControllers.js'

const userRouter = Router()

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: API สำหรับการจัดการผู้ใช้งานและการยืนยันตัวตน
 */

userRouter.post('/register', async (req, res) => {
  // 1. แยก password ออก เพื่อความปลอดภัยเวลา Log
  const { password, ...safeBody } = req.body; 
  
  // 2. ตอนนี้ Log จะแสดงข้อมูลที่ปลอดภัย ซึ่งจะรวม email เข้าไปด้วยแล้ว
  console.log("REGISTER BODY:", safeBody); 

  // 3. รับค่า username และ email จาก req.body
  const { username, email } = req.body;
  const roleId = 3;

  try {
    // 4. ส่ง email เข้าไปบันทึกลง Database ด้วย
    await createUser({ username, password, email, roleId }); 
    return res.status(200).json({ message: 'Success' });
  } catch (error) {
    console.error("REGISTER ERROR:", error); 
    return res.status(500).json({ message: error.message });
  }
})

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: เข้าสู่ระบบ
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_doe
 *               password:
 *                 type: string
 *                 example: secretpassword
 *     responses:
 *       200:
 *         description: เข้าสู่ระบบสำเร็จพร้อมรับ JWT Token
 *       403:
 *         description: รหัสผ่านไม่ถูกต้อง
 *       404:
 *         description: ไม่พบผู้ใช้งาน
 */
userRouter.post('/login', async (req, res) => {
  console.log("LOGIN BODY:", req.body); // 👈 เพิ่มตรงนี้
  const { username, password } = req.body

  const user = await getUserByUsername(username)

  if (!user)
    return res.status(404).json({ message: 'not found' })
  if (user.status === "suspended") {
    return res.status(403).json({ message: "บัญชีของคุณถูกระงับ" })
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch)
    return res.status(403).json({ message: 'Unauthorized' })

  const token = jwt.sign(
    { id: user.id },
    JWT_SECRET,
    { expiresIn: '1h' }
  )

  res.status(200).json({ message: 'Success', token })
})

/* ================= Middleware ================= */
const jwtTokenMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    req.jwtExpired = true
    req.userId = null
    return next()
  }

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      req.jwtExpired = true
      req.userId = null
    } else {
      req.jwtExpired = false
      req.userId = payload.id
    }
    next()
  })
}

/**
 * @swagger
 * /auth/verify:
 *   get:
 *     summary: ตรวจสอบ JWT Token และดึงข้อมูล Role
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ยืนยัน Token สำเร็จ
 *       403:
 *         description: Token หมดอายุหรือไม่ถูกต้อง
 */
userRouter.get('/verify', jwtTokenMiddleware, async (req, res) => {
  if (req.jwtExpired)
    return res.status(403).json({ message: 'Unauthorized' })

  const result = await getRolenamebyUserId(req.userId)

  res.status(200).json({
    message: 'Success',
    role: result[0].role
  })
})

export default userRouter
import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'


dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

import {
  createUser,
  getRolenamebyUserId,
  getUserByUsername,
  getUserByEmail,
  query
} from '../controllers/usersControllers.js'

const userRouter = Router()

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: API สำหรับการจัดการผู้ใช้งานและการยืนยันตัวตน
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: สมัครสมาชิกใหม่
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
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_doe
 *               password:
 *                 type: string
 *                 example: secretpassword
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               roleId:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: สมัครสมาชิกสำเร็จ
 *       500:
 *         description: เกิดข้อผิดพลาดที่เซิร์ฟเวอร์
 */
userRouter.post('/register', async (req, res) => {
  const { password, ...safeBody } = req.body;
  console.log("REGISTER BODY:", safeBody);

  const { username, email, password: rawPassword } = req.body;
  const roleId = 3;

  try {
    // ✅ 1. ตรวจข้อมูล
    if (!username || !email || !rawPassword) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบ" });
    }

    if (email.trim() === "") {
      return res.status(400).json({ message: "Email ห้ามว่าง" });
    }

    if (!email.includes("@")) {
      return res.status(400).json({ message: "รูปแบบ Email ไม่ถูกต้อง" });
    }

    // ✅ 2. เช็ค username ซ้ำ
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "Username นี้มีอยู่แล้ว" });
    }

    // ✅ 3. (สำคัญ) เช็ค email ซ้ำ
    // ต้องมี function query หรือสร้าง function ใหม่ก็ได้
    const existingEmail = await getUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ message: "Email นี้มีอยู่แล้ว" });
    }

    // ✅ 4. บันทึก
    await createUser({
      username,
      password: rawPassword,
      email,
      roleId
    });

    return res.status(200).json({ message: "Success" });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
});

// ================= REGISTER SELLER =================
import multer from 'multer'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
  cb(null, 'documents/')
},
  filename: (req, file, cb) => {
  const username = req.body.username // หรือ userId ก็ได้
  cb(null, `${username}-${Date.now()}-${file.originalname}`)
}
})

const upload = multer({ storage })

userRouter.post('/register-seller', upload.single('file'), async (req, res) => {
  try {
    const {
      namesurname,
      username,
      password,
      address,
      email,
      phone
    } = req.body

    const file = req.file

    if (!file) {
      return res.status(400).json({ message: "กรุณาอัปโหลดไฟล์" })
    }

    // เช็ค username ซ้ำ
    const existingUser = await getUserByUsername(username)
    if (existingUser) {
      return res.status(400).json({ message: "Username ซ้ำ" })
    }

    // เช็ค email ซ้ำ
    const existingEmail = await getUserByEmail(email)
    if (existingEmail) {
      return res.status(400).json({ message: "Email ซ้ำ" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const sql = `
      INSERT INTO verifyseller 
      (username, password, role_id, address, document, namesurname, email, phone)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `

    await query(sql, [
      username,
      hashedPassword,
      2,
      address,
      file.filename,
      namesurname,
      email,
      phone
    ])

    res.status(200).json({ message: "สมัครสำเร็จ รออนุมัติ" })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
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
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import cors from 'cors'
import userRouter from './router/userRouter.js'   // ไฟล์ login/register
import adminRouter from './router/adminRouter.js' // ไฟล์admin
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './config/swagger.js'
import router from './router/Mainrouter.js'
import { ensurePropertySchema } from './controllers/propertyControllers.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadDir = path.join(__dirname, '../uploads')

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const app = express()

app.use(cors()) 
app.use(express.json())
app.use('/uploads', express.static(uploadDir))

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Routes

ensurePropertySchema().catch((error) => {
  console.warn('Property schema initialization failed:', error.message)
})

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาด',
        error: err.message
    })
})


app.use('/auth', userRouter)   // เรียกใช้: /auth/login, /auth/register
app.use('/admin', adminRouter) // เรียกใช้: /admin
app.use('/', router)
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
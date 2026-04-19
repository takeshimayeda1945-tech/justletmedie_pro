import express from 'express'
import cors from 'cors'
import userRouter from './router/userRouter.js'   // ไฟล์ login/register
import adminRouter from './router/adminRouter.js' // ไฟล์admin
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './config/swagger.js'
import articleRouter from './router/articleRouter.js'
import router from './router/Mainrouter.js'

const app = express()

app.use(cors()) 
app.use(express.json())

app.use('/documents', express.static('documents'));

import path from 'path' // 👈 เพิ่มบนสุดของไฟล์ด้วย

app.get('/download/:filename', (req, res) => {
  const file = req.params.filename

  const filePath = path.join(
    process.cwd(), // 👈 ใช้ path ปัจจุบัน (ปลอดภัยกว่า)
    'documents',
    file
  )

  res.download(filePath, (err) => {
    if (err) {
      console.error("DOWNLOAD ERROR:", err)
      res.status(404).json({ message: "File not found" })
    }
  })
})


// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Routes


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
app.use('/articles', articleRouter)
app.use('/', router)
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
import fs from 'fs'
import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import { getAllProperties, getPropertyById, createProperty } from '../controllers/propertyControllers.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadFolder = path.join(__dirname, '../../uploads')

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true })
}

const upload = multer({ dest: uploadFolder })

const router = express.Router()

/**
 * @swagger
 * /test:
 *   get:
 *     summary: ทดสอบ API
 *     tags:
 *       - Test
 *     responses:
 *       200:
 *         description: ทดสอบ API สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 */
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'API test สำเร็จ',
        data: {
            status: 'running',
            timestamp: new Date()
        }
    })
})

/**
 * @swagger
 * /api/properties:
 *   get:
 *     summary: ดึงข้อมูลอสังหาทั้งหมด
 *     tags:
 *       - Properties
 *     responses:
 *       200:
 *         description: ข้อมูลอสังหาทั้งหมด
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Property'
 */
router.get('/api/properties', async (req, res) => {
    try {
        const host = `${req.protocol}://${req.get('host')}`
        const result = await getAllProperties(host)
        res.json({
            success: true,
            message: 'ข้อมูลอสังหาทั้งหมด',
            data: result
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: 'ไม่สามารถดึงข้อมูลอสังหาได้' })
    }
})

/**
 * @swagger
 * /api/properties/{id}:
 *   get:
 *     summary: ดึงข้อมูลอสังหาตามรหัส
 *     tags:
 *       - Properties
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Property ID
 *     responses:
 *       200:
 *         description: ข้อมูลอสังหาตามรหัส
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Property'
 */
router.get('/api/properties/:id', async (req, res) => {
    try {
        const { id } = req.params
        const host = `${req.protocol}://${req.get('host')}`
        const found = await getPropertyById(id, host)
        if (!found) {
            return res.status(404).json({
                success: false,
                message: `ไม่พบอสังหา id ${id}`
            })
        }
        res.json({
            success: true,
            message: `ข้อมูลอสังหาหมายเลข ${id}`,
            data: found
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: 'ไม่สามารถดึงข้อมูลอสังหาได้' })
    }
})

/**
 * @swagger
 * /api/properties:
 *   post:
 *     summary: เพิ่มอสังหาใหม่
 *     tags:
 *       - Properties
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - type
 *               - saleType
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               priceSale:
 *                 type: string
 *               priceRent:
 *                 type: string
 *               type:
 *                 type: string
 *               saleType:
 *                 type: string
 *               landSize:
 *                 type: string
 *               floor:
 *                 type: string
 *               bedrooms:
 *                 type: string
 *               bathrooms:
 *                 type: string
 *               description:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               nearbyPlaces:
 *                 type: string
 *                 description: JSON stringified array of nearby place objects
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: สร้างอสังหาสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Property'
 *       400:
 *         description: ข้อมูลไม่ครบหรือไม่ถูกต้อง
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.post('/api/properties', upload.array('images', 10), async (req, res) => {
    try {
        const {
            name,
            address,
            priceSale,
            priceRent,
            type,
            saleType,
            landSize,
            floor,
            bedrooms,
            bathrooms,
            description,
            latitude,
            longitude,
            nearbyPlaces
        } = req.body

        const priceValue = priceSale || priceRent || ''

        if (!name || !address || !type) {
            return res.status(400).json({
                success: false,
                message: 'กรุณากรอก name, address, type'
            })
        }

        if (!saleType || (!priceSale && !priceRent)) {
            return res.status(400).json({
                success: false,
                message: 'กรุณาเลือก saleType และกรอกราคา'
            })
        }

        const storedImages = (req.files || []).map((file) => `uploads/${file.filename}`)
        if (storedImages.length === 0 && !req.body.image) {
            return res.status(400).json({
                success: false,
                message: 'กรุณาอัพโหลดรูปภาพอย่างน้อย 1 รูป'
            })
        }

        const images = storedImages.length ? storedImages : [req.body.image]
        const host = `${req.protocol}://${req.get('host')}`
        const created = await createProperty({
            name,
            address,
            images,
            price: priceValue,
            propertyType: type,
            saleType,
            landSize,
            floor,
            bedrooms,
            bathrooms,
            description,
            latitude: latitude ? Number(latitude) : null,
            longitude: longitude ? Number(longitude) : null,
            nearbyPlaces
        }, host)

        res.status(201).json({
            success: true,
            message: 'สร้างอสังหาสำเร็จ',
            data: created
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: 'ไม่สามารถสร้างอสังหาได้'
        })
    }
})

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health Check
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 */
router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Server is running'
    })
})

export default router

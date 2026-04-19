import express from 'express'
import { properties } from '../data/propertiesData.js'

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
router.get('/api/properties', (req, res) => {
    res.json({
        success: true,
        message: 'ข้อมูลอสังหาทั้งหมด',
        data: properties
    })
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
router.get('/api/properties/:id', (req, res) => {
    const { id } = req.params
    const found = properties.find((item) => String(item.id) === String(id))
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
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - price
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               image:
 *                 type: string
 *               rooms:
 *                 type: integer
 *               date:
 *                 type: string
 *               price:
 *                 type: string
 *               type:
 *                 type: string
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
router.post('/api/properties', (req, res) => {
    const { name, address, image, rooms, date, price, type } = req.body

    if (!name || !address || (price === undefined || price === null) || !type) {
        return res.status(400).json({
            success: false,
            message: 'กรุณากรอก name, address, price, type'
        })
    }

    let normalizedRooms = rooms
    if (rooms !== undefined && rooms !== null && rooms !== '') {
        if (typeof normalizedRooms === 'string') {
            normalizedRooms = Number(normalizedRooms)
        }
        if (typeof normalizedRooms !== 'number' || Number.isNaN(normalizedRooms)) {
            return res.status(400).json({
                success: false,
                message: 'rooms ต้องเป็นตัวเลข'
            })
        }
    }

    let normalizedPrice = price
    if (typeof normalizedPrice === 'string') {
        normalizedPrice = Number(normalizedPrice.replace(/,/g, '').replace(/\s*บาท\s*/i, ''))
    }
    if (typeof normalizedPrice !== 'number' || Number.isNaN(normalizedPrice)) {
        return res.status(400).json({
            success: false,
            message: 'price ต้องเป็นตัวเลข'
        })
    }

    let normalizedDate = date
    if (!normalizedDate) {
        normalizedDate = new Date().toISOString()
    } else {
        const d = new Date(normalizedDate)
        if (Number.isNaN(d.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'date ต้องเป็นรูปแบบวันที่ที่ถูกต้อง เช่น 2026-03-26'
            })
        }
        normalizedDate = d.toISOString()
    }

    const nextId = properties.length ? Math.max(...properties.map((p) => p.id)) + 1 : 1
    const newProperty = {
        id: nextId,
        name,
        address,
        image: image || '',
        rooms: normalizedRooms || null,
        date: normalizedDate,
        price: normalizedPrice,
        type
    }

    properties.push(newProperty)

    res.status(201).json({
        success: true,
        message: 'สร้างอสังหาสำเร็จ',
        data: newProperty
    })
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

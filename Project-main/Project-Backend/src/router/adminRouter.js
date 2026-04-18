import express from 'express'
import { getAllUsers, deleteUser, getUserStats, unsuspendUser } from '../controllers/adminControllers.js';

const router = express.Router()

/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: API สำหรับจัดการระบบหลังบ้านและข้อมูลผู้ใช้งาน
 */

/**
 * @swagger
 * /admin/:
 *   get:
 *     summary: ดึงรายชื่อ User ทั้งหมด
 *     description: ดึงข้อมูลรายชื่อ User ทั้งหมดเพื่อนำไปแสดงในตาราง (เช่น Sellerlist)
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: คืนค่ารายชื่อ User ทั้งหมดสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 */
router.get('/', getAllUsers)

/**
 * @swagger
 * /admin/{id}:
 *   delete:
 *     summary: ลบหรือระงับบัญชี User ตาม ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ไอดี (ID) ของ User ที่ต้องการลบหรือระงับ
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: ลบหรือระงับบัญชีสำเร็จ
 *       404:
 *         description: ไม่พบ User ที่ระบุ
 */
router.delete('/:id', deleteUser)

// เพิ่ม Path สำหรับยกเลิกการระงับ (ใช้ PATCH หรือ PUT ก็ได้)
router.patch('/unsuspend/:id', unsuspendUser);

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: ดึงสถิติจำนวนคน
 *     description: ดึงข้อมูลสถิติภาพรวมของผู้ใช้งานในระบบ
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: คืนค่าข้อมูลสถิติสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                 activeUsers:
 *                   type: integer
 */
router.get('/stats', getUserStats)

export default router
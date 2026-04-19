import express from 'express'
// 🌟 รวม Import ไว้ที่บรรทัดนี้ทั้งหมดเลย
import { 
    getAllUsers, 
    deleteUser, 
    unsuspendUser, 
    getAllVerifySeller, 
    approveSeller,
    rejectSeller,
    updateLastActive, 
    getUserCount 
} from '../controllers/adminControllers.js';

const router = express.Router()

/**
 * @swagger
 * tags:
 * - name: Admin
 * description: API สำหรับจัดการระบบหลังบ้านและข้อมูลผู้ใช้งาน
 */

/**
 * @swagger
 * /admin/:
 * get: ... (ย่อคอมเมนต์ไว้นะครับ)
 */
router.get('/', getAllUsers)

router.get('/verify-seller', getAllVerifySeller)

/**
 * @swagger
 * /admin/{id}:
 * delete: ...
 */
router.delete('/:id', deleteUser)

// เพิ่ม Path สำหรับยกเลิกการระงับ
router.patch('/unsuspend/:id', unsuspendUser);

/**
 * @swagger
 * /admin/stats:
 * get: ...
 */
// 🌟 ลบอันเก่าออก แล้วใช้อันนี้อันเดียว (ใช้ getUserCount)
router.get('/stats', getUserCount) 

router.post('/approve-seller', approveSeller);

router.delete('/reject-seller/:id', rejectSeller);

// 🌟 เพิ่ม Route สำหรับรับ Heartbeat ไว้ตรงนี้
router.post('/heartbeat', updateLastActive);

export default router
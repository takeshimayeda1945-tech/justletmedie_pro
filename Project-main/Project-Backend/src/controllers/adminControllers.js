import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATA,
    waitForConnections: true,
    connectionLimit: 10
};

// สร้าง pool ไว้ที่นี่เพื่อให้ฟังก์ชันข้างล่างเรียกใช้ได้
const pool = mysql.createPool(config);

export const getAllUsers = async (req, res) => {
    try {
        // ใช้ JOIN เพื่อดึงชื่อ Role ออกมา
        const sql = `
            SELECT 
                u.id, 
                u.username AS name, 
                r.name AS role,
                u.status
            FROM users u
            JOIN roles r ON u.role_id = r.id
        `;
        const [rows] = await pool.query(sql);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ message: "ไม่สามารถดึงข้อมูลจาก Database ได้" });
    }
};

// ฟังก์ชันลบ User (เปลี่ยนเป็นการอัปเดต Status)
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        // อัปเดตตาราง users ให้ column status มีค่าเป็น 'suspended'
        await pool.query("UPDATE users SET status = 'suspended' WHERE id = ?", [id]);
        res.status(200).json({ message: `ระงับบัญชี User ID: ${id} สำเร็จ` });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
    }
};

// ฟังก์ชันยกเลิกการระงับบัญชี
export const unsuspendUser = async (req, res) => {
    const { id } = req.params;
    try {
        // อัปเดตสถานะกลับเป็น 'active'
        await pool.query("UPDATE users SET status = 'active' WHERE id = ?", [id]);
        res.status(200).json({ message: `ยกเลิกการระงับบัญชี ID: ${id} สำเร็จ` });
    } catch (error) {
        console.error("Unsuspend Error:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดของระบบ" });
    }
};

// ฟังก์ชัน stat ดูจำนวนคน
export const getUserStats = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT count(*) as total FROM users');
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
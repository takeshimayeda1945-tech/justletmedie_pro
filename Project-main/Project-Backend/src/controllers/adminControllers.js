import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs'; 
import path from 'path'; 

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
        // ใช้ LEFT JOIN เพื่อดึงข้อมูลเอกสารและที่อยู่จาก sellerprofile (ถ้ามี)
        const sql = `
            SELECT 
                u.id, 
                u.username AS name, 
                u.email,
                r.name AS role,
                u.status,
                sp.address,
                sp.document,
                sp.namesurname
            FROM users u
            JOIN roles r ON u.role_id = r.id
            LEFT JOIN sellerprofile sp ON u.id = sp.id
        `;
        const [rows] = await pool.query(sql);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ message: "ไม่สามารถดึงข้อมูลจาก Database ได้" });
    }
};

export const getVerifySellers = async (req, res) => {
  try {
    const sql = `
      SELECT 
        id,
        username AS name,
        email,
        address,
        phone,
        'Seller' AS role,
        document
      FROM verifyseller
    `;

    const [rows] = await pool.query(sql);

    res.status(200).json(rows);

  } catch (error) {
    console.error("Verify Seller Error:", error);
    res.status(500).json({ message: "ดึงข้อมูล verify seller ไม่สำเร็จ" });
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
// ================== VERIFY SELLER ==================
export const getAllVerifySeller = async (req, res) => {
    try {
        const sql = `
            SELECT 
                id,
                username AS name,
                namesurname AS NS,
                id AS userId,       /* แก้จาก username เป็น id */
                'Seller' AS role,
                address,
                phone,
                email,
                document
            FROM verifyseller
        `;
        const [rows] = await pool.query(sql);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Verify Seller Error:", error);
        res.status(500).json({ message: "ดึงข้อมูล verify seller ไม่ได้" });
    }
};

// ================== APPROVE SELLER ==================
export const approveSeller = async (req, res) => {
    // 1. รับค่าจาก Frontend
    const { 
        id, 
        username, 
        email, 
        phone, 
        namesurname, 
        address, 
        role_id 
    } = req.body;

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 🌟 2. ดึง password และ document ออกมาจาก verifyseller
        const [verifyRows] = await connection.query('SELECT password, document FROM verifyseller WHERE id = ?', [id]);
        
        if (verifyRows.length === 0) {
            throw new Error("ไม่พบข้อมูลคำขออนุมัตินี้");
        }
        
        // เก็บค่าที่ดึงมาไว้ในตัวแปร
        const hashedPassword = verifyRows[0].password;
        const documentFile = verifyRows[0].document; // ได้ชื่อไฟล์เอกสารมาแล้ว

        // 3. เพิ่มข้อมูลลงในตาราง users
        const insertUserSql = `
            INSERT INTO users (username, password, email, role_id, status)
            VALUES (?, ?, ?, ?, 'active')
        `;
        const [userResult] = await connection.query(insertUserSql, [
            username, hashedPassword, email, role_id
        ]);
        
        const newUserId = userResult.insertId;

        // 🌟 4. เพิ่มข้อมูลลงในตาราง sellerprofile (เปลี่ยนเป็นบันทึก document แทน email)
        const insertProfileSql = `
            INSERT INTO sellerprofile (id, namesurname, address, document)
            VALUES (?, ?, ?, ?)
        `;
        await connection.query(insertProfileSql, [
            newUserId, namesurname, address, documentFile // เอาชื่อไฟล์มาใส่ตรงนี้
        ]);

        // 5. ลบข้อมูลผู้ใช้นี้ออกจากตาราง verifyseller
        const deleteVerifySql = `DELETE FROM verifyseller WHERE id = ?`;
        await connection.query(deleteVerifySql, [id]);

        await connection.commit();
        res.status(200).json({ message: "อนุมัติและสร้างบัญชีผู้ขายสำเร็จ" });

    } catch (error) {
        await connection.rollback();
        console.error("Approve Seller Error:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการอนุมัติผู้ขาย" });
    } finally {
        connection.release();
    }
};

// ================== REJECT SELLER ==================
export const rejectSeller = async (req, res) => {
    const { id } = req.params;

    try {
        // 🌟 1. ดึงชื่อไฟล์เอกสารออกมาก่อนที่จะลบข้อมูล
        const [rows] = await pool.query('SELECT document FROM verifyseller WHERE id = ?', [id]);
        
        if (rows.length > 0) {
            const documentFile = rows[0].document;
            
            // 🌟 2. ถ้ามีชื่อไฟล์ ให้สั่ง Node.js ไปลบไฟล์นั้นทิ้ง
            if (documentFile) {
                // สร้าง path ไปยังไฟล์จริง (สมมติว่าโฟลเดอร์ documents อยู่ระดับเดียวกับ src)
                // ปรับ '../documents' ให้ตรงกับที่อยู่โฟลเดอร์จริงของคุณ
                const filePath = path.resolve('documents', documentFile); 
                
                // เช็คก่อนว่ามีไฟล์นี้อยู่จริงไหม ถ้ามีก็ลบทิ้งเลย
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log(`ลบไฟล์เอกสาร ${documentFile} ออกจาก Server เรียบร้อยแล้ว`);
                }
            }
        }

        // 3. ลบข้อมูลออกจากตาราง verifyseller (เหมือนเดิม)
        const sql = `DELETE FROM verifyseller WHERE id = ?`;
        await pool.query(sql, [id]);

        res.status(200).json({ message: "ปฏิเสธและลบคำขอสำเร็จ" });
    } catch (error) {
        console.error("Reject Error:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดของระบบในการปฏิเสธคำขอ" });
    }
};

// สร้าง Map เก็บข้อมูล { userId: { lastActive: timestamp, role: 'buyer' หรือ 'seller' } }
const activeUsersMap = new Map(); 

// 1. ฟังก์ชันรับ Heartbeat
export const updateLastActive = (req, res) => {
    // รับ role เพิ่มเข้ามาจาก React
    const { userId, role } = req.body; 
    
    if (!userId) {
        return res.status(400).json({ message: "No userId provided" });
    }

    // บันทึกเวลาปัจจุบัน และ Role ลงใน Map
    // (ใช้ toLowerCase() เพื่อให้ตัวพิมพ์เล็ก-ใหญ่ไม่เป็นปัญหาเวลาเช็ค)
    activeUsersMap.set(userId, {
        lastActive: Date.now(),
        role: role ? role.toLowerCase() : 'buyer' // ถ้าไม่มีค่าส่งมา ให้ตีเป็น buyer ไว้ก่อน
    });
    
    res.status(200).json({ message: "Updated active status in memory" });
};

// 2. ปรับฟังก์ชัน getUserStats เพื่อแยกนับ
export const getUserCount = async (req, res) => {
    try {
        const [totalRows] = await pool.query('SELECT count(*) as total FROM users');
        
        const fiveMinutesAgo = Date.now() - (5 * 60 * 1000); 
        
        // เตรียมตัวแปรสำหรับนับแยกประเภท
        let activeTotal = 0;
        let activeBuyers = 0;
        let activeSellers = 0;

        for (const [userId, data] of activeUsersMap.entries()) {
            if (data.lastActive >= fiveMinutesAgo) {
                activeTotal++; // บวกจำนวนรวมก่อน
                
                // เช็คว่า Role คืออะไร แล้วบวกแยก
                if (data.role === 'seller') {
                    activeSellers++;
                } else {
                    // ถ้าเป็น 'buyer' หรือ 'user' ทั่วไป
                    activeBuyers++;
                }
            } else {
                activeUsersMap.delete(userId); 
            }
        }

        res.status(200).json({
            totalUsers: totalRows[0].total,
            activeTotal: activeTotal,
            activeBuyers: activeBuyers,
            activeSellers: activeSellers
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
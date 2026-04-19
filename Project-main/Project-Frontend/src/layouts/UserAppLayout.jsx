import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../componants/navbar";
import Footer from "../componants/Footer";

const UserAppLayout = () => {
    
    // ----- เพิ่มระบบส่งสัญญาณ Heartbeat -----
    useEffect(() => {
        // ดึง userId จากที่ที่คุณเก็บไว้ตอน Login (เช่น localStorage)
        const currentUserId = localStorage.getItem('userId'); 
        const userRole = 'buyer'; // กำหนดให้ Role เป็นผู้ซื้อ

        const sendHeartbeat = async () => {
            if (!currentUserId) return; // ถ้าไม่ได้ล็อกอิน ไม่ต้องส่ง
            try {
                // เปลี่ยน URL พอร์ตให้ตรงกับ Backend ของคุณ
                await fetch('http://localhost:3000/admin/heartbeat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: currentUserId, role: userRole })
                });
            } catch (err) {
                console.error("Heartbeat failed", err);
            }
        };

        sendHeartbeat(); // ส่งครั้งแรกทันที
        const heartbeatInterval = setInterval(sendHeartbeat, 60000); // ส่งซ้ำทุกๆ 1 นาที
        
        return () => clearInterval(heartbeatInterval);
    }, []);
    // ------------------------------------

    return ( 
        <>
            <NavBar/>
            <Outlet/>
            <Footer/>
        </>
     );
}
 
export default UserAppLayout;
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import NavBarSeller from "../componants/navbarSeller";
import SellerFooter from "../componants/SellerFooter";

const SellerAppLayout = () => {
    
    // ----- เพิ่มระบบส่งสัญญาณ Heartbeat -----
    useEffect(() => {
        // ดึง userId จากที่ที่คุณเก็บไว้ตอน Login (เช่น localStorage)
        const currentUserId = localStorage.getItem('userId'); 
        const userRole = 'seller'; // กำหนดให้ Role เป็นผู้ขาย

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
            <NavBarSeller/>
            <Outlet/>
            <SellerFooter/>
        </>
     );
}
 
export default SellerAppLayout;
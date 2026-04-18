import React from 'react';

// 🔹 คอมโพเนนต์ PriceModal สำหรับแสดงหน้าต่างป๊อปอัปเลือกช่วงราคาขั้นต่ำ/ขั้นสูง
const PriceModal = ({ 
  show,                // สถานะเปิด/ปิดโมดัล (true = แสดง)
  onClose,             // ฟังก์ชันปิดโมดัล
  maxPrice,            // ราคาสูงสุดที่ผู้ใช้กรอก
  minPrice,            // ราคาต่ำสุดที่ผู้ใช้กรอก
  onMaxPriceChange,    // ฟังก์ชันอัปเดตราคาสูงสุด
  onMinPriceChange,    // ฟังก์ชันอัปเดตราคาต่ำสุด
  onApply              // ฟังก์ชันกดปุ่ม Apply เพื่อยืนยัน
}) => {

  // ถ้า show = false ให้ซ่อนโมดัลทั้งหมด
  if (!show) return null;

  return (
    // 🔻 พื้นหลัง overlay คลิกแล้วจะปิดโมดัล
    <div className="m-overlay active" onClick={onClose}>
      
      {/* 🔻 ตัวกล่องเนื้อหาโมดัล ป้องกันไม่ให้คลิกทะลุปิด */}
      <div className="m-content" onClick={(e) => e.stopPropagation()}>
        
        {/* 🔻 ส่วนหัวของโมดัล */}
        <div className="m-header">
          ราคา
        </div>

        {/* 🔻 เนื้อหาภายในโมดัล */}
        <div className="m-body">

          {/* 🔻 กล่องกรอกค่าสูงสุด */}
          <div className="price-input-group">
            <label className="price-label">สูงสุด</label>
            <input
              type="number"
              className="price-input"
              placeholder="฿"               // ไอคอนสกุลเงิน
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(e.target.value)} // ส่งค่าที่เปลี่ยนไปยัง parent
            />
          </div>

          {/* 🔻 กล่องกรอกค่าต่ำสุด */}
          <div className="price-input-group">
            <label className="price-label">ต่ำสุด</label>
            <input
              type="number"
              className="price-input"
              placeholder="฿"
              value={minPrice}
              onChange={(e) => onMinPriceChange(e.target.value)} // ส่งค่าที่เปลี่ยนไปยัง parent
            />
          </div>

        </div>

        {/* 🔻 ปุ่มท้ายโมดัล */}
        <div className="m-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="apply-btn" onClick={onApply}>
            Apply
          </button>
        </div>

      </div>
    </div>
  );
};

export default PriceModal;

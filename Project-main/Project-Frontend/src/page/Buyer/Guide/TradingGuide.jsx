import { Link } from "react-router-dom";
import { fetchGuideData } from "../../../data/TradingGuide-Data";
import { useEffect, useState } from "react";




const TradingGuide = () => {
  const [GuideDataRaw, SetGuideDataRaw] = useState([])

  useEffect(() => {
    SetGuideDataRaw(fetchGuideData())
  }, [])

  useEffect(() => {
    console.log(GuideDataRaw)
  }, [GuideDataRaw])




  const buttons = [
    { text: "ซื้อ", color: "#A3D5F9", icon: "🛒", link: "/buyer/tgbuyer" },
    { text: "เช่า", color: "#BEE7C3", icon: "🏠", link: "/buyer/tgrent" },
    { text: "ขาย", color: "#BEE7C3", icon: "💰", link: "/buyer/tgseller" },
    { text: "สินเชื่อบ้าน", color: "#BDB3F2", icon: "💸", link: "/buyer/tgfinancing" },
  ];

  const buttonStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "16px",
    width: "200px",
    height: "200px",
    fontFamily: "sans-serif",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
  };

  const textStyle = {
    marginTop: "6px",
    fontSize: "25px",
    fontWeight: "500",
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '2rem' }}>คู่มืออสังหาฯ</h1>
      <h2
        style={{
          textAlign: 'center',
          marginTop: '2rem',
          maxWidth: '800px',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: '1rem',
          paddingRight: '1rem',
        }}
      >
        แหล่งรวมความรู้ ทิปส์และเทคนิคต่าง ๆ รวมไปถึงเครื่องคำนวณสินเชื่อ
        ที่จะช่วยให้คุณตัดสินใจซื้อ-ขาย-เช่า-ลงทุนธุรกิจอสังหาริมทรัพย์ ได้อย่างมั่นใจยิ่งขึ้น
      </h2>


      <h1 style={{ textAlign: 'left', marginTop: '2rem', marginLeft: '100px', fontWeight: 'bold' }}>
        คู่มือตามหมวดหมู่
      </h1>

      {/* ปุ่ม 4 ปุ่ม */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '3rem' }}>
        {buttons.map((btn, i) => (
          <Link
            to={btn.link || "#"}
            key={i}
            style={{ textDecoration: "none", color: "black" }}
          >
            <div
              style={{ ...buttonStyle, backgroundColor: btn.color }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
            >
              <div style={{ fontSize: "26px" }}>{btn.icon}</div>
              <div style={textStyle}>{btn.text}</div>
            </div>
          </Link>
        ))}
      </div>
      {/* บทความตามเวลา */}
      <hr className="mt-5 mb-5 m" />
      <h1 style={{ textAlign: 'left', marginTop: '2rem', marginLeft: '100px', fontWeight: 'bold' }}>บทความตามเวลา</h1>
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          marginTop: "2rem",
          paddingLeft: "1rem",
          paddingRight: "1rem",
        }}
      >
        {GuideDataRaw.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              gap: "20px",
              marginBottom: "30px",
              borderBottom: "1px solid #ddd",
              paddingBottom: "20px",
            }}
          >
            <img
              src={item.img}
              alt={item.title}
              style={{
                width: "220px",
                height: "130px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />

            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px" }}>
                {item.name}
              </h3>

              <p style={{ color: "#555", lineHeight: 1.5 }}>
                {item.section}
              </p>

              <Link to={"/buyer/tgarticle"} style={{ color: "#0d6efd", textDecoration: "none", fontWeight: "500" }}>
                อ่านต่อ →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

}

export default TradingGuide;

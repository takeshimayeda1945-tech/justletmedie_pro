import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../../componants/img/loginimg/loginregister.jpg";
import logo from "../../componants/img/levalogo.svg";
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

const RegisterasSeller = () => {
  const [show, setShow] = useState(true);

  const navigate = useNavigate();

  // State สำหรับทุกช่อง
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // ตรวจสอบข้อมูลครบ
    if (!fullname || !username || !password || !confirmPassword || !address || !email || !phone || !file) {
      setError("กรุณากรอกข้อมูลให้ครบทุกช่องและแนบเอกสาร");
      return;
    }

    // ตรวจสอบรหัสผ่านตรงกัน
    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    setError("");

    // แสดงข้อความรออนุมัติ
    setSuccessMessage(alert("รอการอนุมัติ ภายใน 3 วัน"));

    // ล้างฟอร์ม
    setFullname("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setAddress("");
    setEmail("");
    setPhone("");
    setFile(null);

    // redirect ไปหน้า Login หลังจาก 2 วินาที (2000 ms)
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <div 
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}
    >
      {/* Logo */}
      <div style={{ position: "absolute", top: "-30px", left: "30px" }}>
        <img
          src={logo}
          alt="company logo"
          style={{ height: "220px", objectFit: "contain" }}
        />
      </div>

      {/* Card */}
      <div
        style={{
          width: "900px",
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(6px)",
          borderRadius: "20px",
          padding: "40px",
          boxShadow: "0px 8px 20px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ textAlign: "left", fontWeight: "bold", marginBottom: "25px" }}>
          สมัครเป็นผู้ขาย
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", gap: "15px" }}>
            {/* Left Column */}
            <div style={{ width: 450, paddingRight: "20px" }}>
              <p style={{ fontWeight: "bold" }}>ชื่อและนามสกุล</p>
              <input
                type="text"
                placeholder="ใส่ชื่อและนามสกุลที่นี้"
                style={inputStyle}
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
              />

              <p style={{ fontWeight: "bold", marginTop: "1rem" }}>ชื่อผู้ใช้งาน</p>
              <input
                type="text"
                placeholder="ใส่ชื่อผู้ใช้งาน"
                style={inputStyle}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                style={{ ...inputStyle, marginTop: "15px" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <input
                type="password"
                placeholder="Confirm Password"
                style={{ ...inputStyle, marginTop: "15px" }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <p style={{ fontWeight: "bold", marginTop: "1rem" }}>ที่อยู่</p>
              <input
                type="text"
                placeholder="กรอกที่อยู่"
                style={inputStyle}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {/* Right Column */}
            <div style={{ width: 450, paddingLeft: "20px" }}>
              <p style={{ fontWeight: "bold" }}>ช่องทางการติดต่อ</p>
              <input
                type="email"
                placeholder="อีเมล"
                style={inputStyle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="tel"
                placeholder="เบอร์โทรศัพท์"
                style={{ ...inputStyle, marginTop: "20px" }}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <label style={{ fontWeight: "bold", marginTop: "3.5rem", display: "block" }}>
                เอกสารยืนยันผู้ขาย
              </label>

              <input
                type="file"
                style={{ ...inputStyle, marginTop: "11px" }}
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
          </div>

          {/* แสดงข้อความ error หรือ success */}
          {error && (
            <p style={{ color: "red", marginTop: "10px", fontSize: "14px" }}>
              {error}
            </p>
          )}
          {successMessage && (
            <p style={{ color: "green", marginTop: "10px", fontSize: "14px" }}>
              {successMessage}
            </p>
          )}

          {/* Submit button */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="submit"
              style={{
                width: "25%",
                padding: "13px",
                backgroundColor: "#031338",
                border: "none",
                borderRadius: "10px",
                color: "white",
                fontSize: "18px",
                fontWeight: "bold",
                marginTop: "25px",
                cursor: "pointer",
              }}
            >
              ลงทะเบียน
            </button>
          </div>
        </form>
      </div>
      
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "15px 20px",
  borderRadius: "12px",
  border: "2px solid rgba(0,0,0,0.25)",
  fontSize: "17px",
  outline: "none",
  backgroundColor: "rgba(255,255,255,0.9)",
};

export default RegisterasSeller;

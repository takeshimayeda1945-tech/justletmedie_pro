import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../../componants/img/loginimg/loginregister.jpg";
import logo from "../../componants/img/levalogo.svg";

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          email: email,       
          password: password,
          roleId: 3 
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage("สมัครสำเร็จ!");
        setError("");

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setError(data.message);
      }

    } catch (err) {
      setError("เชื่อม server ไม่ได้");
    }
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

      {/* Register Card */}
      <div
        style={{
          width: "420px",
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(6px)",
          borderRadius: "20px",
          padding: "40px",
          boxShadow: "0px 8px 20px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ textAlign: "left", fontWeight: "bold", marginBottom: "25px" }}>
          ลงทะเบียน
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="User name"
            style={inputStyle}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            style={{ ...inputStyle, marginTop: "15px" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

          <p style={{ textAlign: "center", marginTop: "15px", fontSize: "15px" }}>
            ลงทะเบียนเป็นผู้ขาย{" "}
            <Link to="/registerasseller">
              คลิกที่นี่
            </Link>
          </p>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "13px",
              backgroundColor: "#031338",
              border: "none",
              borderRadius: "10px",
              color: "white",
              fontSize: "18px",
              fontWeight: "bold",
              marginTop: "5px",
              cursor: "pointer",
            }}
          >
            ลงทะเบียน
          </button>
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

export default Register;

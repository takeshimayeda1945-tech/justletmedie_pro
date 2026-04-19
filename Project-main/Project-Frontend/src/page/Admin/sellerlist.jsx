import { useEffect, useState } from "react";
import axios from "axios"; // ใช้ axios แทน fetchUsers
import { Table, InputGroup, Form, Button, Modal, Row, Col } from "react-bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';
import VerifyDoc from '../../assets/verifydocument.pdf'

// เป็น userlist รวมทั้ง buyer และ seller
const Sellerlist = () => {
  const [usersRaw, setUsersRaw] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState(""); //  เก็บข้อความที่พิมพ์
  const [lgShow, setLgShow] = useState(false); //modal
  const [selectedUser, setSelectedUser] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(users.length / itemsPerPage);

  // --- 1. ดึงข้อมูลจาก SQL แทนไฟล์ Local ---
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/admin");
        setUsersRaw(response.data);
        setUsers(response.data);
      } catch (error) {
        console.error("ไม่สามารถดึงข้อมูลจากระบบได้:", error);
      }
    };
    loadUsers();
  }, []);

  // ใช้ useEffect สำหรับ search แบบ realtime
  useEffect(() => {
    const text = searchText.toLowerCase().trim();

    if (text === "") {
      setUsers(usersRaw);
    } else {
      const filtered = usersRaw.filter((user) => {
        return (
          user.name?.toLowerCase().includes(text) ||
          user.userId?.toString().toLowerCase().includes(text) ||
          user.id?.toString().includes(text)
        );
      });
      setUsers(filtered);
      setCurrentPage(1); // ค้นหาแล้วให้กลับมาหน้า 1 เสมอ
    }
  }, [searchText, usersRaw]);

  //  ฟังก์ชันเมื่อกดปุ่มค้นหา
  const handleSearch = () => {
    if (searchText.trim() === "") {
      // ถ้าช่องว่าง แสดงทั้งหมด
      setUsers(usersRaw);
    } else {
      const filtered = usersRaw.filter((user) => {
        // ค้นหาด้วยชื่อ หรือ id (ไม่สนตัวพิมพ์ใหญ่เล็ก)
        const text = searchText.toLowerCase();
        return (
          user.name?.toLowerCase().includes(text) ||
          user.userId?.toString().toLowerCase().includes(text) ||
          user.id?.toString().includes(text)
        );
      });
      setUsers(filtered);
      setCurrentPage(1);
    }
  };

  // --- 2. ฟังก์ชันกดระงับบัญชี (อัปเดต Status ใน SQL และหน้าจอ) ---
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการระงับบัญชีของ ${selectedUser.name}?`)) {
      try {
        await axios.delete(`http://localhost:3000/admin/${selectedUser.id}`);

        // --- เปลี่ยนจากการลบทิ้ง เป็นการอัปเดต State ---
        const updatedUsers = usersRaw.map(user => {
          if (user.id === selectedUser.id) {
            return { ...user, status: 'suspended' }; // เปลี่ยนสถานะคนนี้
          }
          return user; // คนอื่นปล่อยเหมือนเดิม
        });

        setUsersRaw(updatedUsers);
        setUsers(updatedUsers); // อัปเดตตารางที่กำลังแสดงอยู่ด้วย

        setLgShow(false);
        alert("ระงับบัญชีเรียบร้อยแล้ว");
      } catch (error) {
        alert("ไม่สามารถอัปเดตข้อมูลได้เนื่องจากข้อผิดพลาดของระบบ");
      }
    }
  };

  const handleUnsuspendUser = async () => {
    if (!selectedUser) return;

    try {
      // เรียก API PATCH /admin/unsuspend/:id
      await axios.patch(`http://localhost:3000/admin/unsuspend/${selectedUser.id}`);

      // อัปเดต State ในหน้าจอทันที
      const updatedUsers = usersRaw.map(user => {
        if (user.id === selectedUser.id) {
          return { ...user, status: 'Active' };
        }
        return user;
      });

      setUsersRaw(updatedUsers);
      setUsers(updatedUsers);
      setLgShow(false);
      alert("ยกเลิกการระงับบัญชีเรียบร้อยแล้ว");
    } catch (error) {
      alert("ไม่สามารถดำเนินการได้");
    }
  };

  return (
    <>
      {/* modalstart */}
      <Modal
        size="lg"
        show={lgShow}
        onHide={() => setLgShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title><strong>Inspect</strong></Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedUser && (
            <>
              <Row>
                {/* โปรไฟล์ซ้าย */}
                <Col md={6} className="d-flex justify-content-center">
                  <img
                    src={selectedUser.profile || "https://via.placeholder.com/140"}
                    alt="profile"
                    style={{
                      width: "140px",
                      height: "140px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "3px solid #ddd",
                    }}
                  />
                </Col>
              </Row>

              {/* ข้อมูลตัว user */}
              <div className="mt-4" style={{ lineHeight: "2rem" }}>
                <p><strong>ชื่อผู้ใช้งาน :</strong> {selectedUser.name}</p>
                <p><strong>User ID :</strong> {selectedUser.userId || selectedUser.id}</p>
                <p><strong>บทบาท :</strong> {selectedUser.role}</p>
                <p><strong>ที่อยู่ :</strong> {selectedUser.address ?? "-"}</p>
                <p><strong>เบอร์ติดต่อ :</strong> {selectedUser.phone ?? "-"}</p>
                <p><strong>Email :</strong> {selectedUser.email ?? "-"}</p>
                {selectedUser.role === "Seller" && (
                  <a href={`http://localhost:3000/download/${selectedUser.document}`} download>
                    ดาวน์โหลดเอกสารยืนยันตัวตนคนขาย
                  </a>
                )}
              </div>

              {/* ปุ่มระงับบัญชี */}
              <div className="d-flex justify-content-end mt-3">
                {selectedUser.status === 'suspended' ? (
                  // ถ้าโดนระงับอยู่ ให้โชว์ปุ่มยกเลิก
                  <Button variant="success" onClick={handleUnsuspendUser}>
                    ยกเลิกการระงับบัญชี &nbsp;<i className="bi bi-check-lg"></i>
                  </Button>
                ) : (
                  // ถ้าสถานะปกติ ให้โชว์ปุ่มระงับ
                  <Button variant="danger" onClick={handleDeleteUser}>
                    ระงับบัญชี &nbsp;<i className="bi bi-x-lg"></i>
                  </Button>
                )}
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
      {/* -----modalend--- */}


      <div className="d-flex justify-content-between w-75 m-auto mt-5">
        <div>
          <h1><strong>Userlist</strong></h1>
        </div>

        {/* 🔍 searchbar แบบดั้งเดิม */}
        <div>
          <InputGroup
            className="rounded-pill border border-dark"
            style={{
              width: "600px",
              position: "relative",
            }}
          >
            <Form.Control
              placeholder="Username, UserId"
              className="border-0 rounded-pill"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)} // พิมพ์แล้วอัปเดตค่า
              style={{
                boxShadow: "none",
                paddingLeft: "20px",
                paddingRight: "40px",
              }}
            />
            <Button
              variant="light"
              className="border-0 position-absolute end-0 me-2 bg-transparent"
              style={{ zIndex: 10 }}
              onClick={handleSearch} //  กดแล้วค้นหา
            >
              <i className="bi bi-search"></i>
            </Button>
          </InputGroup>
        </div>
      </div>
      {/* search bar end */}

      {/* Container */}
      <div className="w-75 m-auto">
        {/* Table แบบดั้งเดิม */}
        <Table striped bordered hover>
          <thead className="table-dark">
            <tr>
              <th style={{ width: "3rem" }}>ID</th>
              <th>Username</th>
              <th style={{ width: "6rem" }}>Role</th>
              <th style={{ width: "6rem" }}>Status</th>
              <th style={{ width: "8rem" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr key={user.id}>
                  <td className="text-center">{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.role}</td>
                  <td>{user.status}</td>
                  <td>
                    <Button
                      variant="warning"
                      onClick={() => {
                        setSelectedUser(user);
                        setLgShow(true);
                      }}
                    >
                      Inspect <i className="bi bi-search"></i>
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  ไม่พบผู้ใช้ที่ตรงกับคำค้นหา
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* ปุ่มเปลี่ยนหน้า แบบดั้งเดิม  */}
      <div className="d-flex justify-content-center align-items-center gap-4 my-3">
        <Button
          variant="dark"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Prev
        </Button>

        <span>{currentPage} / {totalPages === 0 ? 1 : totalPages}</span>

        <Button
          variant="dark"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </Button>
      </div>
      {/* ปุ่มเปลี่ยนหน้า end */}
    </>
  );
};

export default Sellerlist;
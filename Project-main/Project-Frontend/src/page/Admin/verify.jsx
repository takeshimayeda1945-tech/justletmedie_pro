import { useEffect, useState } from "react";
import { fetchVerifyUsers } from "../../data/VerifyData";
import { Table, InputGroup, Form, Button, Modal, Row, Col } from "react-bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';
import VerifyDoc from '../../assets/verifydocument.pdf'

const Verify = () => {
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

  // ใช้ useEffect สำหรับ search แบบ realtime
  useEffect(() => {
    const text = searchText.toLowerCase().trim();

    if (text === "") {
      setUsers(usersRaw);
    } else {
      const filtered = usersRaw.filter((user) => {
        return (
          user.name.toLowerCase().includes(text) ||
          user.userId?.toLowerCase().includes(text) ||
          user.id.toString().includes(text)
        );
      });
      setUsers(filtered);
    }
  }, [searchText, usersRaw]);

  useEffect(() => {
    const data = fetchVerifyUsers();
    setUsersRaw(data);
  }, []);

  useEffect(() => {
    setUsers(usersRaw);
  }, [usersRaw]);

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
          user.name.toLowerCase().includes(text) ||
          user.userId?.toLowerCase().includes(text) ||
          user.id.toString().includes(text)
        );
      });
      setUsers(filtered);
    }
  };
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      const res = await fetch(`http://localhost:3000/admin/${selectedUser.id}`, {
        method: "DELETE"
      });

      const data = await res.json();
      console.log("SUSPEND:", data);

      // อัปเดตหน้าเว็บ (ไม่ต้องลบ user แล้ว)
      const updated = usersRaw.map(u =>
        u.id === selectedUser.id ? { ...u, status: "suspended" } : u
      );

      setUsersRaw(updated);
      setUsers(updated);

      setLgShow(false);

    } catch (err) {
      console.error("ERROR:", err);
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
          <Modal.Title><strong>Verify</strong> </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedUser && (
            <>
              <Row>

                {/* โปรไฟล์ซ้าย */}
                <Col md={6} className="d-flex justify-content-center">
                  <img
                    src={selectedUser.profile}
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

                {/* บัตรประชาชน */}
                {/* <Col md={6} className="d-flex justify-content-center">
                      <img
                        src={selectedUser.idCard}
                        alt="id card"
                        style={{
                          width: "260px",
                          height: "160px",
                          borderRadius: "8px",
                          objectFit: "cover",
                          border: "1px solid #ccc",
                        }}
                      />
                    </Col> */}

              </Row>

              {/* ข้อมูลตัว user */}
              <div className="mt-4" style={{ lineHeight: "2rem" }}>
                <p><strong>ชื่อผู้ใช้งาน :</strong> {selectedUser.name}</p>
                <p><strong>User ID :</strong> {selectedUser.userId}</p>
                <p><strong>บทบาท :</strong> {selectedUser.role}</p>
                <p><strong>ที่อยู่ :</strong> {selectedUser.address ?? "-"}</p>
                <p><strong>เบอร์ติดต่อ :</strong> {selectedUser.phone ?? "-"}</p>
                <p><strong>Email :</strong> {selectedUser.email ?? "-"}</p>
                {selectedUser.role === "Seller" && (
                  <a href={VerifyDoc} download >ดาวน์โหลดเอกสารยืนยันตัวตนคนขาย</a>
                )}

              </div>

              {/* ปุ่มระงับบัญชี */}
              <div className="d-flex justify-content-end mt-3">
                <Button variant="danger" onClick={handleDeleteUser}>
                  ระงับบัญชี
                </Button>

                <Button variant="secondary" onClick={() => setLgShow(false)}>
                  ปิด
                </Button>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
      {/* -----modalend--- */}
      <div className="d-flex justify-content-between w-75 m-auto mt-5">
        <div>
          <h1><strong>Verify list</strong></h1>
        </div>

        {/* 🔍 searchbar */}
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
        {/* Table */}
        <Table striped bordered hover>
          <thead className="table-dark">
            <tr>
              <th style={{ width: "3rem" }}>ID</th>
              <th>Username</th>
              <th style={{ width: "6rem" }}>Role</th>
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

      {/* ปุ่มเปลี่ยนหน้า  */}
      <div className="d-flex justify-content-center align-items-center gap-4 my-3">
        <Button
          variant="dark"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Prev
        </Button>

        <span>{currentPage} / {totalPages}</span>

        <Button
          variant="dark"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </Button>
      </div>
      {/* ปุ่มเปลี่ยนหน้า end */}

    </>
  );
}

export default Verify;
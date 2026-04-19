import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, Form } from 'react-bootstrap';

const Stat = () => {

  // สถิติตามช่วงเวลา (สำหรับอสังหาฯ - คงข้อมูลเดิมไว้)
  const statsData = {
    week: { estate_total: 120, estate_sold: 80, estate_unsold: 40 },
    month: { estate_total: 500, estate_sold: 340, estate_unsold: 160 },
    halfyear: { estate_total: 2000, estate_sold: 1500, estate_unsold: 500 },
    year: { estate_total: 3000, estate_sold: 2200, estate_unsold: 800 }
  };

  const [period, setPeriod] = useState("week");
  const current = statsData[period];

  // ----- State สำหรับเก็บข้อมูลออนไลน์จาก Backend -----
  const [onlineStats, setOnlineStats] = useState({
    total: 0,
    buyers: 0,
    sellers: 0
  });
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:3000/admin/stats');
        if (res.ok) {
          const data = await res.json();
          setTotalUsers(data.totalUsers);
          setOnlineStats({
            total: data.activeTotal || 0,
            buyers: data.activeBuyers || 0,
            sellers: data.activeSellers || 0
          });
        }
      } catch (err) {
        console.error("Fetch stats failed", err);
      }
    };

    fetchStats();
    const statsInterval = setInterval(fetchStats, 10000); // อัปเดตข้อมูลทุก 10 วินาที
    return () => clearInterval(statsInterval);
  }, []);
  // --------------------------------------------------

  return (
    <>
      <div style={{ backgroundColor: '#ffffffff', minHeight: '100vh', padding: '2rem' }}>
        <Container className="p-4 rounded-4 shadow-sm" style={{ backgroundColor: '#DFDFDF', maxWidth: '1000px' }}>

          <div className='d-flex justify-content-between'>
            <h3 className="fw-bold mb-4">สถิติ</h3>

            <Form.Select
              style={{ width: '200px', height: '40px' }}
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="week">ปัจจุบัน</option>
              <option value="week">1 สัปดาห์</option>
              <option value="month">1 เดือน</option>
              <option value="halfyear">3 เดือน</option>
              <option value="year">1 ปี</option>
            </Form.Select>
          </div>

          {/* ส่วนอสังหา (คงเดิม) */}
          <Card className="mb-4 shadow-sm border-0" style={{ backgroundColor: '#eef3fb' }}>
            <Card.Body>
              <Row className="text-center">
                <Col md={4}>
                  <i className="bi bi-building-fill" style={{ fontSize: '2.5rem', color: '#0045FF' }}></i>
                  <p className="fw-semibold mt-2 mb-0">จำนวนอสังหาทั้งหมด</p>
                  <h5 className="fw-bold">{current.estate_total}</h5>
                </Col>

                <Col md={4}>
                  <i className="bi bi-check-circle-fill" style={{ fontSize: '2.5rem', color: '#00b140' }}></i>
                  <p className="fw-semibold mt-2 mb-0">ประกาศอสังหาที่ถูกขาย/เช่า</p>
                  <h5 className="fw-bold">{current.estate_sold}</h5>
                </Col>

                <Col md={4}>
                  <i className="bi bi-info-circle-fill" style={{ fontSize: '2.5rem', color: '#f7b500' }}></i>
                  <p className="fw-semibold mt-2 mb-0">ประกาศอสังหาที่ยังไม่ถูกขาย/เช่า</p>
                  <h5 className="fw-bold">{current.estate_unsold}</h5>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* ส่วนผู้ใช้งาน (ปรับเป็น 4 คอลัมน์ และใช้ข้อมูลจาก Backend) */}
          <Card className="mb-4 shadow-sm border-0" style={{ backgroundColor: '#eef3fb' }}>
            <Card.Body>
              <Row className="text-center">
                <Col md={3}>
                  <i className="bi bi-person-workspace" style={{ fontSize: '2.5rem', color: '#ff4d4f' }}></i>
                  <p className="fw-semibold mt-2 mb-0">ออนไลน์รวม <span style={{color: '#00b140'}}>●</span></p>
                  <h5 className="fw-bold text-danger">{onlineStats.total}</h5>
                </Col>

                <Col md={3}>
                  <i className="bi bi-cart-check-fill" style={{ fontSize: '2.5rem', color: '#00b140' }}></i>
                  <p className="fw-semibold mt-2 mb-0">ผู้ซื้อ (ออนไลน์)</p>
                  <h5 className="fw-bold text-success">{onlineStats.buyers}</h5>
                </Col>

                <Col md={3}>
                  <i className="bi bi-shop" style={{ fontSize: '2.5rem', color: '#f7b500' }}></i>
                  <p className="fw-semibold mt-2 mb-0">ผู้ขาย (ออนไลน์)</p>
                  <h5 className="fw-bold text-warning">{onlineStats.sellers}</h5>
                </Col>

                <Col md={3}>
                  <i className="bi bi-people-fill" style={{ fontSize: '2.5rem', color: '#0045FF' }}></i>
                  <p className="fw-semibold mt-2 mb-0">ผู้ใช้งานทั้งหมด</p>
                  <h5 className="fw-bold">{totalUsers}</h5>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* ปุ่ม Export */}
          <div className="text-start">
            <Button variant="primary" className="px-4 rounded-3">
              <i className="bi bi-download me-2"></i>
              Export
            </Button>
          </div>
        </Container>
      </div>  
    </>
  );
};

export default Stat;
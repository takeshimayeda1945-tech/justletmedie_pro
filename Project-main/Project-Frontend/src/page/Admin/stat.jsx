import React, { useState } from 'react';
import { Card, Button, Container, Row, Col, Form } from 'react-bootstrap';

const Stat = () => {

  // สถิติตามช่วงเวลา
  const statsData = {
    week: {
      estate_total: 120,
      estate_sold: 80,
      estate_unsold: 40,
      users_total: 300,
      buyers: 180,
      sellers: 120
    },
    month: {
      estate_total: 500,
      estate_sold: 340,
      estate_unsold: 160,
      users_total: 700,
      buyers: 400,
      sellers: 300
    },
    halfyear: {
      estate_total: 2000,
      estate_sold: 1500,
      estate_unsold: 500,
      users_total: 3000,
      buyers: 1800,
      sellers: 1200
    },
    year: {
      estate_total: 3000,
      estate_sold: 2200,
      estate_unsold: 800,
      users_total: 5000,
      buyers: 2800,
      sellers: 2200
    }
  };

  // state สำหรับเก็บช่วงเวลา
  const [period, setPeriod] = useState("week");

  // ค่า stat ปัจจุบัน
  const current = statsData[period];

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
              <option value="week">1 สัปดาห์</option>
              <option value="month">1 เดือน</option>
              <option value="halfyear">6 เดือน</option>
              <option value="year">1 ปี</option>
            </Form.Select>
          </div>

          {/* ส่วนอสังหา */}
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

          {/* ส่วนผู้ใช้งาน */}
          <Card className="mb-4 shadow-sm border-0" style={{ backgroundColor: '#eef3fb' }}>
            <Card.Body>
              <Row className="text-center">
                <Col md={4}>
                  <i className="bi bi-people-fill" style={{ fontSize: '2.5rem', color: '#0045FF' }}></i>
                  <p className="fw-semibold mt-2 mb-0">จำนวนผู้ใช้งาน</p>
                  <h5 className="fw-bold">{current.users_total}</h5>
                </Col>

                <Col md={4}>
                  <i className="bi bi-person-fill" style={{ fontSize: '2.5rem', color: '#00b140' }}></i>
                  <p className="fw-semibold mt-2 mb-0">ผู้ซื้อ</p>
                  <h5 className="fw-bold">{current.buyers}</h5>
                </Col>

                <Col md={4}>
                  <i className="bi bi-person-badge-fill" style={{ fontSize: '2.5rem', color: '#f7b500' }}></i>
                  <p className="fw-semibold mt-2 mb-0">ผู้ขาย</p>
                  <h5 className="fw-bold">{current.sellers}</h5>
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

import { InputGroup, Form, Button, Row, Col, ProgressBar } from 'react-bootstrap';
const GOLD_COLOR = '#d6af3c';
const BLUE_COLOR = '#0056b3';
import badroom from '../../componants/img/infoimg/badroom.png'
import bathroom from '../../componants/img/infoimg/bathroom.png'
import space from '../../componants/img/infoimg/space.png'
import space2 from '../../componants/img/infoimg/space2.png'
import infohouse from '../../componants/img/infoimg/infohouse.png'
import mrtorbts from '../../componants/img/infoimg/mrtorbts.png'
import shop from '../../componants/img/infoimg/shop.png'
import hospital from '../../componants/img/infoimg/hospital.png'
import departmentstore from '../../componants/img/infoimg/department-store.png'
import Googlemap from '../../componants/img/infoimg/Googlemap.png'


// Component ย่อยสำหรับแสดง Icon และรายละเอียด (สิ่งอำนวยความสะดวก)
const IconDetail = ({ iconSrc, value, label }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column', // จัดเรียงในแนวตั้ง
            alignItems: 'center',    // จัดให้อยู่กึ่งกลางในแนวนอน
            textAlign: 'center',
            marginRight: '2rem',     // เว้นระยะห่างด้านขวา
            width: '100px'           // กำหนดความกว้างของแต่ละส่วน
        }}>
            {/* รูป Icon */}
            <img
                src={iconSrc}
                alt={label}
                style={{
                    width: '80px',   // ปรับขนาดความกว้างของรูป icon
                    height: '80px',  // ปรับขนาดความสูงของรูป icon
                    marginBottom: '0.25rem' // เว้นระยะห่างเล็กน้อย
                }}
            />

            {/* ข้อความตัวเลข (5) */}
            <p style={{
                fontSize: '20px',
                fontWeight: 'bold',
                margin: '0',
                lineHeight: '1.2'
            }}>
                {value}
            </p>

            {/* ข้อความคำอธิบาย (ห้องนอน) */}
            <p style={{
                fontSize: '18px',
                fontWeight: 'bold', // ทำให้ตัวหนังสือคำอธิบายหนาตามตัวอย่าง
                margin: '0',
                color: '#333',
                lineHeight: '1.2'
            }}>
                {label}
            </p>
        </div>
    );
};

// Component ย่อยสำหรับแสดง Icon และรายละเอียดของทำเล (เรียงแนวนอน)
const LocationDetail = ({ iconSrc, altText, detail }) => {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center', // จัดให้อยู่กึ่งกลางในแนวตั้ง
            marginBottom: '1rem', // เว้นระยะห่างระหว่างรายการ
            width: '50%' // กำหนดความกว้างให้อยู่ใน 2 คอลัมน์
        }}>
            {/* รูป Icon */}
            <img
                src={iconSrc}
                alt={altText}
                style={{
                    width: '30px',   // ปรับขนาด icon ให้เล็กลง
                    height: '30px',
                    marginRight: '1rem'
                }}
            />
            {/* ข้อความรายละเอียด */}
            <p style={{
                fontSize: '18px',
                margin: '0',
                lineHeight: '1.5'
            }}>
                {detail}
            </p>
        </div>
    );
};

const PropertyDetail = () => {
    // กำหนดค่าสำหรับ IconDetails ของสิ่งอำนวยความสะดวก
    const facilityDetails = [
        { iconSrc: badroom, value: "5", label: "ห้องนอน" },
        { iconSrc: bathroom, value: "8", label: "ห้องน้ำ" },
        { iconSrc: space, value: "716.4 ตร.ม.", label: "(ขนาดที่ดิน)" },
        { iconSrc: space2, value: "฿362,926 / ตร.ม.", label: "(ขนาดที่ดิน)" },
    ];

    // กำหนดค่าสำหรับ LocationDetails ของที่ตั้งและทำเล (ใช้ชื่อไฟล์ตามที่คุณกำหนด)
    const locationData = [
        { iconSrc: mrtorbts, altText: "MRT Icon", detail: "MRT สายสีม่วง สถานีวงศ์สว่าง : 800 m" },
        { iconSrc: shop, altText: "Big C Icon", detail: "บิ๊กซี วงศ์สว่าง : 850 m" },
        { iconSrc: hospital, altText: "Hospital Icon", detail: "โรงพยาบาลเกษมราษฎร์ ประชาชื่น : 1.5 km" },
        { iconSrc: departmentstore, altText: "Central Icon", detail: "เซ็นทรัล ลาดพร้าว : 5.2 km" },
    ];

    return (
        <div>
            <header style={{ marginTop: "2rem", marginLeft: "2rem", fontWeight: "bold" }}>
                Home / บ้านเดี่ยว / กรุงเทพ / บางซื่อ / วงศ์สว่าง / Sonle Residences / สำหรับขาย
            </header>

            <div style={{ margin: "2rem" }}>
                <img
                    src = {infohouse}
                    alt="house"
                    style={{ width: "auto", borderRadius: "20px", height: "auto" }}
                />
            </div>
            <div className="d-flex justify-content-between">
                <div>
                    <p style={{ marginTop: "2rem", marginLeft: "2rem", fontWeight: "bold", fontSize: 40 }}>SONLE RESIDENCES บ้านเดี่ยวสุดหรู 3 ชั้น</p>
                    <p style={{ marginLeft: "2rem", fontSize: 25, color: "#ADACAC" }}>วงศ์สว่าง, บางซื่อ, กรุงเทพ</p>
                    <p style={{ marginTop: "2rem", marginLeft: "2rem", fontWeight: "bold", fontSize: 40 }}>฿ 260,000,000</p>
                    <hr />

                    {/* Container สำหรับ Icon สิ่งอำนวยความสะดวกทั้งหมด */}
                    <div style={{
                        margin: "2rem",
                        display: "flex",
                        justifyContent: "flex-start",
                        gap: "1rem" // เพิ่มช่องว่างระหว่างไอคอน
                    }}>
                        {/* ใช้ Component IconDetail */}
                        {facilityDetails.map((item, index) => (
                            <IconDetail
                                key={index}
                                iconSrc={item.iconSrc}
                                value={item.value}
                                label={item.label}
                            />
                        ))}
                    </div>
                    <hr />

                    {/* ส่วน ที่ตั้งและทำเล */}
                    <p style={{ marginTop: "2rem", marginLeft: "2rem", fontWeight: "bold", fontSize: 25 }}>ที่ตั้งและทำเล</p>

                    {/* Container สำหรับ Icon ที่ตั้งและทำเลทั้งหมด (แสดง 2 คอลัมน์) */}
                    <div style={{
                        margin: "2rem",
                        display: "flex",
                        flexWrap: 'wrap', // ให้ขึ้นบรรทัดใหม่เมื่อเนื้อที่เต็ม
                        justifyContent: "flex-start",
                    }}>
                        {/* ใช้ Component LocationDetail */}
                        {locationData.map((item, index) => (
                            <LocationDetail
                                key={index}
                                iconSrc={item.iconSrc}
                                altText={item.altText}
                                detail={item.detail}
                            />
                        ))}
                    </div>
                    <hr />
                    <p style={{ marginTop: "2rem", marginLeft: "5rem", fontWeight: "bold", fontSize: 25 }}>รายละเอียด</p>
                    <div style={{ marginLeft: "5rem", width: "1000px", height: "auto" }}>
                        <p style={{ fontSize: 20 }}>บ้านเดี่ยวทำเลรัชดา ใจกลางเมือง ใกล้ MRT แบบ LUNE ในพื้นที่ 179 ตร.ว. 5 ห้องนอน 8 ห้องน้ำ 5 ที่จอดรถหนึ่งในความพิเศษของโครงการนี้ คือการเป็นบ้านเดี่ยวทำเลรัชดา ที่ตั้งอยู่บนถนนรัชดาภิเษก
                            ใกล้กับ MRT สถานีวงศ์สว่าง และห่างจากทางด่วนศรีรัชเพียง 900 เมตร ช่วยให้การเดินทางเข้าสู่ใจกลางพระราม 9 - อโศก - สุขุมวิท หรือเส้นราชพฤกษ์ - ปิ่นเกล้า เป็นเรื่องง่ายดายอีกทั้งทำเลแห่งนี้ยังรายล้อมไปด้วยแหล่งไลฟ์สไตล์ เช่น
                            ศูนย์การค้า โรงพยาบาลชั้นนำ โดยมีสิ่งอำนวยความสะดวกครบครัน เหมาะสำหรับเจ้าของกิจการ นักลงทุน หรือผู้นำรุ่นใหม่ที่ต้องการความสงบเป็นส่วนตัว เรียกได้ว่าใกล้ความเจริญในทุกด้าน
                            มอบประสบการณ์ความเป็นส่วนตัวสุด Exclusiveด้วยความที่โครงการ Sonle Residences จำกัดจำนวนเพียง 5 หลัง เพื่อเน้นความเป็น Super Private Residence อย่างแท้จริง โดยทุกหลังได้รับการออกแบบภายใต้แนวคิด
                            "Sophisticated Modern Tropical" ที่เปิดรับแสง ลม และธรรมชาติรอบด้านผ่านสวนคอร์ทยาร์ด พร้อมสระว่ายน้ำแบบ Infinity Edge บริเวณชั้น 2 และเสียงน้ำตก Over Flow ที่สร้างบรรยากาศสงบผ่อนคลาย
                            อีกทั้งยังมีฟังก์ชัน Smart Home เต็มรูปแบบ และวัสดุระดับพรีเมียมในทุกรายละเอียด ให้ใช้ชีวิตได้อย่างเหนือระดับทุกวัน</p>
                    </div><hr />
                </div>
                <div>
                    <div
                        className="rounded-4 p-4 mt-3"
                        style={{
                            width: "350px", // ปรับความกว้างให้เหมือน Card
                            // ลบ bg-black ออก
                            border: '1px solid #ddd',
                            boxShadow: '0 4px 12px rgba(0,0,0,.1)', // เพิ่มเงาเล็กน้อย
                            backgroundColor: 'white'
                        }}
                    >

                        {/* === 1. ส่วนบน: รูปภาพ, ชื่อ, และลูกศรขวา === */}
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            {/* รูปโปรไฟล์และข้อความ */}
                            <div className="d-flex align-items-center">
                                {/* รูป Placeholder (กรอบสี่เหลี่ยมมน) */}
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    border: '1px solid #ccc',
                                    borderRadius: '10px',
                                    backgroundColor: '#fff',
                                    marginRight: '15px',
                                    flexShrink: 0
                                }}>
                                </div>
                                {/* ข้อความชื่อบริษัท */}
                                <div>
                                    <h5 className="mb-0" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Monkey</h5>
                                    <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>Monkey ate BANaNA co.(Thailand)</p>
                                </div>
                            </div>
                            {/* ลูกศรขวา */}
                            <span style={{ fontSize: '1.5rem', color: '#888' }}>&gt;</span>
                        </div>

                        {/* === 2. ส่วนกลาง: ปุ่ม "ติดต่อ" === */}
                        <Button
                            className="w-100 rounded-pill"
                            style={{
                                backgroundColor: '#001a4f', // สีน้ำเงินเข้ม/ดำ
                                borderColor: '#001a4f',
                                color: 'white',
                                fontWeight: 'bold',
                                padding: '0.8rem',
                                fontSize: '1.1rem'
                            }}
                        >
                            ติดต่อ
                        </Button>

                        {/* === 3. ส่วนล่าง: ข้อความ "ติดต่อสอบถามด้วยวิธีอื่น ๆ" และลูกศรลง === */}
                        <hr className="my-4" />
                        <div className="d-flex justify-content-between align-items-center">
                            <p className="mb-0 text-muted" style={{ fontSize: '0.9rem' }}>ติดต่อสอบถามด้วยวิธีอื่น ๆ</p>
                            {/* ลูกศรลง */}
                            <span style={{ fontSize: '1rem', color: '#888' }}>&#x2304;</span>
                        </div>

                    </div>
                    <h2 ><strong>Goolgle Map</strong></h2>
                    <div className="bg-black rounded-5 " style={{ width: "500px", height: "400px" }}>
                        <img class="object-fit-cover" src={Googlemap} />
                    </div>
                </div>
            </div>
            <div>
                <p style={{ marginTop: "2rem", marginLeft: "2rem", fontWeight: "bold", fontSize: 28 }}>ยอดสินเชื่อโดยประมาณ</p>
                {/* from  input*/}
                <Row className="my-5" style={{ marginLeft: "2rem" }}>

                    {/* ========================================================================= */}
                    {/* LEFT COLUMN: ฟอร์มคำนวณ (ใช้ Col md={5} เพื่อให้มีพื้นที่เหลือสำหรับ Col ขวา) */}
                    {/* ========================================================================= */}
                    <Col md={5} className="pr-4">
                        <h3 style={{ fontWeight: "bold", fontSize: 20, marginBottom: "1.5rem" }}>ยอดสินเชื่อโดยประมาณ</h3>

                        {/* ราคาอสังหา */}
                        <p style={{ fontWeight: "bold", fontSize: 14 }}>ราคาอสังหา</p>
                        <InputGroup className="mb-3" style={{ fontWeight: "bold", fontSize: 28 }}>
                            <InputGroup.Text>฿</InputGroup.Text>
                            <Form.Control placeholder='ราคาอสังหา' type="number" />
                        </InputGroup>

                        {/* ยอดสินเชื่อ */}
                        <p style={{ marginTop: "2rem", fontWeight: "bold", fontSize: 14 }}>ยอดสินเชื่อ</p>
                        <InputGroup className="mb-3" style={{ fontWeight: "bold", fontSize: 28 }}>
                            <InputGroup.Text>฿</InputGroup.Text>
                            <Form.Control placeholder='สินเชื่อ' type="number" />
                        </InputGroup>

                        {/* อัตราดอกเบี้ย & ระยะเวลากู้ (Side-by-Side) */}
                        <Row className="mt-4">
                            <Col xs={6}>
                                <p style={{ fontWeight: "bold", fontSize: 14 }}>อัตราดอกเบี้ย</p>
                                <InputGroup className="mb-3" style={{ fontWeight: "bold", fontSize: 28 }}>
                                    <InputGroup.Text>%</InputGroup.Text>
                                    <Form.Control type="number" placeholder='3' />
                                </InputGroup>
                            </Col>
                            <Col xs={6}>
                                <p style={{ fontWeight: "bold", fontSize: 14 }}>ระยะเวลากู้</p>
                                <InputGroup className="mb-3" style={{ fontWeight: "bold", fontSize: 28 }}>
                                    <InputGroup.Text>%</InputGroup.Text>
                                    <Form.Control type="number" placeholder='30' />
                                </InputGroup>
                            </Col>
                        </Row>

                        {/* Button: คำนวณอีกครั้ง (จัดให้เต็มความกว้างของ Col) */}
                        <div className='d-grid mt-4'>
                            <Button
                                className="rounded-pill"
                                style={{
                                    backgroundColor: GOLD_COLOR,
                                    color: '#000000',
                                    fontWeight: 'bold',
                                    fontSize: '1.5rem',
                                    padding: '0.8rem 3rem',
                                    border: 'none',
                                }}
                            >
                                คำนวณอีกครั้ง
                            </Button>
                        </div>
                    </Col>

                    {/* ========================================================================= */}
                    {/* RIGHT COLUMN: ส่วนแสดงผลการคำนวณ (ใช้ Col md={7} เพื่อให้ผลลัพธ์มีพื้นที่พอ) */}
                    {/* ========================================================================= */}
                    <Col md={7} className="pl-5 pt-4">

                        {/* 1. รายละเอียดสินเชื่อ (Loan Details) */}
                        <h3 style={{ fontWeight: "bold", fontSize: 20, marginBottom: "0.5rem" }}>รายละเอียดสินเชื่อ</h3>
                        <p className="text-muted" style={{ fontSize: 14 }}>ยอดสินเชื่อที่ต้องชำระต่อเดือนโดยประมาณ</p>

                        {/* Progress Bar 1: เงินต้น vs ดอกเบี้ย */}
                        <ProgressBar className="mb-2" style={{ height: '18px', borderRadius: '50px', width: "50%" }}>
                            <ProgressBar now={41} key={1} style={{ backgroundColor: GOLD_COLOR }} label="41 %" />
                            <ProgressBar now={59} key={2} style={{ backgroundColor: BLUE_COLOR }} label="59 %" />
                        </ProgressBar>

                        {/* Labels 1 (Principal/Interest) */}
                        <div className="d-flex justify-content-between mb-5">
                            {/* เงินต้น */}
                            <div className="d-flex align-items-center">
                                <span style={{ height: '12px', width: '12px', backgroundColor: GOLD_COLOR, borderRadius: '50%', marginRight: '8px' }}></span>
                                <span style={{ fontWeight: 'bold', fontSize: 16 }}>฿ 321,016 เงินต้น</span>
                            </div>
                            {/* ดอกเบี้ย */}
                            <div className="d-flex align-items-center">
                                <span style={{ height: '12px', width: '12px', backgroundColor: BLUE_COLOR, borderRadius: '50%', marginRight: '8px' }}></span>
                                <span style={{ fontWeight: 'bold', fontSize: 16, marginRight: "500px" }}>฿ 446,303 ดอกเบี้ย</span>
                            </div>
                        </div>

                        {/* 2. ค่าใช้จ่ายที่อาจต้องมีเบื้องต้น (Initial Costs) */}
                        <h3 style={{ fontWeight: "bold", fontSize: 20, marginBottom: "0.5rem" }}>ค่าใช้จ่ายที่อาจต้องมีเบื้องต้น</h3>
                        <p className="text-muted" style={{ fontSize: 14 }}>เงินดาวน์ทั้งหมด</p>

                        {/* Progress Bar 2: เงินดาวน์ vs วงเงินสินเชื่อ */}
                        <ProgressBar className="mb-2" style={{ height: '18px', borderRadius: '50px', width: "50%" }}>
                            <ProgressBar now={30} key={1} style={{ backgroundColor: GOLD_COLOR }} label="30 %" />
                            <ProgressBar now={70} key={2} style={{ backgroundColor: BLUE_COLOR }} label="70 %" />
                        </ProgressBar>

                        {/* Labels 2 (Down Payment/Loan Amount) */}
                        <div className="d-flex justify-content-between">
                            {/* เงินดาวน์ */}
                            <div className="d-flex align-items-center">
                                <span style={{ height: '12px', width: '12px', backgroundColor: GOLD_COLOR, borderRadius: '50%', marginRight: '8px' }}></span>
                                <span style={{ fontWeight: 'bold', fontSize: 16 }}>เงินดาวน์</span>
                            </div>
                            {/* วงเงินสินเชื่อ */}
                            <div className="d-flex align-items-start text-right" style={{ maxWidth: '70%' }}>
                                <span style={{ height: '12px', width: '12px', backgroundColor: BLUE_COLOR, borderRadius: '50%', marginRight: '8px', flexShrink: 0, marginTop: '5px' }}></span>
                                <span style={{ fontSize: 14, lineHeight: '1.4', marginRight: "500px" }}>จำนวนวงเงินสินเชื่อ ฿ 182,000,000 ในอัตรา 70% ของสินเชื่อต่อราคาบ้าน (Loan-to-value)</span>
                            </div>
                        </div>
                    </Col>
                </Row>

            </div>
        </div>
    );
}

export default PropertyDetail;
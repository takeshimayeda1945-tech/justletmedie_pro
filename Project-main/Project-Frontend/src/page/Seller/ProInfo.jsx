import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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

const parseNumber = (value) => {
    if (value === undefined || value === null || value === '') return null;
    if (typeof value === 'number') return value;
    const cleaned = String(value).replace(/,/g, '').replace(/\s*บาท\s*/gi, '').trim();
    if (cleaned === '') return null;
    const numeric = Number(cleaned);
    return Number.isNaN(numeric) ? null : numeric;
};

const formatCurrency = (value) => {
    if (value === undefined || value === null || Number.isNaN(Number(value))) return '-';
    return new Intl.NumberFormat('th-TH').format(value);
};

const calculateLoan = (price, downPercent, interestRate, termYears) => {
    const downpayment = price * (downPercent / 100);
    const loanAmount = Math.max(0, price - downpayment);
    const months = Math.max(1, Math.round(termYears * 12));
    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment = monthlyRate > 0
        ? loanAmount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months))
        : loanAmount / months;
    const totalPayment = monthlyPayment * months;
    return {
        downpayment,
        loanAmount,
        monthlyPayment,
        totalPayment,
        months,
        principalRatio: loanAmount > 0 ? (loanAmount / price) * 100 : 0,
        downPaymentRatio: price > 0 ? (downpayment / price) * 100 : 0
    };
};

const IconDetail = ({ iconSrc, value, label }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.25rem', background: '#f8f9fa', borderRadius: '12px', minWidth: '150px' }}>
            <img src={iconSrc} alt={label} style={{ width: '42px', height: '42px', flexShrink: 0 }} />
            <div>
                <p style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, lineHeight: '1.2', color: '#1a1a1a' }}>{value}</p>
                <p style={{ fontSize: '13px', margin: 0, color: '#666' }}>{label}</p>
            </div>
        </div>
    );
};

const getDistanceMeters = (lat1, lng1, lat2, lng2) => {
    const toRad = v => v * Math.PI / 180;
    const R = 6371000;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const formatDistance = meters => meters >= 1000 ? `${(meters / 1000).toFixed(1)} กิโลเมตร` : `${Math.round(meters)} เมตร`;

const LocationDetail = ({ iconSrc, altText, detail }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', border: '1px solid #eee', borderRadius: '12px', background: '#fafafa' }}>
            <img src={iconSrc} alt={altText} style={{ width: '28px', height: '28px', flexShrink: 0 }} />
            <p style={{ fontSize: '14px', margin: 0, color: '#333', lineHeight: '1.4' }}>{detail}</p>
        </div>
    );
};

const ProInfo = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [priceInput, setPriceInput] = useState('');
    const [downPercent, setDownPercent] = useState(20);
    const [interestRate, setInterestRate] = useState(3.5);
    const [loanTerm, setLoanTerm] = useState(30);
    const [loanResult, setLoanResult] = useState({ downpayment: 0, loanAmount: 0, monthlyPayment: 0, totalPayment: 0, months: 360, principalRatio: 0, downPaymentRatio: 0 });
    const [selectedImage, setSelectedImage] = useState(null);

    const [nearbyPlaces, setNearbyPlaces] = useState([]);
    const [nearbyLoading, setNearbyLoading] = useState(false);

    useEffect(() => {
        const fetchProperty = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await fetch(`http://localhost:3000/api/properties/${id}`);
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || 'ไม่พบข้อมูลอสังหา');
                }
                setProperty(data.data);
                const priceValue = data.data.priceNumber ?? parseNumber(data.data.price) ?? parseNumber(data.data.priceSale) ?? parseNumber(data.data.priceRent) ?? 0;
                setPriceInput(priceValue ? String(priceValue) : '');
                if (data.data.images && data.data.images.length > 0) {
                    setSelectedImage(data.data.images[0]);
                }
            } catch (err) {
                setError(err.message || 'ไม่สามารถโหลดข้อมูลได้');
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id]);

    useEffect(() => {
        const price = parseNumber(priceInput) ?? 0;
        setLoanResult(calculateLoan(price, downPercent, interestRate, loanTerm));
    }, [priceInput, downPercent, interestRate, loanTerm]);

    useEffect(() => {
        if (!property) return;
        if (!property.latitude || !property.longitude) {
            if (Array.isArray(property.nearbyPlaces) && property.nearbyPlaces.length > 0) {
                setNearbyPlaces(property.nearbyPlaces);
            }
            return;
        }
        const lat = Number(property.latitude);
        const lng = Number(property.longitude);
        setNearbyLoading(true);

        const OVERPASS_MIRRORS = [
            'https://overpass-api.de/api/interpreter',
            'https://overpass.kumi.systems/api/interpreter',
            'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
        ];
        const RADIUS = 3000;
        const buildQuery = (r) => `[out:json][timeout:30];(node["public_transport"="station"](around:${r},${lat},${lng});node["railway"="station"](around:${r},${lat},${lng});node["railway"="subway_entrance"](around:${r},${lat},${lng});node["station"="subway"](around:${r},${lat},${lng});node["amenity"="hospital"](around:${r},${lat},${lng});node["shop"="mall"](around:${r},${lat},${lng});node["shop"="department_store"](around:${r},${lat},${lng});node["shop"="supermarket"](around:${r},${lat},${lng});way["shop"="mall"](around:${r},${lat},${lng});way["shop"="department_store"](around:${r},${lat},${lng}););out center;`;

        const fetchOverpass = async (url, query) => {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'data=' + encodeURIComponent(query),
                signal: AbortSignal.timeout(35000),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const text = await res.text();
            if (text.trim().startsWith('<')) throw new Error('HTML response (server busy)');
            return JSON.parse(text);
        };

        const tryAllMirrors = async () => {
            const query = buildQuery(RADIUS);
            for (const url of OVERPASS_MIRRORS) {
                try {
                    const data = await fetchOverpass(url, query);
                    return data;
                } catch {
                    // try next mirror
                }
            }
            // Last resort: try wider radius on first mirror
            try {
                return await fetchOverpass(OVERPASS_MIRRORS[0], buildQuery(5000));
            } catch {
                return null;
            }
        };

        tryAllMirrors().then(data => {
            if (!data || !data.elements) {
                if (Array.isArray(property.nearbyPlaces) && property.nearbyPlaces.length > 0) setNearbyPlaces(property.nearbyPlaces);
                return;
            }
            const cats = [
                { icon: mrtorbts, label: 'สถานีรถไฟฟ้า', items: [] },
                { icon: hospital, label: 'โรงพยาบาล', items: [] },
                { icon: departmentstore, label: 'ห้างสรรพสินค้า', items: [] },
                { icon: shop, label: 'ร้านค้า/ซูเปอร์มาร์เก็ต', items: [] },
            ];
            data.elements.forEach(el => {
                const tags = el.tags || {};
                const elLat = el.lat ?? el.center?.lat;
                const elLon = el.lon ?? el.center?.lon;
                if (!elLat || !elLon) return;
                const dist = getDistanceMeters(lat, lng, elLat, elLon);
                const name = tags['name:th'] || tags.name || tags['name:en'] || '';
                if (!name) return;
                if (tags.public_transport === 'station' || tags.railway || tags.station === 'subway') cats[0].items.push({ name, dist });
                else if (tags.amenity === 'hospital') cats[1].items.push({ name, dist });
                else if (tags.shop === 'mall' || tags.shop === 'department_store') cats[2].items.push({ name, dist });
                else if (tags.shop === 'supermarket') cats[3].items.push({ name, dist });
            });
            const places = cats.flatMap(cat => {
                const closest = [...cat.items].sort((a, b) => a.dist - b.dist)[0];
                return closest ? [{ iconSrc: cat.icon, altText: cat.label, detail: `${closest.name} : ${formatDistance(closest.dist)}` }] : [];
            });
            setNearbyPlaces(places.length > 0 ? places : (Array.isArray(property.nearbyPlaces) && property.nearbyPlaces.length > 0 ? property.nearbyPlaces : []));
        }).finally(() => setNearbyLoading(false));
    }, [property]);

    if (loading) return <div style={{ padding: '2rem' }}>กำลังโหลดข้อมูลอสังหา...</div>;
    if (error) return <div style={{ padding: '2rem', color: 'red' }}>{error}</div>;
    if (!property) return <div style={{ padding: '2rem' }}>ไม่พบข้อมูลอสังหา</div>;

    const price = property.priceNumber ?? parseNumber(property.price) ?? parseNumber(property.priceSale) ?? parseNumber(property.priceRent) ?? 0;
    const title = property.name || `${property.type || property.property_type || 'อสังหา'} ใน ${property.address || 'ไม่ระบุที่อยู่'}`;
    const addressLine = property.address || 'ที่อยู่ไม่ระบุ';
    const description = property.description || 'ไม่มีรายละเอียดเพิ่มเติม';
    const imageList = Array.isArray(property.images) && property.images.length > 0 ? property.images : [property.image || infohouse];
    const selectedImageSrc = selectedImage || imageList[0] || infohouse;
    const saleTypeLabel = property.saleType || property.sale_type || 'ขาย/เช่า';
    const bedroomValue = property.bedrooms ?? '-';
    const bathroomValue = property.bathrooms ?? '-';
    const floorValue = property.floor || property.floors || '-';
    const landSizeValue = property.landSize || property.land_size || '-';
    const hasCoordinates = property.latitude !== null && property.latitude !== undefined && property.longitude !== null && property.longitude !== undefined
    const coordinateText = hasCoordinates ? `${property.latitude}, ${property.longitude}` : ''
    const googleMapUrl = hasCoordinates ? `https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}` : ''
    const googleEmbedUrl = hasCoordinates ? `https://www.google.com/maps?q=${property.latitude},${property.longitude}&z=16&output=embed` : ''
    const facilityDetails = [
        { iconSrc: badroom, value: bedroomValue, label: 'ห้องนอน' },
        { iconSrc: bathroom, value: bathroomValue, label: 'ห้องน้ำ' },
        { iconSrc: space, value: landSizeValue, label: 'ขนาดที่ดิน (ตร.ม.)' },
        { iconSrc: space2, value: floorValue, label: 'ชั้น' },
    ];

    return (
        <div style={{ backgroundColor: '#f5f6f8', minHeight: '100vh', paddingBottom: '3rem' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.25rem 2rem 0' }}>
                <p style={{ fontSize: '14px', color: '#888', margin: '0 0 1.25rem' }}>
                    หน้าหลัก <span style={{ margin: '0 6px' }}>/</span>
                    {property.type || 'อสังหา'} <span style={{ margin: '0 6px' }}>/</span>
                    <span style={{ color: '#333', fontWeight: '600' }}>{addressLine}</span>
                </p>

                <img src={selectedImageSrc} alt={title} style={{ width: '100%', borderRadius: '16px', maxHeight: '500px', objectFit: 'cover', display: 'block' }} />
                {imageList.length > 1 && (
                    <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
                        {imageList.map((img, index) => (
                            <img key={index} src={img} alt={`${title} ${index + 1}`}
                                style={{ width: '100px', height: '75px', objectFit: 'cover', borderRadius: '10px', cursor: 'pointer', border: img === selectedImageSrc ? '3px solid #d6af3c' : '2px solid transparent' }}
                                onClick={() => setSelectedImage(img)} />
                        ))}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                                <span style={{ backgroundColor: '#001a4f', color: 'white', padding: '3px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>{saleTypeLabel}</span>
                                {property.type && <span style={{ color: '#666', fontSize: '14px' }}>{property.type}</span>}
                            </div>
                            <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: '0 0 0.4rem', color: '#1a1a1a', lineHeight: '1.3' }}>{title}</h1>
                            <p style={{ color: '#888', margin: '0 0 1.25rem', fontSize: '15px' }}>📍 {addressLine}</p>
                            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '1rem' }}>
                                <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#d6af3c', margin: 0 }}>฿ {formatCurrency(price)}</p>
                            </div>
                        </div>

                        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                            <h2 style={{ fontSize: '17px', fontWeight: 'bold', marginBottom: '1.25rem', color: '#1a1a1a' }}>ข้อมูลอสังหาริมทรัพย์</h2>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                {facilityDetails.map((item, index) => (
                                    <IconDetail key={index} iconSrc={item.iconSrc} value={item.value} label={item.label} />
                                ))}
                            </div>
                        </div>

                        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                            <h2 style={{ fontSize: '17px', fontWeight: 'bold', marginBottom: '1.25rem', color: '#1a1a1a' }}>ที่ตั้งและทำเล</h2>
                            {nearbyLoading ? (
                                <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>กำลังค้นหาสถานที่ใกล้เคียง...</p>
                            ) : nearbyPlaces.length > 0 ? (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                    {nearbyPlaces.map((item, index) => (
                                        <LocationDetail key={index} iconSrc={item.iconSrc} altText={item.altText || item.name || 'Nearby place'} detail={item.detail || `${item.name || 'สถานที่ใกล้เคียง'} ${item.distance || ''}`} />
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>ไม่พบสถานที่ใกล้เคียงในรัศมี 2 กม.</p>
                            )}
                            {hasCoordinates && (
                                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f0f0f0' }}>
                                    <a href={googleMapUrl} target='_blank' rel='noreferrer' style={{ fontSize: '14px', color: '#0056b3', textDecoration: 'none' }}>
                                        🗺 เปิดใน Google Maps
                                    </a>
                                </div>
                            )}
                        </div>

                        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                            <h2 style={{ fontSize: '17px', fontWeight: 'bold', marginBottom: '1rem', color: '#1a1a1a' }}>รายละเอียด</h2>
                            <p style={{ fontSize: '15px', lineHeight: '1.9', color: '#444', margin: 0 }}>{description}</p>
                        </div>
                    </div>

                    <div style={{ width: '360px', flexShrink: 0, position: 'sticky', top: '1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
                                <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>👤</div>
                                <div>
                                    <p style={{ fontWeight: 'bold', fontSize: '15px', margin: 0, color: '#1a1a1a' }}>ข้อมูลผู้ขาย</p>
                                    <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>{property.sellerName || 'ผู้ขายทั่วไป'}</p>
                                </div>
                            </div>
                            <Button className='w-100 rounded-pill' style={{ backgroundColor: '#001a4f', borderColor: '#001a4f', color: 'white', fontWeight: 'bold', padding: '0.7rem', fontSize: '15px' }}>ติดต่อ</Button>
                            <hr style={{ margin: '1rem 0' }} />
                            <p style={{ color: '#888', fontSize: '13px', margin: 0, textAlign: 'center' }}>ติดต่อสอบถามด้วยวิธีอื่น ๆ</p>
                        </div>

                        <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f0f0f0' }}>
                                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1a1a1a' }}>แผนที่</h3>
                            </div>
                            <div style={{ height: '320px' }}>
                                {hasCoordinates ? (
                                    <iframe title='Property location' src={googleEmbedUrl} width='100%' height='100%' style={{ border: 0, display: 'block' }} loading='lazy' allowFullScreen />
                                ) : (
                                    <img src={Googlemap} alt='Map' style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <p style={{ marginTop: '2rem', fontWeight: 'bold', fontSize: 28 }}>ยอดสินเชื่อโดยประมาณ</p>
                    <Row className='my-5'>
                    <Col md={5} className='pr-4'>
                        <div className='rounded-4 p-4' style={{ border: '1px solid #ddd', boxShadow: '0 4px 12px rgba(0,0,0,.08)', backgroundColor: 'white' }}>
                            <h3 style={{ fontWeight: 'bold', fontSize: 20, marginBottom: '1.5rem' }}>คำนวณสินเชื่อ</h3>
                            <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>ราคาอสังหา</p>
                            <InputGroup className='mb-3'>
                                <InputGroup.Text>฿</InputGroup.Text>
                                <Form.Control value={priceInput} onChange={(e) => setPriceInput(e.target.value)} type='number' placeholder='กรอกราคาอสังหา' />
                            </InputGroup>
                            <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>อัตราดอกเบี้ย (%) ต่อปี</p>
                            <InputGroup className='mb-3'>
                                <InputGroup.Text>%</InputGroup.Text>
                                <Form.Control value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} type='number' />
                            </InputGroup>
                            <Row className='mt-4'>
                                <Col xs={6}>
                                    <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>ระยะเวลากู้ (ปี)</p>
                                    <Form.Control value={loanTerm} onChange={(e) => setLoanTerm(Number(e.target.value))} type='number' />
                                </Col>
                                <Col xs={6}>
                                    <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>เงินดาวน์ (%)</p>
                                    <InputGroup>
                                        <InputGroup.Text>%</InputGroup.Text>
                                        <Form.Control value={downPercent} onChange={(e) => setDownPercent(Number(e.target.value))} type='number' />
                                    </InputGroup>
                                </Col>
                            </Row>
                            <div className='d-grid mt-4'>
                                <Button onClick={() => setLoanResult(calculateLoan(parseNumber(priceInput) ?? 0, downPercent, interestRate, loanTerm))} className='rounded-pill' style={{ backgroundColor: GOLD_COLOR, color: '#000', fontWeight: 'bold', padding: '0.8rem', border: 'none' }}>คำนวณอีกครั้ง</Button>
                            </div>
                        </div>
                    </Col>
                    <Col md={7} className='pl-5 pt-4'>
                        <div className='rounded-4 p-4' style={{ border: '1px solid #ddd', boxShadow: '0 4px 12px rgba(0,0,0,.08)', backgroundColor: 'white' }}>
                            <h3 style={{ fontWeight: 'bold', fontSize: 20, marginBottom: '0.5rem' }}>ผลคำนวณ</h3>
                            <p className='text-muted' style={{ fontSize: 14 }}>ยอดสินเชื่อโดยประมาณ</p>
                            <ProgressBar className='mb-3' style={{ height: '18px', borderRadius: '50px' }}>
                                <ProgressBar now={loanResult.downPaymentRatio} key={1} style={{ backgroundColor: GOLD_COLOR }} label={`${Math.round(loanResult.downPaymentRatio)}%`} />
                                <ProgressBar now={loanResult.principalRatio} key={2} style={{ backgroundColor: BLUE_COLOR }} label={`${Math.round(loanResult.principalRatio)}%`} />
                            </ProgressBar>
                            <div className='d-flex justify-content-between align-items-center mb-4'>
                                <div className='d-flex align-items-center'>
                                    <span style={{ height: '12px', width: '12px', backgroundColor: GOLD_COLOR, borderRadius: '50%', marginRight: '8px' }}></span>
                                    <span style={{ fontWeight: 'bold', fontSize: 16 }}>฿ {formatCurrency(loanResult.downpayment)} ดาวน์</span>
                                </div>
                                <div className='d-flex align-items-center'>
                                    <span style={{ height: '12px', width: '12px', backgroundColor: BLUE_COLOR, borderRadius: '50%', marginRight: '8px' }}></span>
                                    <span style={{ fontWeight: 'bold', fontSize: 16 }}>฿ {formatCurrency(loanResult.loanAmount)} กู้</span>
                                </div>
                            </div>
                            <div style={{ marginBottom: '1rem', fontSize: 22, fontWeight: 'bold' }}>฿ {formatCurrency(loanResult.monthlyPayment)}</div>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <div style={{ minWidth: '200px' }}><strong>ระยะเวลากู้:</strong> {loanResult.months} เดือน</div>
                                <div style={{ minWidth: '200px' }}><strong>รวมชำระ:</strong> ฿ {formatCurrency(loanResult.totalPayment)}</div>
                            </div>
                            <p className='text-muted' style={{ fontSize: 14, marginTop: '1.5rem' }}>ข้อมูลสำหรับอ้างอิงเท่านั้น</p>
                        </div>
                    </Col>
                </Row>
                </div>
            </div>
        </div>
    );
};

export default ProInfo;

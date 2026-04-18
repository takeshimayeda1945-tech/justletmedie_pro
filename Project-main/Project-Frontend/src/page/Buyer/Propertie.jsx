// นำเข้า React และ hooks ต่าง ๆ
import React, { useState, useEffect } from 'react';

// นำเข้าคอมโพเนนต์ modal สำหรับเลือกประเภท (Category) และช่วงราคา (Price)
import CategoryModal from '../../componants/CategoryModal';
import PriceModal from '../../componants/PriceModal';

// นำเข้าคอมโพเนนต์การ์ดแสดงอสังหา และกล่องค้นหา
import PropertyCard from '../../componants/PropertyCard';
import SearchBox from '../../componants/SearchBox';

// นำเข้าข้อมูลรายการอสังหาริมทรัพย์จากไฟล์ data
import { properties } from '../../data/propertiesData';

// นำเข้าไฟล์ CSS สำหรับตกแต่งหน้า Propertie
import '../../assets/Propertie.css';

/*
  🏡 คอมโพเนนต์หน้า Propertie (แสดงรายการอสังหาริมทรัพย์)

  - มีระบบค้นหา (search)
  - ฟิลเตอร์ประเภท (category)
  - ฟิลเตอร์ช่วงราคา (min/max)
  - ระบบแบ่งหน้า (pagination)
  - ใช้ modal สำหรับเลือก category และ price
*/

const Propertie = () => {

  /* --------------------------- STATE ต่าง ๆ --------------------------- */

  // เก็บแท็บที่เลือก (เช่น sale / rent)
  const [activeTab, setActiveTab] = useState('sale');

  // เก็บข้อความสำหรับค้นหาใน SearchBox
  const [searchTerm, setSearchTerm] = useState('');

  // ควบคุมการแสดง modal เลือกประเภท (Category)
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // ควบคุมการแสดง modal เลือกช่วงราคา (Price)
  const [showPriceModal, setShowPriceModal] = useState(false);

  // ประเภทที่เลือก (ค่าเริ่มต้นคือ "ทั้งหมด")
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');

  // จำนวนห้องนอน / ห้องน้ำ ที่เลือกจาก SearchBox
  const [bedroomCount, setBedroomCount] = useState(null);
  const [bathroomCount, setBathroomCount] = useState(null);

  // ราคาต่ำสุดและราคาสูงสุดสำหรับการกรอง
  const [maxPrice, setMaxPrice] = useState('');
  const [minPrice, setMinPrice] = useState('');

  /* --------------------------- ฟังก์ชันจัดการ Modal --------------------------- */

  // เมื่อกด Apply ที่ CategoryModal
  const handleCategoryApply = () => {
    setShowCategoryModal(false);
  };

  // เมื่อกด Cancel ที่ CategoryModal
  const handleCategoryCancel = () => {
    setShowCategoryModal(false);
  };

  // เมื่อกด Apply ที่ PriceModal
  const handlePriceApply = () => {
    setShowPriceModal(false);
  };

  // เมื่อกด Cancel ที่ PriceModal
  const handlePriceCancel = () => {
    setShowPriceModal(false);
  };

  // รีเซ็ตตัวกรองทั้งหมดกลับค่าเริ่มต้น
  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('ทั้งหมด');
    setMinPrice('');
    setMaxPrice('');
    setBedroomCount(null);
    setBathroomCount(null);
    setActiveTab('sale');
  };

  /* --------------------------- ฟังก์ชันช่วยประมวลผลราคา --------------------------- */

  // ฟังก์ชันแปลงสตริงราคาให้เป็นตัวเลข (ลบทุกอย่างที่ไม่ใช่ตัวเลข)
  const parsePrice = (priceStr) => {
    if (!priceStr && priceStr !== 0) return 0;
    const num = String(priceStr).replace(/[^0-9.]/g, '');
    return num === '' ? 0 : Number(num);
  };

  /* --------------------------- ฟิลเตอร์ข้อมูลอสังหา --------------------------- */

  const filteredProperties = properties.filter((property) => {
    const priceNum = parsePrice(property.price);

    // ฟิลเตอร์คำค้น
    const q = searchTerm.trim().toLowerCase();
    if (q) {
      const inName = property.name?.toLowerCase().includes(q);
      const inAddress = property.address?.toLowerCase().includes(q);
      const inType = property.type?.toLowerCase().includes(q);
      const inRooms = property.rooms?.toLowerCase().includes(q);
      if (!(inName || inAddress || inType || inRooms)) return false;
    }
/////////////////////////////////////////////////////////////////////////////////////////////
    // ฟิลเตอร์ประเภท
    if (selectedCategory && selectedCategory !== 'ทั้งหมด') {
      if (!property.type || property.type !== selectedCategory) return false;
    }

    // ฟิลเตอร์จำนวนห้อง (bedrooms / bathrooms)
    const parseRooms = (roomsStr) => {
      if (!roomsStr || typeof roomsStr !== 'string') return { bedrooms: null, bathrooms: null };
      // รองรับทั้งภาษาไทยและภาษาอังกฤษ
      const bedMatch = roomsStr.match(/(\d+)\s*(ห้องนอน|Bedroom)/i);
      const bathMatch = roomsStr.match(/(\d+)\s*(ห้องน้ำ|Bathroom)/i);
      const bedrooms = bedMatch ? Number(bedMatch[1]) : (roomsStr.toLowerCase().includes('studio') || roomsStr.includes('สตูดิโอ') ? 0 : null);
      const bathrooms = bathMatch ? Number(bathMatch[1]) : null;
      return { bedrooms, bathrooms };
    };

    const { bedrooms, bathrooms } = parseRooms(property.rooms);

    if (bedroomCount) {
      if (bedroomCount === '5+') {
        if (bedrooms === null || bedrooms < 5) return false;
      } else {
        const want = Number(bedroomCount);
        if (Number.isNaN(want)) {
          // ignore
        } else {
          // treat null (unknown) as 0 (e.g., Studio)
          const actual = bedrooms === null ? 0 : bedrooms;
          if (actual !== want) return false;
        }
      }
    }

    if (bathroomCount) {
      if (bathroomCount === '5+') {
        if (bathrooms === null || bathrooms < 5) return false;
      } else {
        const wantB = Number(bathroomCount);
        if (!Number.isNaN(wantB)) {
          const actualB = bathrooms === null ? 0 : bathrooms;
          if (actualB !== wantB) return false;
        }
      }
    }

    // ฟิลเตอร์ราคาต่ำสุด
    if (minPrice !== '' && !Number.isNaN(Number(minPrice))) {
      if (priceNum < Number(minPrice)) return false;
    }

    // ฟิลเตอร์ราคาสูงสุด
    if (maxPrice !== '' && !Number.isNaN(Number(maxPrice))) {
      if (priceNum > Number(maxPrice)) return false;
    }

    return true; // ผ่านทุกเงื่อนไข → แสดงได้
  });

  /* --------------------------- การแบ่งหน้า (Pagination) --------------------------- */

  const [currentPage, setCurrentPage] = useState(1); // เก็บหน้าปัจจุบัน
  const itemsPerPage = 6; // จำนวนการ์ดที่แสดงต่อหน้า

  // blockStart = หน้าเริ่มต้นของกลุ่มปุ่มเลขหน้า
  const [blockStart, setBlockStart] = useState(1);
  const blockSize = 9; // จำนวนปุ่มเลขหน้าที่แสดงสูงสุดใน 1 ชุด

  // เมื่อมีการเปลี่ยน search/category/price → ให้กลับไปหน้าแรก
  useEffect(() => {
    setCurrentPage(1);
    setBlockStart(1);
  }, [searchTerm, selectedCategory, minPrice, maxPrice]);

  // คำนวณจำนวนหน้าทั้งหมด
  const totalPages = Math.max(1, Math.ceil(filteredProperties.length / itemsPerPage));

  // คำนวณข้อมูลที่จะใช้แสดงเฉพาะหน้าปัจจุบัน
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProperties = filteredProperties.slice(startIndex, endIndex);

  // lastBlockStart = จุดเริ่มต้นกลุ่มปุ่มหน้าในบล็อกสุดท้าย
  const lastBlockStart = Math.max(1, totalPages - (blockSize - 1));

  // อัปเดต blockStart เพื่อทำให้เลขหน้าอยู่กึ่งกลางตาม currentPage
  useEffect(() => {
    let newStart = currentPage - 4;
    if (newStart < 1) newStart = 1;
    if (newStart > lastBlockStart) newStart = lastBlockStart;
    setBlockStart(newStart);
  }, [currentPage, lastBlockStart]);

  /* --------------------------- UI ของหน้า Propertie --------------------------- */
///////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <div className="propertie-page">

      {/* Modal เลือกประเภท */}
      <CategoryModal
        show={showCategoryModal}
        onClose={handleCategoryCancel}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onApply={handleCategoryApply}
      />

      {/* Modal เลือกช่วงราคา */}
      <PriceModal
        show={showPriceModal}
        onClose={handlePriceCancel}
        maxPrice={maxPrice}
        minPrice={minPrice}
        onMaxPriceChange={setMaxPrice}
        onMinPriceChange={setMinPrice}
        onApply={handlePriceApply}
      />

      <div>

        {/* Hero Section */}
        <div className="hero">
          <div className="hero-content">
            <h1>Find Your Dream Home</h1>
            <h4>Luxury Real Estate Tailored For You</h4>
          </div>
        </div>

        {/* แถบค้นหา */}
        <div className="search-section">
          <SearchBox
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryClick={() => setShowCategoryModal(true)}
            onPriceClick={() => setShowPriceModal(true)}
            onReset={handleReset}
            bedroomCount={bedroomCount}
            setBedroomCount={setBedroomCount}
            bathroomCount={bathroomCount}
            setBathroomCount={setBathroomCount}
          />
        </div>

        {/* แสดงรายการอสังหา */}
        <div className="container">
          {paginatedProperties.length > 0 ? (
            paginatedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))
          ) : (
            <div className="no-results">No properties found.</div>
          )}

          {/* --------------------------- ปุ่ม Pagination --------------------------- */}
          <div className="pagination" style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap', alignItems: 'center' }}>

            {/* ปุ่มย้อนกลับ (Previous) */}
            {currentPage > 1 && (
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                title="Previous page"
                style={{
                  padding: '6px 10px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  background: '#fff',
                  cursor: 'pointer'
                }}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
            )}

            {/* แสดงเลขหน้า 1 ถ้า blockStart > 1 */}
            {blockStart > 1 && (
              <>
                <button
                  onClick={() => {
                    setCurrentPage(1);
                    setBlockStart(1);
                  }}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '4px',
                    border: 1 === currentPage ? '2px solid #333' : '1px solid #ccc',
                    background: 1 === currentPage ? '#eee' : '#fff',
                    cursor: 'pointer'
                  }}
                >
                  1
                </button>
                <span style={{ padding: '6px 8px' }}>...</span>
              </>
            )}

            {/* แสดงเลขหน้าแบบ block */}
            {Array.from({ length: Math.min(blockSize, totalPages - blockStart + 1) }, (_, i) => blockStart + i).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '4px',
                  border: page === currentPage ? '2px solid #333' : '1px solid #ccc',
                  background: page === currentPage ? '#eee' : '#fff',
                  cursor: 'pointer'
                }}
              >
                {page}
              </button>
            ))}

            {/* แสดง ... และปุ่มไปหน้าสุดท้าย */}
            {blockStart + blockSize - 1 < totalPages && (
              <>
                <span style={{ padding: '6px 8px' }}>...</span>

                <button
                  onClick={() => {
                    setCurrentPage(totalPages);
                    setBlockStart(lastBlockStart);
                  }}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '4px',
                    border: totalPages === currentPage ? '2px solid #333' : '1px solid #ccc',
                    background: totalPages === currentPage ? '#eee' : '#fff',
                    cursor: 'pointer'
                  }}
                >
                  {totalPages}
                </button>

                {/* ปุ่มข้ามไปข้างหน้า */}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 4))}
                  title="Next pages"
                  style={{
                    padding: '6px 10px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    background: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Propertie;

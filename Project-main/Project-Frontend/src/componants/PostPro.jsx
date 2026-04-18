import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from 'react-router-dom';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import swal from 'sweetalert';

// ---------- Styled Components ---------- //
const Container = styled.div`
  display: flex;
  gap: 20px;
  padding: 40px;
  background-color: #f8f9fa;
  font-family: "Poppins", sans-serif;
`;

const FormCard = styled.div`
  flex: 1;
  background: #fff;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const MapCard = styled(FormCard)`
  flex: 0.9;
`;

const Title = styled.h2`
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-weight: 500;
  font-size: 0.9rem;
  display: block;
  margin-top: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 6px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-top: 6px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const Row = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
  > div {
    flex: 1;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  height: 100px;
  margin-top: 6px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const CancelBtn = styled.button`
  background: #adb5bd;
  border: none;
  padding: 10px 20px;
  color: #fff;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background: #868e96;
  }
`;

const ConfirmBtn = styled.button`
  background: #d4a017;
  border: none;
  padding: 10px 20px;
  color: #fff;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background: #b8860b;
  }
`;

// ---------- Image Upload Components ---------- //
const FileInput = styled.input`
  display: none;
`;

const UploadArea = styled.div`
  border: 2px dashed #ddd;
  border-radius: 10px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: ${props => props.$isDragOver ? '#f8f9fa' : '#fff'};
  border-color: ${props => props.$isDragOver ? '#d4a017' : '#ddd'};

  &:hover {
    border-color: #d4a017;
    background-color: #f8f9fa;
  }
`;

const UploadIcon = styled.div`
  font-size: 2rem;
  color: #d4a017;
  margin-bottom: 10px;
`;

const UploadText = styled.p`
  color: #666;
  margin: 0;
  font-size: 0.9rem;
`;

const UploadButton = styled.button`
  background: #d4a017;
  border: none;
  padding: 8px 16px;
  color: #fff;
  font-weight: 500;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  transition: 0.3s;
  &:hover {
    background: #b8860b;
  }
`;

const ImagePreviewContainer = styled.div`
  margin-top: 15px;
`;

const ImagePreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
  margin-top: 10px;
`;

const ImagePreview = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 1;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(255, 0, 0, 0.8);
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  transition: 0.3s;

  &:hover {
    background: rgba(255, 0, 0, 1);
  }
`;

const ImageCount = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-top: 5px;
  text-align: center;
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 5px;
  text-align: center;
  white-space: pre-line;
`;

// ---------- Google Map Setup ---------- //
const MapContainer = styled.div`
  width: 100%;
  height: 300px;
  border-radius: 10px;
  overflow: hidden;
`;

const MapEmbed = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

const MapLoading = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
`;

const PostProperty = () => {
  const [marker, setMarker] = useState({ lat: 13.7563, lng: 100.5018 });
  const [images, setImages] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [mapInstance, setMapInstance] = useState(null);
  const [name, setName] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [saleType, setSaleType] = useState('');
  const [landSize, setLandSize] = useState('');
  const [floor, setFloor] = useState('');
  const [bedrooms, setBedrooms] = useState('0');
  const [bathrooms, setBathrooms] = useState('0');
  const [dateValue, setDateValue] = useState('');
  const [address, setAddress] = useState('');
  const [priceSale, setPriceSale] = useState('');
  const [priceRent, setPriceRent] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey,
    libraries: ['places']
  });

  // ฟังก์ชันตรวจสอบประเภทไฟล์ (ไม่รับ GIF)
  const isValidImageType = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    return allowedTypes.includes(file.type);
  };

  // ฟังก์ชันจัดการการอัพโหลดไฟล์
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    handleImageFiles(files);
    // รีเซ็ต input เพื่อให้สามารถเลือกไฟล์เดิมได้อีกครั้ง
    event.target.value = '';
  };

  // ฟังก์ชันจัดการไฟล์ภาพ
  const handleImageFiles = (files) => {
    setUploadError('');
    
    const validFiles = files.filter(file => {
      if (!isValidImageType(file)) {
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        return false;
      }
      return true;
    });

    const invalidFiles = files.filter(file => !isValidImageType(file));
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);

    if (invalidFiles.length > 0) {
      setUploadError(`ไฟล์ต่อไปนี้ไม่รองรับ: ${invalidFiles.map(f => f.name).join(', ')} (รองรับเฉพาะ JPG, PNG, WebP)`);
    }

    if (oversizedFiles.length > 0) {
      setUploadError(prev => prev + 
        (prev ? '\n' : '') + 
        `ไฟล์ต่อไปนี้มีขนาดใหญ่เกิน 5MB: ${oversizedFiles.map(f => f.name).join(', ')}`
      );
    }

    if (validFiles.length === 0) {
      return;
    }

    const newImages = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      type: file.type
    }));

    setImages(prev => {
      const updatedImages = [...prev, ...newImages];
      return updatedImages.slice(0, 10); // จำกัดสูงสุด 10 รูป
    });
  };

  // ฟังก์ชันลบรูปภาพ
  const removeImage = (index) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview); // ล้าง memory
      newImages.splice(index, 1);
      return newImages;
    });
  };

  // ฟังก์ชันจัดการ Drag and Drop
  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const files = Array.from(event.dataTransfer.files);
    handleImageFiles(files);
  };

  // ฟังก์ชันเปิด file dialog
  const openFileDialog = () => {
    document.getElementById('file-input').click();
  };

  const handleConfirmClick = async () => {
    if (images.length === 0) {
      swal("คำเตือน", "กรุณาอัพโหลดรูปภาพอย่างน้อย 1 รูป", "warning");
      return;
    }

    if (!name.trim() || !address.trim() || !propertyType || !saleType) {
      swal("คำเตือน", "กรุณากรอกข้อมูลให้ครบทุกช่องที่สำคัญ", "warning");
      return;
    }

    if (saleType === 'ขาย' && !priceSale.trim()) {
      swal("คำเตือน", "กรุณากรอกราคาเพื่อขาย", "warning");
      return;
    }

    if (saleType === 'เช่า' && !priceRent.trim()) {
      swal("คำเตือน", "กรุณากรอกราคาเพื่อเช่า", "warning");
      return;
    }

    const confirmed = await swal({
      title: "ยืนยันการโพสต์",
      text: "คุณแน่ใจหรือว่าต้องการโพสต์ประกาศนี้?",
      icon: "warning",
      buttons: ["ยกเลิก", "ยืนยัน"],
      dangerMode: true,
    });

    if (!confirmed) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData()
      formData.append('name', name.trim())
      formData.append('address', address.trim())
      formData.append('priceSale', saleType === 'ขาย' ? priceSale.trim() : '')
      formData.append('priceRent', saleType === 'เช่า' ? priceRent.trim() : '')
      formData.append('type', propertyType)
      formData.append('saleType', saleType)
      formData.append('landSize', landSize.trim())
      formData.append('floor', floor.trim())
      formData.append('bedrooms', bedrooms)
      formData.append('bathrooms', bathrooms)
      formData.append('description', description.trim())
      formData.append('latitude', String(marker.lat))
      formData.append('longitude', String(marker.lng))

      images.forEach((imageFile, index) => {
        if (imageFile.file) {
          formData.append('images', imageFile.file)
        }
      })

      const response = await fetch('http://localhost:3000/api/properties', {
        method: 'POST',
        body: formData
      })

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'เกิดข้อผิดพลาดในการโพสต์ข้อมูล');
      }

      swal("สำเร็จ!", "ประกาศของคุณถูกโพสต์เรียบร้อยแล้ว", "success");
      setTimeout(() => {
        navigate('/seller/homeseller');
      }, 1500);
    } catch (error) {
      swal("ไม่สำเร็จ", error.message || 'เกิดข้อผิดพลาด', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.4669646932744!2d${marker.lng}!3d${marker.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTMuNzU2MiDCsDUwJzEwLjciTiAxMDAuNTAxOCDCsDMwJzAuNiJF!5e0!3m2!1sth!2sth!4v1234567890`;

  return (
    <Container>
      {/* Left Form */}
      <FormCard>
        <Title>Post Property</Title>
        <Subtitle>
          สร้างและเผยแพร่ประกาศขายหรือให้เช่าทรัพย์สินของคุณ
          กรอกรายละเอียด เช่น ขนาดที่ดิน จำนวนห้อง ราคา และคำอธิบายทรัพย์
          เพื่อดึงดูดผู้ซื้อหรือผู้เช่าที่สนใจ
        </Subtitle>

        {/* Image Upload Section */}
        <Label>อัพโหลดรูปภาพอสังหาริมทรัพย์</Label>
        <UploadArea
          $isDragOver={isDragOver}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <UploadIcon>📷</UploadIcon>
          <UploadText>
            {isDragOver ? "วางรูปภาพที่นี่..." : "คลิกหรือลากรูปภาพมาวางที่นี่"}
          </UploadText>
          <UploadText>รองรับ JPG, PNG, WebP (สูงสุด 5MB ต่อไฟล์)</UploadText>
          <UploadButton type="button">เลือกไฟล์รูปภาพ</UploadButton>
        </UploadArea>

        <FileInput
          id="file-input"
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleFileSelect}
        />

        {/* แสดงข้อความ error */}
        {uploadError && (
          <ErrorMessage>
            {uploadError}
          </ErrorMessage>
        )}

        {/* Image Previews */}
        {images.length > 0 && (
          <ImagePreviewContainer>
            <Label>รูปภาพที่อัพโหลด ({images.length}/10)</Label>
            <ImagePreviewGrid>
              {images.map((image, index) => (
                <ImagePreview key={index}>
                  <PreviewImage 
                    src={image.preview} 
                    alt={`Preview ${index + 1}`}
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02NSA0NUg1NVYzNUg0NVY0NUgzNVY1NUg0NVY2NUg1NVY1NUg2NVY0NVoiIGZpbGw9IiM5OTk5OTkiLz4KPC9zdmc+';
                    }}
                  />
                  <RemoveButton 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    title="ลบรูปภาพ"
                  >
                    ×
                  </RemoveButton>
                </ImagePreview>
              ))}
            </ImagePreviewGrid>
            <ImageCount>
              {images.length} / 10 รูปภาพ
            </ImageCount>
          </ImagePreviewContainer>
        )}

        <Label>ชื่ออสังหา</Label>
        <Input
          placeholder="ใส่ชื่ออสังหา"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Label>ประเภทอสังหา</Label>
        <Select
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
        >
          <option value="">ประเภทอสังหา</option>
          <option value="คอนโดมิเนียม">คอนโดมิเนียม</option>
          <option value="บ้านเดี่ยว">บ้านเดี่ยว</option>
          <option value="บ้านแฝด">บ้านแฝด</option>
          <option value="วิลล่า">วิลล่า</option>
          <option value="ทาวน์เฮ้าส์">ทาวน์เฮ้าส์</option>
          <option value="ที่ดิน">ที่ดิน</option>
          <option value="อพาร์ตเมนต์">อพาร์ตเมนต์</option>
        </Select>

        <Label>ขายหรือเช่า</Label>
        <Select
          value={saleType}
          onChange={(e) => setSaleType(e.target.value)}
        >
          <option value="">ขายหรือเช่า</option>
          <option value="ขาย">ขาย</option>
          <option value="เช่า">เช่า</option>
        </Select>

        <Row>
          <div>
            <Label>ขนาดที่ดิน</Label>
            <Input
              placeholder="ตารางเมตร"
              value={landSize}
              onChange={(e) => setLandSize(e.target.value)}
            />
          </div>
          <div>
            <Label>ชั้น</Label>
            <Input
              type="number"
              min="0"
              placeholder="0"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
            />
          </div>
        </Row>

        <Row>
          <div>
            <Label>ห้องนอน</Label>
            <Select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
            >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </Select>
          </div>
          <div>
            <Label>ห้องน้ำ</Label>
            <Select
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
            >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </Select>
          </div>
        </Row>

        <Row>
          <div>
            <Label>วันที่สร้าง</Label>
            <Input
              type="date"
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
            />
          </div>
        </Row>

        <Label>ที่อยู่</Label>
        <TextArea
          placeholder="ใส่ที่อยู่"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </FormCard>

      {/* Right Column */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
        <MapCard>
          <Title>Google Map</Title>
          <MapContainer>
          {isLoaded ? (
            <GoogleMap
              key={`${marker.lat}-${marker.lng}`}
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={marker}
              zoom={14}
              onLoad={(map) => setMapInstance(map)}
              onUnmount={() => setMapInstance(null)}
              onClick={(event) => {
                if (event.latLng) {
                  setMarker({
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng()
                  });
                }
              }}
              options={{
                disableDefaultUI: true,
                clickableIcons: false
              }}
            >
              <Marker
                position={marker}
                draggable={true}
                onDragEnd={(event) => {
                  if (event.latLng) {
                    setMarker({
                      lat: event.latLng.lat(),
                      lng: event.latLng.lng()
                    });
                  }
                }}
              />
            </GoogleMap>
          ) : (
            <MapLoading>Loading map…</MapLoading>
          )}
        </MapContainer>
        <Label>ตำแหน่งพิกัด</Label>
        <Subtitle>
          Lat: {marker.lat.toFixed(6)} | Lng: {marker.lng.toFixed(6)}
        </Subtitle>
        </MapCard>

        <FormCard>
          <Label>ราคาอสังหา (สำหรับขาย)</Label>
          <Input
            type="number"
            placeholder="ใส่ราคา"
            value={priceSale}
            onChange={(e) => setPriceSale(e.target.value)}
            disabled={saleType === 'เช่า'}
          />

          <Label>ราคาอสังหา (สำหรับเช่า)</Label>
          <Input
            type="number"
            placeholder="ใส่ราคา"
            value={priceRent}
            onChange={(e) => setPriceRent(e.target.value)}
            disabled={saleType === 'ขาย'}
          />

          <Label>คำอธิบายอสังหา</Label>
          <TextArea
            placeholder="ใส่คำอธิบายอสังหา"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <ButtonRow>
            <CancelBtn as={Link} to="/seller/homeseller">Cancel</CancelBtn>
            <ConfirmBtn onClick={handleConfirmClick} disabled={isSubmitting}>
              {isSubmitting ? 'กำลังส่ง...' : 'Confirm Sale'}
            </ConfirmBtn>
          </ButtonRow>
        </FormCard>
      </div>
    </Container>
  );
};

export default PostProperty;
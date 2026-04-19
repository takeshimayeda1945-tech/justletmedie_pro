import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from 'react-router-dom';
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

// ---------- Main Component ---------- //
const PostProperty = () => {
  const [marker, setMarker] = useState({ lat: 13.7563, lng: 100.5018 });
  const [images, setImages] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const navigate = useNavigate();

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

  const handleConfirmClick = () => {
    if (images.length === 0) {
      swal("คำเตือน", "กรุณาอัพโหลดรูปภาพอย่างน้อย 1 รูป", "warning");
      return;
    }

    swal(
      "ยืนยันการโพสต์",
      "คุณแน่ใจหรือว่าต้องการโพสต์ประกาศนี้?",
      "warning",
      {
        buttons: {
          cancel: "ยกเลิก",
          confirm: "ยืนยัน"
        }
      }
    ).then((value) => {
      if (value) {
        // ในที่นี้คุณสามารถส่งข้อมูล images ไปยัง backend ได้
        console.log('Images to upload:', images);
        
        swal(
          "สำเร็จ!",
          "ประกาศของคุณถูกโพสต์เรียบร้อยแล้ว",
          "success"
        );
        setTimeout(() => {
          navigate("/seller/homeseller");
        }, 1500);
      }
    });
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
        <Input placeholder="ใส่ชื่ออสังหา" />

        <Label>ประเภทอสังหา</Label>
        <Select>
          <option>ประเภทอสังหา</option>
          <option>คอนโด</option>
          <option>บ้านเดี่ยว</option>
          <option>บ้านแฝด</option>
          <option>วิลล่า</option>
          <option>ทาวน์เฮ้าส์</option>
          <option>ที่ดิน</option>
          <option>อพาร์ทเมนท์</option>
        </Select>

        <Label>ขายหรือเช่า</Label>
        <Select>
          <option>ขายหรือเช่า</option>
          <option>ขาย</option>
          <option>เช่า</option>
        </Select>

        <Row>
          <div>
            <Label>ขนาดที่ดิน</Label>
            <Input placeholder="ตารางเมตร" />
          </div>
          <div>
            <Label>ชั้น</Label>
            <Input type="number" min="0" placeholder="0"/>
          </div>
        </Row>

        <Row>
          <div>
            <Label>ห้องนอน</Label>
            <Select>
              <option>0</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </Select>
          </div>
          <div>
            <Label>ห้องน้ำ</Label>
            <Select>
              <option>0</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </Select>
          </div>
        </Row>

        <Row>
          <div>
            <Label>วันที่สร้าง</Label>
            <Input type="date" placeholder="DD/MM/YYYY" />
          </div>
        </Row>

        <Label>ที่อยู่</Label>
        <TextArea placeholder="ใส่ที่อยู่" />
      </FormCard>

      {/* Right Column */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
        <MapCard>
          <Title>Google Map</Title>
          <MapContainer>
            <MapEmbed
              src={mapUrl}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></MapEmbed>
          </MapContainer>
        </MapCard>

        <FormCard>
          <Label>ราคาอสังหา (สำหรับขาย)</Label>
          <Input type="number" placeholder="ใส่ราคา" />

          <Label>ราคาอสังหา (สำหรับเช่า)</Label>
          <Input type="number" placeholder="ใส่ราคา" />

          <Label>คำอธิบายอสังหา</Label>
          <TextArea placeholder="ใส่คำอธิบายอสังหา" />

          <ButtonRow>
            <CancelBtn as={Link} to="/seller/homeseller">Cancel</CancelBtn>
            <ConfirmBtn onClick={handleConfirmClick}>Confirm Sale</ConfirmBtn>
          </ButtonRow>
        </FormCard>
      </div>
    </Container>
  );
};

export default PostProperty;
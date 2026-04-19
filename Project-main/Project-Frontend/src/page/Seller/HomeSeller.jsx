import React, { useState } from "react";
import styled from "styled-components";
import { Link } from 'react-router-dom';
import { SellerData } from "../../data/SellerData";

// ---------- Styled Components ---------- //
const PageWrapper = styled.div`
  font-family: "Poppins", sans-serif;
  background-color: #f7f7f7;
  color: #333;
  position: relative;
`;

const HeroSection = styled.section`
  position: relative;
  background-image: url("https://images.unsplash.com/photo-1501183638710-841dd1904471");
  background-size: cover;
  background-position: center;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
  }

  > * {
    position: relative;
    z-index: 2;
  }
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
`;

const HeroSubtitle = styled.h2`
  font-size: 1.2rem;
  color: #ffcc33;
  margin: 10px 0 20px;
`;

const HeroButton = styled.button`
  background-color: #c79b2f;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 25px;
  padding: 12px 32px;
  cursor: pointer;
  font-size: 1rem;
  transition: 0.3s;

  &:hover {
    background-color: #a67c00;
  }
`;

const Section = styled.section`
  padding: 40px 5%;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
`;

const MoreDetail = styled.a`
  font-size: 0.9rem;
  color: #666;
  cursor: pointer;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: 0.3s;
  text-decoration: none;
  color: inherit;

  &:hover {
    transform: translateY(-5px);
  }

  &[href],
  &.link {
    text-decoration: none;
    color: inherit;
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 15px;
`;

const CardTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 5px;
`;

const CardDesc = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 10px;
`;

const CardPrice = styled.p`
  font-weight: 600;
  color: #000;
`;

// ---------- ADS Components ---------- //
const AdsContainer = styled.div`
  position: fixed;
  top: 50%;
  ${props => props.$position === 'right' ? 'right: 20px;' : 'left: 20px;'}
  transform: translateY(-50%);
  width: 280px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.$color};

  ${props => !props.$isVisible && `
    opacity: 0;
    visibility: hidden;
    transform: translateY(-50%) ${props.$position === 'right' ? 'translateX(100%)' : 'translateX(-100%)'};
  `}
`;

const AdsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(135deg, ${props => props.$color}, ${props => props.$darkColor});
  color: white;
`;

const AdsTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const AdsContent = styled.div`
  padding: 20px;
`;

const AdsImage = styled.img`
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 12px;
`;

const AdsDescription = styled.p`
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 15px;
  line-height: 1.4;
`;

const AdsButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, ${props => props.$color}, ${props => props.$darkColor});
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.$shadowColor};
  }
`;

const ShowAdsButton = styled.button`
  position: fixed;
  top: 50%;
  ${props => props.$position === 'right' ? 'right: 20px;' : 'left: 20px;'}
  transform: translateY(-50%);
  background: ${props => props.$color};
  color: white;
  border: none;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  cursor: pointer;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.$darkColor};
    transform: translateY(-50%) scale(1.1);
  }

  ${props => props.$isVisible && `
    opacity: 0;
    visibility: hidden;
  `}
`;

// ADS Data for both sides
const adsData = {
  right: {
    title: "🏠 โปรโมชั่นพิเศษ!",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80",
    description: "คอนโดหรูใจกลางเมือง เริ่มต้นเพียง 2.9 ล้านบาท! พิเศษสำหรับลูกค้าใหม่ รับส่วนลดค่าโอนฟรี!",
    buttonText: "ดูรายละเอียด",
    link: "/seller/sellerpropertyinfo/12",
    color: "#c79b2f",
    darkColor: "#a67c00",
    shadowColor: "rgba(199, 155, 47, 0.3)"
  },
  left: {
    title: "🔥 ด่วน! บ้านลดราคา",
    image: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=600&q=80",
    description: "บ้านเดี่ยวสวยงามในทำเลทอง ลดราคาพิเศษ 20% สำหรับเดือนนี้เท่านั้น! จองด่วนก่อนหมด!",
    buttonText: "สนใจดูบ้าน",
    link: "/seller/sellerpropertyinfo/18",
    color: "#e74c3c",
    darkColor: "#c0392b",
    shadowColor: "rgba(231, 76, 60, 0.3)"
  }
};

const PostPropertyButton = styled(Link)`
  position: fixed;
  bottom: 30px;
  right: 30px;
  background-color: #10a4d1ff;
  color: white;
  padding: 12px 20px;
  border-radius: 30px;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s, transform 0.3s;
  &:hover {
    background-color: #0d7ba8ff;
    transform: translateY(-3px);
  }
  text-decoration: none;
`;

const PlusIcon = styled.span`
  font-size: 1.4rem;
  line-height: 1;
`;

// Property Card Component
const PropertyCard = ({ property }) => (
  <Card as={Link} to={`/seller/sellerpropertyinfo/${property.id}`}>
    <CardImage src={property.image} alt={property.name}/>
    <CardContent>
      <CardTitle>{property.name}</CardTitle>
      <CardDesc>{property.rooms}</CardDesc>
      <CardDesc>{property.address}</CardDesc>
      <CardPrice>{property.price}</CardPrice>
    </CardContent>
  </Card>
);

// Property Grid Component
const PropertyGrid = ({ SellerData, limit }) => {
  const displayedProperties = limit ? SellerData.slice(0, limit) : SellerData;
  return (
    <>
      {displayedProperties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </>
  );
};

// ---------- Main Component ---------- //
const HomeSeller = () => {
  const [adsVisibility, setAdsVisibility] = useState({
    right: true,
    left: true
  });

  const handleCloseAds = (position) => {
    setAdsVisibility(prev => ({
      ...prev,
      [position]: false
    }));
  };

  const handleShowAds = (position) => {
    setAdsVisibility(prev => ({
      ...prev,
      [position]: true
    }));
  };

  // Filter properties by type (ใช้ข้อมูลจาก properties ที่ import มา)
  const condoProperties = SellerData.filter(property => property.type === "คอนโดมิเนียม");
  const houseProperties = SellerData.filter(property => property.type === "บ้านเดี่ยว");
  const villaProperties = SellerData.filter(property => property.type === "วิลล่า");
  const townhouseProperties = SellerData.filter(property => property.type === "ทาวน์เฮ้าส์");
  const apartmentProperties = SellerData.filter(property => property.type === "อพาร์ตเมนต์");

  return (
    <PageWrapper>
      {/* Right ADS */}
      <AdsContainer 
        $isVisible={adsVisibility.right} 
        $position="right"
        $color={adsData.right.color}
      >
        <AdsHeader $color={adsData.right.color} $darkColor={adsData.right.darkColor}>
          <AdsTitle>{adsData.right.title}</AdsTitle>
          <CloseButton onClick={() => handleCloseAds('right')}>×</CloseButton>
        </AdsHeader>
        <AdsContent>
          <AdsImage src={adsData.right.image} alt="SellerPropertyinfo" />
          <AdsDescription>{adsData.right.description}</AdsDescription>
          <AdsButton 
            as={Link} 
            to={adsData.right.link}
            $color={adsData.right.color}
            $darkColor={adsData.right.darkColor}
            $shadowColor={adsData.right.shadowColor}
          >
            {adsData.right.buttonText}
          </AdsButton>
        </AdsContent>
      </AdsContainer>

      {/* Left ADS */}
      <AdsContainer 
        $isVisible={adsVisibility.left} 
        $position="left"
        $color={adsData.left.color}
      >
        <AdsHeader $color={adsData.left.color} $darkColor={adsData.left.darkColor}>
          <AdsTitle>{adsData.left.title}</AdsTitle>
          <CloseButton onClick={() => handleCloseAds('left')}>×</CloseButton>
        </AdsHeader>
        <AdsContent>
          <AdsImage src={adsData.left.image} alt="sellerpropertyinfo" />
          <AdsDescription>{adsData.left.description}</AdsDescription>
          <AdsButton 
            as={Link} 
            to={adsData.left.link}
            $color={adsData.left.color}
            $darkColor={adsData.left.darkColor}
            $shadowColor={adsData.left.shadowColor}
          >
            {adsData.left.buttonText}
          </AdsButton>
        </AdsContent>
      </AdsContainer>

      {/* Show Right ADS Button */}
      <ShowAdsButton 
        $isVisible={adsVisibility.right} 
        $position="right"
        $color={adsData.right.color}
        $darkColor={adsData.right.darkColor}
        onClick={() => handleShowAds('right')}
        title="แสดงโฆษณาขวา"
      >
        📢
      </ShowAdsButton>

      {/* Show Left ADS Button */}
      <ShowAdsButton 
        $isVisible={adsVisibility.left} 
        $position="left"
        $color={adsData.left.color}
        $darkColor={adsData.left.darkColor}
        onClick={() => handleShowAds('left')}
        title="แสดงโฆษณาซ้าย"
      >
        📢
      </ShowAdsButton>

      <HeroSection>
        <HeroTitle>Find Your Dream Home</HeroTitle>
        <HeroSubtitle>Luxury Real Estate Tailored For You</HeroSubtitle>
        <HeroButton as={Link} to="/seller/property">VIEW PROPERTIES</HeroButton>
      </HeroSection>

      {/* Recommended Properties Section */}
      <Section>
        <SectionHeader>
          <SectionTitle>Recommended Properties</SectionTitle>
          <MoreDetail as={Link} to="/seller/property">more detail</MoreDetail>
        </SectionHeader>
        <CardGrid>
            <PropertyGrid SellerData={SellerData.slice(0, 4)} />
        </CardGrid>
      </Section>

      {/* Condos Section */}
      <Section>
        <SectionHeader>
          <SectionTitle>Condos</SectionTitle>
          <MoreDetail as={Link} to="/seller/property?type=คอนโดมิเนียม">more detail</MoreDetail>
        </SectionHeader>
        <CardGrid>
            <PropertyGrid SellerData={condoProperties.slice(0, 4)} />
        </CardGrid>
      </Section>

      {/* Houses Section */}
      <Section>
        <SectionHeader>
          <SectionTitle>Houses</SectionTitle>
          <MoreDetail as={Link} to="/seller/property?type=บ้านเดี่ยว">more detail</MoreDetail>
        </SectionHeader>
        <CardGrid>
            <PropertyGrid SellerData={houseProperties.slice(0, 4)} />
        </CardGrid>
      </Section>

      {/* Villas Section */}
      <Section>
        <SectionHeader>
          <SectionTitle>Villas</SectionTitle>
          <MoreDetail as={Link} to="/seller/property?type=วิลล่า">more detail</MoreDetail>
        </SectionHeader>
        <CardGrid>
            <PropertyGrid SellerData={villaProperties.slice(0, 4)} />
        </CardGrid>
      </Section>

      {/* Townhouses Section */}
      <Section>
        <SectionHeader>
          <SectionTitle>Townhouses</SectionTitle>
          <MoreDetail as={Link} to="/seller/property?type=ทาวน์เฮ้าส์">more detail</MoreDetail>
        </SectionHeader>
        <CardGrid>
            <PropertyGrid SellerData={townhouseProperties.slice(0, 4)} />
        </CardGrid>
      </Section>

      {/* โพสต์ประกาศขาย */}
      <PostPropertyButton to="/seller/postproperty">
        <PlusIcon>+</PlusIcon>
        โพสต์ประกาศขาย
      </PostPropertyButton>
    </PageWrapper>
  );
};

export default HomeSeller;

import React from 'react';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  return (
    <Link 
      to={`/buyer/propertydetail/${property.id}`} 
      className="property-card-link" // เพิ่มคลาสสำหรับ styling
      style={{ textDecoration: 'none', color: 'inherit' }} // ลบ underline และสืบทอดสี
    >
      <div className="property-card">
        <img
          src={property.image}
          alt={property.name}
          className="property-image"
        />
        <div className="property-details">
          <div>
            <div className="property-header">
              <div>
                <div className="property-name">{property.name}</div>
                <div className="property-address">
                  <i className="bi bi-geo-alt-fill" aria-hidden="true"></i> {property.address}
                </div>
              </div>
              <div className="property-type-badge">
                <i className="bi bi-house-door" aria-hidden="true"></i> {property.type}
              </div>
            </div>
            <div className="room-size-section">
              <strong>ขนาดห้อง</strong>
              <p>{property.rooms}</p>
            </div>
          </div>
          <div className="property-footer">
            <span className="property-date">วันที่ประกาศ: {property.date}</span>
            <span className="property-price">{property.price}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
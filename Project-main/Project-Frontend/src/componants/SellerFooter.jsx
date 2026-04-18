import React from 'react';
import './SellerFooter.css';
import { Link } from 'react-router-dom';

const SellerFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-links">
          <Link to = {'/seller/policyuse'}>Acceptable Use Policy</Link>
          <Link to = {'/seller/conditionsof'}>Terms of Conditions</Link>
          <Link to = {'/seller/privacypolicy'}>Privacy Policy</Link>
          <Link to = {'/seller/termssale'}>Terms of Sale</Link>
        </div>
        
        <div className="copyright">
          <p>@Copyright {currentYear}</p>
        </div>
      </div>
    </footer>
  );
};

export default SellerFooter;
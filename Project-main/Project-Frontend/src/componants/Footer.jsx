import React from "react";
import "./Footer.css";
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-links">
          <Link to={"/buyer/policy"}>Acceptable Use Policy</Link>
          <Link to={"/buyer/conditions"}>Terms of Conditions</Link>
          <Link to={"/buyer/privacy"}>Privacy Policy</Link>
          <Link to={"/buyer/terms"}>Terms of Sale</Link>
        </div>

        <div className="copyright">
          <p>@Copyright {currentYear}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import './adminnavbar.css'
import logo from './img/levalogo.svg'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from "react";
import tait from './img/taitpattaya.png'
import { Link } from 'react-router-dom';

const AdminNavbar = () => {
    return ( 
    <div className='bg-[#081B44] fontmenu flex justify-between items-center text-white h-20'>
        {/* navbar */}
       <div className="flex items-center space-x-8">
        
        {/* โลโก้ */}
        <div className="p-10">
          <img style={{width:130}} src={logo} alt="" />
        </div>

        {/* เมนูหลัก */}
        <div className="flex items-center space-x-6 gap-5">
          <Link to={'stat'} className='Menu text-white'>Statistics</Link>
          <Link to={'sellerlist'} className='Menu text-white'>Userlist</Link>
          {/* <Link to={'buyerlist'} className='Menu text-white'>BuyerList</Link> */} 
          <Link to={'verify'} className='Menu text-white'>Verify-seller</Link>
        {/* <a href="#" className="Menu text-white">Stats</a>
        <a href="#" className="Menu text-white">Userlist</a>
        <a href="#" className="Menu text-white">Sellerlist</a>
        <a href="#" className="Menu text-white">Verify-seller</a> */}
        </div>
      </div>
       <div className="flex items-center p-10">
        <Link to={'/login'}><button className="text-white btn btn-outline-light rounded-5">Log out</button></Link>
        
      </div>
    </div> 
    );
}
 
export default AdminNavbar;
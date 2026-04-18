import './adminnavbar.css'
import logo from './img/levalogo.svg'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from "react";
import tait from './img/taitpattaya.png'
import { Link } from 'react-router-dom';

const NavBar = () => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <div>
            {/* modal start */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>การแจ้งเตือน</Modal.Title>
                </Modal.Header>
                {/* อาจทำเป็น componants รายการแจ้งเตือน */}
                <div>
                    <div className='m-3'>

                        <h5><b>โครงการใหม่ใกล้ทะเล Tait Pattaya ชลบุรี</b></h5>

                        <p className='fs-6'>โครงการตั้งอยู่ห่างจากทะเลเพียง 300 เมตร พร้อมวิวแบบพาโนรามาของหาดพัทยา
                            Tait Pattaya
                            แลนด์มาร์คแห่งใหม่ริมทะเล
                        </p>
                    </div>

                </div>
                <hr />

            </Modal>
            {/* modal end */}

            <div className='bg-[#081B44] fontmenu flex justify-between items-center text-white h-20'>
                {/* navbar */}
                <div className="flex items-center space-x-8">

                    {/* โลโก้ */}
                    <div className="p-10">
                        <img style={{ width: 130 }} src={logo} alt="" />
                    </div>

                    {/* เมนูหลัก */}
                    <div className="flex items-center space-x-6 gap-5">
                        <Link to={'/buyer/home'} className='Menu text-white'>HOME</Link>
                        <Link to={'/buyer/propertie'} className='Menu text-white'>PROPERTIES</Link>
                        <Link to={'/buyer/tradingguide'} className='Menu text-white'>TRADING GUIDE</Link>

                        {/* <a href="#" className="Menu text-white">HOME</a>
                        <a href="#" className="Menu text-white">PROPERTIES</a>
                        <a href="#" className="Menu text-white">TRADING GUIDE</a> */}
                    </div>
                </div>
                <div className="flex items-center p-10">
                    <button onClick={() => handleShow()}><i className="bi bi-bell fs-3 p-3 "></i></button>
                     <Link to={'/login'}><button className="text-white btn btn-outline-light rounded-5">Log out</button></Link>
                </div>
            </div>
        </div>
    );
}

export default NavBar;
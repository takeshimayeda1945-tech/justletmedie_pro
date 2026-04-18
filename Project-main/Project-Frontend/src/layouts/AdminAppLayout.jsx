import { Outlet } from "react-router-dom";
import NavBar from "../componants/navbar";
import AdminNavbar from "../componants/adminnavbar";

const AdminAppLayout = () => {
    return ( 
    <>
    <AdminNavbar/>
    <Outlet/>
    {/* footer */}
    </> 
    );
}
 
export default AdminAppLayout;
import { Outlet } from "react-router-dom";
import NavBar from "../componants/navbar";
import Footer from "../componants/Footer";

const UserAppLayout = () => {
    return ( 
        <>
            <NavBar/>
            <Outlet/>
            <Footer/>
        </>
     );
}
 
export default UserAppLayout;
import { Outlet } from "react-router-dom";
import NavBarSeller from "../componants/navbarSeller";
import SellerFooter from "../componants/SellerFooter";

const SellerAppLayout = () => {
    return ( 
        <>
            <NavBarSeller/>
            <Outlet/>
            <SellerFooter/>
        </>
     );
}
 
export default SellerAppLayout;
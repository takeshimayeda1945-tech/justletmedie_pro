import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ForwardToLogin = () => {
    const navigate = useNavigate()
    useEffect(() => {
        navigate('../login')
    },[]) //load
    
    return ( 
    <>
    <h2>ForwardToHome</h2>
    </> 
    );
}
 
export default ForwardToLogin;
import { Outlet } from "react-router-dom";
import { Header } from './Header';
import { Footer } from './Footer';
import { useLocation, Navigate } from "react-router-dom";

function MainLayout() {
    let location = useLocation();
    if (location.pathname === "/platform") {   
      return <Navigate to="/platform/contacts" state={{ from: location }} replace />;
    }
    
    return (
        <>
            <Header/>
            <Outlet/>
            <Footer/>
        </>
    )
}


export { MainLayout }
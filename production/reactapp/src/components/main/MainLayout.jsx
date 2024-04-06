import { Outlet } from "react-router-dom";
import { useLocation, Navigate } from "react-router-dom";
import { ScrollRestoration } from "react-router-dom";
import { Header } from './Header';
import { Footer } from './Footer';


function MainLayout() {
    let location = useLocation();
    if (location.pathname === "/platform") {   
      return <Navigate to="/platform/contacts" state={{ from: location }} replace />;
    }
    
    return (
        <>
            <div className="content">
                <Header/>
                <Outlet/>
            </div>
            <Footer className="footer-container"/>
            <ScrollRestoration/>     
        </>
    )
}


export { MainLayout }
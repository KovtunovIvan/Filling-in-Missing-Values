import { Outlet } from "react-router-dom";
import { useLocation, Navigate } from "react-router-dom";
import { ScrollRestoration } from "react-router-dom";

import { Sidebar } from './Sidebar';


function AppLayout() {
    let location = useLocation();
    if (location.pathname === "/app") {   
      return <Navigate to="/app/create" state={{ from: location }} replace />;
    }

    return (
        <div className='app-wrapper'>
            <Sidebar/>
            <div className='workspace'>
                <Outlet/>
            </div>
            <ScrollRestoration/> 
        </div>
    )
}


export { AppLayout }
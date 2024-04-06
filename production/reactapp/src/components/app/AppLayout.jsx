import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { ScrollRestoration } from "react-router-dom";

import { Sidebar } from './Sidebar';


function AppLayout() {
    const currentUser = useSelector((state) => state.userData);
    console.log(currentUser.email);

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
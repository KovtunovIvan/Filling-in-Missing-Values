import logo from '../logo.svg';
import { Outlet, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { logout } from "../api/userApi";
import { LocalStorageTools } from "../localStorage";


function AppLayout() {
    const currentUser = useSelector((state) => state.userData);

    return (
        <div>
            <h1>User: { currentUser.email }</h1>
            <Sidebar/>
            <Outlet/>
        </div>
    )
}

function Sidebar() {
    const hendleLogout = () => {
        const tokens = LocalStorageTools.getItemFromLocalStorage('tokens');
        logout(tokens.refresh);
      }

    return (
        <div>
            <Link to='/platform' className='header-logo'>
                <img src={logo} height="60" alt="logo" />
            </Link>
            <div>
                <Link to='/app' className=''>
                        Загрузить
                </Link>
            </div>
            <div>
                <Link to='projects'>
                        Проекты
                </Link>
            </div>
            <div>
                <Link to='profile'>
                        Профиль
                </Link>
            </div>
            <div>
                <Link to='settings'>
                        Настройки
                </Link>
            </div>
            <div>
                <Link to='/' onClick={hendleLogout}>
                        Выйти
                </Link>
            </div>

        </div>
    )
}
export { AppLayout }
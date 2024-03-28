import logo from '../logo.svg';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <div className='header-back'>
            <div className='container header-nav'>
                <Link to='/' className='header-logo'>
                    <img src={logo} height="60" alt="logo" />
                </Link>
                <Navbar/>
            </div>
        </div>
    )
}

function Navbar() {
    return (
        <div className='header-navbar'>
            <Link to='/' className='header-navitem'>
                О сервисе
            </Link>
            <Link to='/platform/guide' className='header-navitem'>
                Документация
            </Link>
            <Link to='/platform/contacts' className='header-navitem'>
                Контакты
            </Link>
            <Link to='/platform/demo' className='header-navitem'>
                ДЕМО
            </Link>
            <Link to='/u/login' className='header-navitem'>
                ВОЙТИ
            </Link>
        </div>
    )
}

export { Header };
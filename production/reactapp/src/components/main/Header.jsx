import logo from '../../theme/img/logo/logo.svg';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <div className='header-wrapper'>
            <div className='wrapper header-nav'>
                <Link to='/' className='header-logo'>
                    <img 
                        src={logo} 
                        height="60" 
                        alt="logo" 
                    />
                </Link>
                <Navbar/>
            </div>
        </div>
    )
}

function Navbar() {
    return (
        <div className='header__navbar'>
            <Link to='/' className='header__navitem'>
                О сервисе
            </Link>
            <Link to='/platform/guide' className='header__navitem'>
                Документация
            </Link>
            <Link to='/platform/contacts' className='header__navitem'>
                Контакты
            </Link>
            <Link to='/platform/demo' className='header__navitem'>
                ДЕМО
            </Link>
            <Link to='/u/login' className='header__navitem header__navitem_login'>
                ВОЙТИ
            </Link>
        </div>
    )
}

export { Header };
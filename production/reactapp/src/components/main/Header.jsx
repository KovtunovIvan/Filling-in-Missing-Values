import logo from '../../theme/img/logo/logo.svg';
import { Link } from 'react-router-dom';
import '../../theme/styles/header.css';
import menu_icon from '../../theme/img/main/hamburger.svg'
import { useRef, useState } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';

function Header() {
    return (
        <>
        <div className='header-body'>
                <Link to='/' className='header__logo'>
                    <img 
                        className='header__logo-img'
                        src={logo} 
                        alt="logo" 
                    />
                </Link>
                <Navbar/>
        </div>
        </>
    )
}

function Navbar() {
    const [isActiveBurger, setIsActiveBurger] = useState(false);
    
    function handleClickBurgerButton() {
        setIsActiveBurger(prevState => !prevState)
    }

    function handleClickHideMenu() {
        setIsActiveBurger(false)
    }

    const wrapRef = useRef(null);
    useClickOutside(wrapRef, handleClickHideMenu);

    return (
        <div ref={wrapRef}>
            <div className={isActiveBurger ? 'header__navbar header__navbar_burger-open' : ' header__navbar header__navbar_burger-close'} >
                <div className='header__navbar__navitems'>
                    <Link to='/' className='header__navbar__navitems__single-navitem' onClick={handleClickHideMenu}>
                        О сервисе
                    </Link>
                    <Link to='/platform/guide/0' className='header__navbar__navitems__single-navitem' onClick={handleClickHideMenu}>
                        Документация
                    </Link>
                    <Link to='/platform/contacts' className='header__navbar__navitems__single-navitem' onClick={handleClickHideMenu}>
                        Контакты
                    </Link>
                    <Link to='/platform/demo' className='header__navbar__navitems__single-navitem' onClick={handleClickHideMenu}>
                        ДЕМО
                    </Link>
                    <Link to='/u/login' className='header__navbar__navitems__single-navitem header__navbar__navitems__single-navitem_login' onClick={handleClickHideMenu}>
                        ВОЙТИ
                    </Link>
                </div>
            </div>
            <img 
                className={isActiveBurger ? 'header__burger-icon header__burger-icon_active' : 'header__burger-icon'}
                src={menu_icon} 
                alt='menu'
                onClick={handleClickBurgerButton}
            />
        </div>
        
    )
}

export { Header };
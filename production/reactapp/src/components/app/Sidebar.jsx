import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useMatch } from "react-router-dom";
import { getAvatarByURL, logout } from "../../api/userApi";
import { LocalStorageTools } from "../../localStorage";
import { resetProjectList } from '../../redux/projectListData';
import logo from '../../theme/img/logo/logo.svg';
import userPhoto from "../../theme/img/app/avatar.svg"
import progectsIconDefault from "../../theme/img/sidebar/projects-icon.svg";
import profileIconDefault from '../../theme/img/sidebar/profile-icon.svg'
import cogIconDefault from '../../theme/img/sidebar/settings-icon.svg';
import logoutIconDefault from '../../theme/img/sidebar/logout-icon.svg'
import chatIconDefault from '../../theme/img/sidebar/chat-icon.svg'
import videoIconDefault from '../../theme/img/sidebar/video-iconsvg.svg'
import progectsIconSolid from "../../theme/img/sidebar/projects-icon_solid.svg";
import profileIconSolid from '../../theme/img/sidebar/profile-icon_solid.svg'
import cogIconSolid from '../../theme/img/sidebar/settings-icon_solid.svg';
import burger from '../../theme/img/main/burger.svg';


export function Sidebar() {
    const uploudedAvatarUrl = useSelector((state) => state.userData.avatar);
    const src = uploudedAvatarUrl ? getAvatarByURL(uploudedAvatarUrl): userPhoto;

    const [isActiveBurger, setIsActiveBurger] = useState(false);

    function handleClickBurgerButton() {
        setIsActiveBurger(prevState => !prevState)
    }

    const dispatch = useDispatch();
    function handleClickHideMenu(e) {
        setIsActiveBurger(false)
        if(e.target.id === "projects"){
            dispatch(resetProjectList());
        }
    }
    const hendleLogout = () => {
        const tokens = LocalStorageTools.getItemFromLocalStorage('tokens');
        logout(tokens.refresh);
    }

    return (
        <>
            <div className='app-header'>
                <Link to='/' >
                    <img
                        className='app-header__logo' 
                        src={logo} 
                        alt="menu"
                    />
                </Link>
                <img 
                    className={isActiveBurger ? 'app-header__icon-burger app-header__icon-burger_active' : 'app-header__icon-burger'}
                    onClick={handleClickBurgerButton}
                    src={burger} 
                    alt="menu"
                />
            </div>
            <div className={isActiveBurger ?  "app-sidebar app-sidebar_burger-open " : "app-sidebar app-sidebar_burger-close "}>
                <Link to='/' className='logo_app' onClick={handleClickHideMenu}>
                    <img  
                        src={logo} 
                        width={175}
                        alt="logo" 
                    />
                </Link>
                <div className='app-sidebar__head'>
                    <div className="app-sidebar__head__user">
                        <img 
                            className='app-sidebar__head__user__photo'
                            src={src} 
                            alt="user" 
                        />
                    </div>
                    <Link to='/app' className='app-sidebar__head__loading-button' onClick={handleClickHideMenu}>
                        Загрузить
                    </Link>
                </div>


                <div className='app-sidebar-wrapper'>
                    <div className='app-sidebar__navbar'>
                        <NavLink to='/app/projects' 
                            id="projects"
                            className= {({isActive}) => isActive ? 'app-sidebar__navbar__item_active' : 'app-sidebar__navbar__item'}
                            onClick={handleClickHideMenu}
                            >
                                <img 
                                    className='app-sidebar__navbar__item__icon'
                                    src={useMatch('/app/projects/*') ? progectsIconSolid : progectsIconDefault} 
                                    alt="icon"
                                />
                                <div className='app-sidebar__navbar__item__title' id = 'pro'>
                                        Проекты
                                </div>
                        </NavLink>
                        <NavLink to='/app/profile' 
                            className= {({isActive}) => isActive ? 'app-sidebar__navbar__item_active' : 'app-sidebar__navbar__item'}
                            onClick={handleClickHideMenu}
                            >
                                <img 
                                    className='app-sidebar__navbar__item__icon'
                                    src={useMatch('/app/profile') ? profileIconSolid : profileIconDefault} 
                                    alt="icon"
                                />
                                <div className='app-sidebar__navbar__item__title' id = 'user'>
                                    Профиль
                                </div>
                        </NavLink>
                        <NavLink to='/app/settings' 
                            className= {({isActive}) => isActive ? 'app-sidebar__navbar__item_active' : 'app-sidebar__navbar__item'}
                            onClick={handleClickHideMenu}
                            >
                                <img 
                                    className='app-sidebar__navbar__item__icon'
                                    src={useMatch('/app/settings') ? cogIconSolid : cogIconDefault} 
                                    alt="icon"/>
                                <div className='app-sidebar__navbar__item__title' id = 'cog'>
                                    Настройки
                                </div>
                        </NavLink>
                        <Link to='/' className='app-link' reloadDocument>
                        <div 
                            className='app-sidebar__navbar__item' 
                            onClick={hendleLogout}
                        >
                            <img 
                                className='app-sidebar__navbar__item__icon'
                                src={logoutIconDefault} 
                                alt="icon"/>
                            <div className='app-sidebar__navbar__item__title'>
                                Выйти
                            </div>
                        </div>
                        </Link>
                    </div>

                    <div className='app-sidebar__navbar_help-blok'>
                        <div className="app-sidebar__navbar_help-blok__line"/>
                            <Link to='/platform/feedback' className='app-link'>
                                <div className='app-sidebar__navbar__item'>
                                    <img 
                                        className='app-sidebar__navbar__item__icon'
                                        src={chatIconDefault} 
                                        alt="icon"
                                    />
                                    <div className='app-sidebar__navbar__item__title'>
                                        Поддержка
                                    </div>
                                        
                                </div> 
                            </Link>
                            <Link to='/platform/demo' className='app-link'>
                                    <div className='app-sidebar__navbar__item'>
                                        <img 
                                            className='app-sidebar__navbar__item__icon'
                                            src={videoIconDefault} 
                                            alt="icon"
                                        />
                                        <div className='app-sidebar__navbar__item__title'>
                                            Обучение
                                        </div>
                                    </div>
                            </Link>
                    </div>
                </div>
            </div>
        </>
        
    )
}
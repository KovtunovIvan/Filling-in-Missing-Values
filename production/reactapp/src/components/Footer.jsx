import logo from '../logo-white.svg';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <div className="footer-wrapper">
            <div className='wrapper footer-nav'>
                <ContactLinks/>
                <ContactButtoms />
            </div>

        </div>
    )
}

function ContactLinks() {
    return (
    <div>
        <Link to='/' className='footer-logo'>
            <img 
                src={logo} 
                height="40" 
                alt="logo" 
            />
        </Link>
        <div className='footer-email'>
            info@medminds.com
        </div>
        <Link to='/platform/contacts' className='footer-contacts'>
            Все контакты
        </Link>
    </div>
    )
}

function ContactButtoms() {
    return (
        <div className='footer-buttons'>
            <Link to='/platform/feedback' className='button button_default'>
                Обратная связь
            </Link>
            <Link to='/platform/presentation' className='button button_dark-mode'>
                Заказать презентацию
            </Link>
        </div>
    )
}


export { Footer };
import logo from '../../theme/img/logo/logo-white.svg';
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
            medmindes@mail.ru
        </div>
        <div className='footer-contacts'>
            <Link to='/platform/contacts' style={{color:"#FFFFFF"}}>
                Все контакты
            </Link>
        </div>
    </div>
    )
}

function ContactButtoms() {
    return (
        <div className='footer-buttons'>
            <div className='footer-buttons__single-button'>
                <Link to='/platform/feedback' className='button button_default'>
                    Обратная связь
                </Link>
            </div>
            <div className='footer-buttons__single-button'>
                <Link to='/platform/presentation' className='button button_dark-mode'>
                    Заказать презентацию
                </Link>
            </div>
        </div>
    )
}


export { Footer };
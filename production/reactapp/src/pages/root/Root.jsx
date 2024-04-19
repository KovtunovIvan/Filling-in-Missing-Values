import { Header } from '../../components/main/Header';
import { Footer } from '../../components/main/Footer';
import { Link } from 'react-router-dom';
import logo from '../../theme/img/logo/logo-white.svg';
import g from '../../theme/img/main/preview-g.png';


function Root() {
    return (
        <>
            <Header/>
            <Preview />
            <Footer/>
        </>
    )
}

function Preview() {
    const text = "Автоматизированная обработка медицинских данных с применением методов машинного обучения"
    return (
        <div className='preview-back'>
            <div className='preview-container wrapper'>
                <div className='preview-left'>
                    <img 
                        className='preview-left__logo'
                        src={logo}
                        alt="img"
                    />
                    <div className='preview-left__text'>
                        {text}
                    </div>
                    <Link to=""
                        className='preview-left__button-login'
                    >
                        <div>
                            Войти
                        </div>
                    </Link>
                    <Link to=""
                        className='preview-left__button-demo'
                    >
                        <div
                            className='preview-left__button-demo__title'    
                        >
                            Демонстрация
                        </div>
                        <span>
                        </span>
                    </Link>
                </div>
                    <img className="preview-right" src={g} alt="img" />
                
            </div>
            
        </div>
    )
}

export { Root };
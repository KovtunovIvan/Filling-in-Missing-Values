import { Header } from '../../components/main/Header';
import { Footer } from '../../components/main/Footer';
import { Link } from 'react-router-dom';
import logo from '../../theme/img/logo/logo-white.svg';
import g from '../../theme/img/main/preview-g.png';
import circle_play_icon from '../../theme/img/main/circle-play.svg';
import useCase1_img from '../../theme/img/main/picture1.png';
import useCase2_img from '../../theme/img/main/picture2.png';
import useCase3_img from '../../theme/img/main/picture3.png';
import pos_img1 from '../../theme/img/main/pos-icon1.svg';
import pos_img2 from '../../theme/img/main/pos-icon2.svg';
import pos_img3 from '../../theme/img/main/pos-icon3.svg';
import pos_img4 from '../../theme/img/main/pos-icon4.svg';
import pos_img5 from '../../theme/img/main/pos-icon5.svg';
import pos_img6 from '../../theme/img/main/pos-icon6.svg';
import step_line_img  from '../../theme/img/main/step.svg';
import step_line_img_vertical  from '../../theme/img/main/step_vertical.svg';
import start_using_picture from '../../theme/img/main/start-using.png';
import start_using_logo from '../../theme/img/main/start-using-logo.svg';


const steps = [
    "Интеграция с источниками данных",
    "Предобработка и консолидация данных",
    "Разведочный анализ",
    "Моделирование и прогрозирование",
    "Визуализация и интерпритация",
    "Развертывание и интеграция",
]
const useCasesCards = [
    {
        img: useCase1_img,
        title: "Аналитикам данных",
        text: "MedMindes предоставляет широкий инструментарий для анализа и визуализации медицинских данных. С помощью сервиса аналитики данных смогут проводить сложные статистические исследования, выявлять корреляции и тренды, и получать ценную информацию для принятия решений в медицинской сфере.",
    },
    {
        img: useCase2_img,
        title: "IT-специалистам",
        text: "MedMindes облегчает и ускоряет процесс разработки моделей машинного обучения, позволяя сосредотачиваться на сущности задачи, а не на длительном и ресурсозатратном этапе анализа и предобработки данных. IT-специалисты смогут эффективно создавать и настраивать модели, повышая производительность и снижая затраты на разработку.",
    },
    {
        img: useCase3_img,
        title: "Медицинским работникам",
        text: "Используйте понятный интерфейс для работы с большими данными. MedMindes помогает врачам и медсестрам ставить диагнозы, следить за состоянием пациентов и выявлять тенденции в заболеваниях, что в конечном итоге повышает качество медицинской помощи.", 
    },
]

const possibilitiesCards = [
    {
        title:"Нормализация",
        img: pos_img1,
    },
    {
        title:"Стандартизация",
        img: pos_img2,
    },
    {
        title:"Анализ",
        img: pos_img3,
    },
    {
        title:(<>Заполнение<br/>пропусков</>),
        img: pos_img4,
    },
    {
        title:"Визуализация",
        img: pos_img5,
    },
    {
        title:"Интерпритация ",
        img: pos_img6,
    },
]

export function Root() {
    return (
        <>
            <Header/>
            <div className='content_outlet'>
                <Preview/>
                <div className='root_main-bg-color'>
                    <UseCases />
                    <Possibilities />
                    <Steps />
                    <ShowVideo />
                    <StartUsing />
                    <ContactUs />
                </div>
                <Footer/>
            </div>
        </>
    )
}

function StartUsing() {
    return (
        <div className='root__start-using-wrapper'>
            <div className='root__start-using__head'>
                <img src={start_using_picture} className='root__start-using__head__picture' alt="" />
                <img src={start_using_logo} className='root__start-using__head__logo' alt="" />
            </div>
            <div className='root__start-using__bottom'>
                <Link to="/platform/demo"
                    className='root__start-using__bottom__button root__start-using__bottom__button_demo'
                >
                    Демоверсия
                </Link>
                <Link to="/u/reg"
                    className='root__start-using__bottom__button root__start-using__bottom__button_reg'
                >
                    Зарегистрироваться
                </Link>

            </div>
        </div>
    )
}


function ShowVideo(){
    return (
        <>
            <div className='root__show-video__headline1'>
                Посмотрите на MedMinds в действии
            </div>
            <div className='root__show-video__headline2'>
                и оцените, подойдет ли вам наше решение
            </div>
            {
                // <div className='root__show-video__content'>

                // </div>
            }
            <div className='test' style={{textAlign: 'center'}}> Здесь должно быть видео</div>
        </>
    )
}

function Steps() {
    return (
        <>
            <div className='root__steps__headline'>
                Процесс анализа данных
            </div>
            <div className='root__steps-wrapper'>
                <img src={step_line_img_vertical} className="root__steps__line_vertical" alt="line" />
                <div className='root__steps_vertical'>
                    <div className='root__steps__1-2'>
                        <div className='root__steps__head'>
                            <div className='root__steps__head__single-stap'>
                                <div className='root__steps__head__single-stap__number'>
                                    1
                                </div>
                                <div className='root__steps__head__single-stap__text'>
                                    {steps[0]}
                                </div>
                            </div>
                            <div className='root__steps__head__single-stap'>
                                <div className='root__steps__head__single-stap__number'>
                                    2
                                </div>
                                <div className='root__steps__head__single-stap__text'>
                                    {steps[1]}
                                </div>
                            </div>
                        </div>
                        <img src={step_line_img} className="root__steps__line" alt="line" />
                    </div>

                    <div className='root__steps__3-4'>
                        <div className='root__steps__head'>
                            <div className='root__steps__head__single-stap'>
                                <div className='root__steps__head__single-stap__number'>
                                    3
                                </div>
                                <div className='root__steps__head__single-stap__text'>
                                    {steps[2]}
                                </div>
                            </div>
                            <div className='root__steps__head__single-stap'>
                                <div className='root__steps__head__single-stap__number'>
                                    4
                                </div>
                                <div className='root__steps__head__single-stap__text'>
                                    {steps[3]}
                                </div>
                            </div>
                        </div>
                        <img src={step_line_img} className="root__steps__line" alt="line" />
                    </div>

                    <div className='root__steps__5-6'>
                        <div className='root__steps__head'>
                            <div className='root__steps__head__single-stap'>
                                <div className='root__steps__head__single-stap__number'>
                                    5
                                </div>
                                <div className='root__steps__head__single-stap__text'>
                                    {steps[4]}
                                </div>
                            </div>
                            <div className='root__steps__head__single-stap'>
                                <div className='root__steps__head__single-stap__number'>
                                    6
                                </div>
                                <div className='root__steps__head__single-stap__text'>
                                    {steps[5]}
                                </div>
                            </div>
                        </div>
                        <img src={step_line_img} className="root__steps__line" alt="line" />
                    </div>
                </div>
                
            </div>
        </>
        
    )
}

function ContactUs() {
    return (
        <div className='root__contact-us'> 
            <div className='root__contact-us__title'>
                Свяжитесь с нами!
            </div>
            <div className='root__contact-us__text'>
                Наши специалисты расскажут о возможностях аналитической платформы MedMinds применительно для вашего бизнеса
            </div>
            <Link to="/platform/presentation"
                className='root__contact-us__button button button_default'
            >
                Связаться
            </Link>
        </div>
    )
}
function Possibilities() {
    const cards = possibilitiesCards.map((card, index) => {
        return (
            <div className='root__poss__card'>
                <div className='root__poss__card__icon'  key={index}>
                    <img src={card.img} className="root__poss__card__icon__img" alt="icon" />
                </div>
                <div className="root__poss__card__title">
                        {card.title}
                </div>
            </div>
        )
    })
    return (
        <>
            <div className='root__poss__headline'>
                Возможности MedMindes
            </div>
            <div className='root__poss-wrapper wrapper'>
                {cards}
            </div>
        </>
    )
}

function UseCases() {
    const cards = useCasesCards.map((card, index) => {
        return (
            <div className='root__use-cases__card' key={index}>
                <img className="root__use-cases__card__img" src={card.img} alt="card"/>
                <div className='root__use-cases__card__title'>
                    {card.title}
                </div>
                <div className='root__use-cases__card__text'>
                    {card.text}
                </div>
            </div>
        )
    })
    return (
        <div className='root__use-cases-wrapper wrapper'>
            <div className='root__use-cases__headline1'>
                У нас есть решение
            </div>
            <div className='root__use-cases__headline2'>
                Кому нужен MedMinds
            </div>
            <div className='root__use-cases__cards-wrapper'>
                {cards}
            </div>
        </div>
    )
}

function Preview() {
    const text = "Автоматизированная обработка медицинских данных с применением методов машинного обучения"
    return (
        <div className='preview-back'>
            <div className='preview-container'>
                <div className='preview-left'>
                    <img 
                        className='preview-left__logo'
                        src={logo}
                        alt="img"
                    />
                    <div className='preview-left__text'>
                        {text}
                    </div>
                    <div className='preview-left__bottom'>
                        <Link to="/u/login"
                            className='preview-left__bottom__button-login'
                        >
                            Войти
                        </Link>
                        <Link to="/platform/demo"
                            className='preview-left__bottom__button-demo'
                        >
                            <div className='preview-left__bottom__button-demo__label'>
                                Демонстрация
                            </div>
                            <img src={circle_play_icon} alt="play" />
                        </Link>
                    </div>
                </div>
                <div className="preview-right">
                    <img  className="preview-right__img" src={g} alt="img" />
                </div>
            </div>
            
        </div>
    )
}
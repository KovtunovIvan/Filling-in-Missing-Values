import { Link } from 'react-router-dom';
import '../../theme/styles/contacts.css';

const title1 = "Телефон"
const subtitle1 = "Менеджер по работе с клиентами:";
const subtitle2 = "По вопросам рекламы и сотрудничества:";
const contact1 = {
    name: "— Мачян Мария Аветиковна",
    data: "+7 (988) 588-43-27",
};

const contact2 = {
    name: "— Ковтунов Иван Александрович",
    data: "+7 (951) 491-85-37",
};

const title2 = "E-mail"
const contact3 = {
    name: "— Команда MedMindes",
    data: "medmindes@mail.ru",
};

const title3 = "Партнёры"
const contact4 = {
    name: "— Институт Компьютерных Технологий и Информационной Безопасности",
    data: "ictis.sfedu.ru",
};

// const contact5 = {
//     name: "— CVisionLab",
//     data: "cvisionlab.com",
// }; 

export function Contacts() {
    return (
        <div className="contacts-container wrapper">
            <div className="contacts-container__main-title">
                Контакты
            </div>
            <div className="contacts__buttons-wrapper">
                <div className='contacts__buttons__single-button'>
                    <Link to='/platform/feedback' className='button button_default'>
                        Обратная связь
                    </Link>
                </div>
                <div className='contacts__buttons__single-button'>
                    <Link to='/platform/presentation' className='button button_lite'>
                        Заказать презентацию
                    </Link>
                </div>
            </div>
            <div className="contacts__blok-wrapper">
                <div className="contacts__blok-wrapper__title">
                    {title1}
                </div>
                <div className="contacts__blok__content">
                    <div className="contacts__blok__content__subtitle">
                        {subtitle1}
                    </div>
                    <ContactBlok contact={contact1}/>
                    <div className="contacts__blok__content__subtitle">
                        {subtitle2}
                    </div>
                    <ContactBlok contact={contact2}/>
                </div>
                <div className="contacts__blok-wrapper__title">
                    {title2}
                </div>
                <div className="contacts__blok__content">
                    <ContactBlok contact={contact3}/>
                </div>
                <div className="contacts__blok-wrapper__title">
                    {title3}
                </div>
                <div className="contacts__blok__content">
                    <ContactBlok contact={contact4} isURL={true}/>
                </div>
            </div>
        </div>
    );
}

function ContactBlok(props) {
    const {contact, isURL} = props;
    return (
        <>
            <div className="contacts__blok__content__name">
                {contact.name}
            </div>
            {
                isURL ?
                    <a 
                        href={`https://${contact.data}`}
                        className="contacts__blok__content__contact-info"
                    >
                        {contact.data}
                    </a>
                    : <div 
                        className="contacts__blok__content__contact-info"
                    >
                        {contact.data}
                    </div>
            }

        </>
    )
}
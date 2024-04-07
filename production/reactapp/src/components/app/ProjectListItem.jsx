import options from "../../theme/img/progect/options-button.svg"
import iconReady from "../../theme/img/progect/status-ready.svg"
import iconOk from "../../theme/img/progect/status-ok.svg"
import iconError from "../../theme/img/progect/status-error.svg"
import iconClock from "../../theme/img/progect/status-clock.svg"
import { Link } from "react-router-dom"


function ProjectListItem(props) {
    const {id, title, status} = props;
    
    const getStatusSrc = (status) => {
        switch (status) {
            case "ready":
                return iconReady;
            case "OK":
                return iconOk;
            case "processing":
                return iconClock;
            default: 
                return iconError;
        }
    }

    const getStatusText = (status) => {
        switch (status) {
            case "ready":
                return "Готов к обработке";
            case "OK":
                return "Обработан";
            case "processing":
                return "Обрабатываем";
            default: 
                return "Ошибка";
        }
    }

    return (
        <Link 
            to={`/app/projects/${id}`}
            className="project-list__item" 
            key={id} 
        >
            <div className="project-list__item__title">
                {title}
            </div>
            <div className="project-list__item__options">
                <div className="project-list__item__options__status">
                    <img 
                        className="project-list__item__options__status__icon" 
                        src={getStatusSrc(status)}
                        alt="status"
                    />
                    <div className="project-list__item__options__status__text">
                        {getStatusText(status)}
                    </div>
                </div>
                <div>
                    <img 
                        className='project-list__item__options__menu'
                        src={options}
                        alt='options button'
                    />
                </div>
            </div>
        </Link>
    )

}

export { ProjectListItem }
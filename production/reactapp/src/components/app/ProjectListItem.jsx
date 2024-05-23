import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import options from "../../theme/img/progect/options-button.svg"
import iconReady from "../../theme/img/progect/status-ready.svg"
import iconOk from "../../theme/img/progect/status-ok.svg"
import iconError from "../../theme/img/progect/status-error.svg"
import iconClock from "../../theme/img/progect/status-clock.svg"
import { resetProject } from "../../redux/projectData";
import { useRef, useState } from "react"
import { useClickOutside } from "../../hooks/useClickOutside"
import { deleteProject } from "../../redux/projectListData"


export function ProjectListItem(props) {
    const {id, title, status} = props;
    const [isActiveBox, setActiveBox] = useState(false);

    const handleClickOptions = () => {
        setActiveBox(true);
    }

    const handleClickHideBox = () => {
        setActiveBox(false);
    }

    const boxRef = useRef(null);
    useClickOutside(boxRef, handleClickHideBox)

    const getStatusSrc = (status) => {
        switch (status) {
            case "No task associated with this project.":
                return iconReady;
            case "SUCCESS":
                return iconOk;
            case "PENDING":
                return iconClock;
            default: 
                return iconError;
        }
    }

    const getStatusText = (status) => {
        switch (status) {
            case "No task associated with this project.":
                return "Готов к обработке";
            case "SUCCESS":
                return "Обработан";
            case "PENDING":
                return "Обрабатываем";
            default: 
                return "Ошибка";
        }
    }
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const handleGoToProject = (e) => {
        if(e.target.id !== "option-box" && e.target.id !== "delete"){
            dispatch(resetProject())
            navigate(`/app/projects/${id}`);
        }
    }
    const handleClickDeleteButton = (e) => {
        if(e.target.id === "delete"){
            dispatch(deleteProject(id))
        }
    }

    return (
        <div 
            id="list-item"
            className="project-list__item" 
            key={id} 
            onClick={handleGoToProject}
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
                        id="option-box"
                        className='project-list__item__options__menu'
                        src={options}
                        alt='options button'
                        onClick={handleClickOptions}
                    />
                    {
                        isActiveBox ?
                        <div 
                            ref={boxRef}
                            className="project-list__item__options__box"
                        >
                            <div 
                                id="delete"
                                className="project-list__item__options__box__item"
                                onClick={handleClickDeleteButton}
                            >
                                Удалить
                            </div>
                        </div>
                        : null
                    }
                    
                </div>
            </div>
        </div>
    )
}
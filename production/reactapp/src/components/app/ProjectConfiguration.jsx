import infoIcon from "../../theme/img/forms/info-circle-icon.svg"


function ProjectConfig() {
    const sourceName = "file.csv"
    const buttonName = "Выбрать"

    const isFile = false;
    const fileFildContent = isFile ? sourceName : "Описание допустимых форматов данных." 

    return (
        <div className="project-config-inner-wrapper project-config-inner-wrapper_data">
            <div className="project-config__title">
                Данные
            </div>
            <div className="project-config__content project-config__content__data">
                <div className="project-config__content__data__files">
                    <div>{fileFildContent}</div>
                </div>
                <button 
                    className='button button_default project-config__right-button project-config__content__data__button'>
                    {buttonName}
                </button>
            </div>
        </div>
    )

}


export {ProjectConfig}
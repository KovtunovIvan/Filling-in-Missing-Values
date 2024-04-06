import { SelectOption } from "./SelectOption";

function ProcessingSettings() {
    const isActive = false;
    const buttonStyle = isActive ? "button button_default" : "button button_disable" 

    const fillMethods = [ 
        {
            id: 1,
            name:"Mean",
        },
        {
            id: 2,
            name:"Median", 
        },
        {
            id: 3,
            name:"Min", 
        },
        {
            id: 4,
            name:"Max", 
        },
        {
            id: 5,
            name:"Interpol",
        },
        {
            id: 6,
            name:"LinReg",
        },
        {
            id: 7,
            name:"KNN",
        },
        {
            id: 8,
            name:"DecTree",
        },
        {
            id: 9,
            name:"Forest",
        },
        {
            id: 10,
            name:"SVM",
        },
        {
            id: 11,
            name:"XGBoost",
        },
        {
            id: 12,
            name:"CatBoost",
        },      
    ]

    const scalingMathods = [
        {
            id: 1,
            name:"Стандартизация",
        },   
        {
            id: 2,
            name:"Нормализация",
        },   
    ]

    return (
        <div className="project-config-inner-wrapper project-config-inner-wrapper_processing ">
            <div className="project-config__title">
                Обработка данных
            </div>
            <div className="project-config__content project-config__content_processing">
                <form className="project-config__content_form">
                    <SelectOption
                        label="Заполнение пропусков"
                        name="fillMethods"
                        id="fillMethods"
                        list={fillMethods}
                        disabled={false}
                    />
                    <SelectOption
                        label="Масштабирование"
                        name="scaling"
                        id="scaling"
                        list={scalingMathods}
                        disabled={false}
                    />
                </form>
                <button
                    className={'project-config__right-button project-config__content_processing__button ' + buttonStyle}>
                    Отправить
                </button>
            </div>
        </div>
    )

}



export {ProcessingSettings}
function ProjectConfig(props) {
    const {source, result, getter, setter} = props;
    const fileNameSource = source.name;
    const fileNameResult = result.name;

    const switchStyleActive = "project-config__content__data__files__switch__item_active"
    const switchStyle = "project-config__content__data__files__switch__item"

    const getSwitchState = () => {
        if(result) {
            return getter() === 1 ? {
                        source: switchStyle,
                        result: switchStyleActive,
                    }
                    : {
                        source: switchStyleActive,
                        result: switchStyle,
                    }

        } else {
            return {
                source: switchStyleActive,
            }
        }
    }
    
    const switchState = getSwitchState();
    const handleChangeActive = (e) => {
        setter(Number(e.target.id))
    }

    const DefaultSource = (
        <button 
            id="0"
            className={switchState.source}
            onClick={handleChangeActive}
        >
            <div 
                id="0"
                className="project-config__content__data__files__switch__item__type"
            >
                Source:
            </div>
            <div 
                id="0"
                className="project-config__content__data__files__switch__item__name"
            >
                {fileNameSource}
            </div>       
        </button>
    )
    const Switch = (
        <>
            <button 
                id="0"
                className={switchState.source}
                onClick={handleChangeActive}
            >
                <div 
                    id="0"
                    className="project-config__content__data__files__switch__item__type"
                >
                   Source:
                </div>
                <div 
                    id="0"
                    className="project-config__content__data__files__switch__item__name"
                >
                    {fileNameSource}
                </div>       
            </button>

            <button 
                id="1"
                className={switchState.result}
                onClick={handleChangeActive}
            >
                <div
                    id="1"
                    className="project-config__content__data__files__switch__item__type"
                >
                    Result:
                </div>
                <div
                    id="1"
                    className="project-config__content__data__files__switch__item__name"
                >
                    {fileNameResult}
                </div>                
            </button>
        </>
    )

    return (
        <div className="project-config-inner-wrapper project-config-inner-wrapper_data">
            <div className="project-config__title">
                Данные
            </div>
            <div className="project-config__content__data__files">
                <div className="project-config__content__data__files__switch">
                    {result ? 
                        Switch 
                        : DefaultSource
                    }
                </div>
                <button 
                    className="project-config__content__data__files__button button button_default"
                >
                    Скачать
                </button>
            </div>
        </div>
    )
}


export {ProjectConfig}
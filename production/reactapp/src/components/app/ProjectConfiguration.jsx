import { useDispatch, useSelector } from "react-redux";
import { getFileByUrl } from "../../api/projectApi"
import { setOriginalFile, setProcessedFile } from "../../redux/projectData";
import { resetVisualisation } from "../../redux/visualizationData";

export function ProjectConfig(props) {
    const {isProcessed, getter, setter} = props;

    const fileNameSource = useSelector((state) => state.projectData.original_csv_file_name);
    const fileNameResult = useSelector((state) => state.projectData.processed_csv_file_name);
    const fileUrlSource = useSelector((state) => state.projectData.original_csv_file_url);
    const fileUrlResult = useSelector((state) => state.projectData.processed_csv_file_url);

    const switchStyleActive = "project-config__content__data__files__switch__item_active"
    const switchStyle = "project-config__content__data__files__switch__item"

    const getSwitchState = () => {
        if(isProcessed) {
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
    
    
    const dispatch = useDispatch();
    const handleChangeActive = (e) => {
        const index = Number(e.target.id);
        console.log(index)
        setter(index);
        if(index === 1){
            dispatch(setProcessedFile());
            dispatch(resetVisualisation());
        } 
        if(index === 0) {
            dispatch(setOriginalFile());
            dispatch(resetVisualisation());
        } 
    }

    const getActiveFile = () => {
        getter() === 1 ? getFileByUrl(fileUrlResult) : getFileByUrl(fileUrlSource);
    }
    const switchState = getSwitchState();

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
                <div className="project-config__content__data__files__switch">
                    {isProcessed ? 
                        Switch 
                        : DefaultSource
                    }
                </div>
                <button 
                    className="project-config__content__data__files__button button button_default"
                    onClick={getActiveFile}
                >
                    Скачать
                </button>
        </div>
    )
}
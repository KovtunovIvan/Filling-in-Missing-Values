import {useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVisualization, resetVisualisation, setVisualizationType } from '../../redux/visualizationData';
import matrixIcon from "../../theme/img/visualization/matrix-icon.svg"
import nornDistibutionIcon from "../../theme/img/visualization/norm-distribution-icon.svg"
import boxBlotIcon from "../../theme/img/visualization/box-plot-icon.svg"


const graficTypes = [ 
    {
        id: "0",
        title: "Матрица корреляций",
        label: "correlation_matrix",
        icon: matrixIcon,
    },
    {
        id: "1",
        title: "Нормальное распределение",
        label: "normal_distribution",
        icon: nornDistibutionIcon,
    },
    {
        id: "2",
        title: "Box-plot",
        label: "box-plot",
        icon: boxBlotIcon,
    },
]


export function Visualization() {
    const [activeIndex, setActiveIndex] = useState(0);
    const hendleSelector = (e) => {
        const id = e.target.id;
        switch (id) {
            case "1":
                setActiveIndex(1);
                
                break;
            default:
                setActiveIndex(0);
        }
    }

    const actualGraficType = graficTypes[useSelector((state) => state.visualizationData.id)];
    const imgSrc = useSelector((state) => state.visualizationData.img)
    const original_num_rows = useSelector((state) => state.projectData.original_num_rows);
    const recommended_methods = useSelector((state) => state.projectData.recommended_methods);
    const active_file_type = useSelector((state) => state.projectData.active_file_type);
    const has_missing_values = useSelector((state) => state.projectData.has_missing_values);
    const message = useSelector((state) => state.visualizationData.message);
    const disabled = imgSrc ? false : true;
    const activeColumn = useSelector((state) => state.visualizationData.column_name);
    const activeType = useSelector((state) => state.visualizationData.id);
    const imgFileName = disabled ? null : `${activeColumn}_${graficTypes[activeType].label}`;
    const buttonStyle = disabled ? "download_vis_button button button_disable" : "download_vis_button button button_default";
    const downloadButton_bg = 
        disabled ?      
            <div className='download_vis_button_container big_screen'>
                <button 
                    className={`${buttonStyle}`}
                    disabled 
                >
                    Скачать
                </button>
            </div>          

            :<div className='download_vis_button_container big_screen'>
                <a 
                    download={imgFileName}
                    className={`${buttonStyle}`}
                    href={imgSrc}
                >
                    Скачать
                </a>
            </div> 

        const downloadButton_sm = 
        disabled ? 
            <div className='download_vis_button_container small_screen'>              
                <button 
                    className={`${buttonStyle}`}
                    disabled 
                >
                    Скачать
                </button>
            </div> 
            :<div className='download_vis_button_container small_screen'>
                <a 
                    download={imgFileName}
                    className={`${buttonStyle}`}
                    href={imgSrc}
                >
                    Скачать
                </a>
            </div>
    return (
        <div className="project-config-inner-wrapper project-config-inner-wrapper_vis">
            <div className="project-config__content project-config__content_vis">
                <div className='project-config__content__vis-options'>
                    {active_file_type === "original" && 
                        <>
                            <div className="project-config__title project-config__title_analysis">
                                Анализ
                            </div>
                            <div className="project-config__optional">
                                Количество строк: <span className="project-config__optional__value">{original_num_rows}</span>
                            </div>
                            <div className="project-config__optional">
                                Наличие пропусков:  <span className="project-config__optional__value">{has_missing_values ? "да" : "нет"}</span>
                            </div>
                            { has_missing_values &&
                            <div className="project-config__optional">
                                Рекомендованные методы: <span className="project-config__optional__value">{recommended_methods ? recommended_methods.join(", ") : "нет"}</span>
                            </div> } 
                        </>
                    }
                
                    <div className="project-config__title">
                        Визуализация
                    </div>
                    <div className="project-config__content__navigation">
                        <button 
                            id="0"
                            className={
                                activeIndex === 0 ?
                                'project-config__content__navigation__item  project-config__content__navigation__item_active'
                                :'project-config__content__navigation__item'
                            }
                            onClick={hendleSelector}
                        >
                            Тип
                        </button>
                        <button
                            id="1"
                            className={
                                activeIndex === 1 ?
                                'project-config__content__navigation__item project-config__content__navigation__item_active'
                                :'project-config__content__navigation__item'
                            }
                            onClick={hendleSelector}
                        >
                            Настройки
                        </button>
                    </div>
                    {
                        (activeIndex === 0) ?
                            <GraficTypeSelector />
                            : <GraficSettings />
                    }
                    
                    { downloadButton_bg }
                </div>
                <div className='project-config__content_vis-result'>
                    {
                        message ?
                            <div className='project-config__content_vis-result__title'>
                               {message}
                            </div>
                        :
                        <>
                            <div className='project-config__content_vis-result__title'>
                                { actualGraficType ? 
                                    <span/> 
                                    : "Выберете график"}
                            </div>
                            <div className='project-config__content_vis-result__img-container'>
                                {
                                    actualGraficType ?
                                        <img id="image-g" alt="Выберите график" className='project-config__content_vis-result__img-container_img' src={imgSrc}/>
                                        : <span/>
                                }
                            </div>
                        </>
                    }           
                    { downloadButton_sm }
                </div>
            </div>
        </div>
    )

}


function GraficTypeSelector() {
    const list = graficTypes.map((x, index) => {
        return (
            <GraphButton
                graph={x}
                key={index}
            />
        )
    })

    return (
        <div className="project-config__grafic-selector">
            {list}
        </div>
    )
}

function GraphButton(props) {
    const {graph} = props;
    const dispatch = useDispatch();
    const features = useSelector((state) => state.projectData.features);
    const features_original = useSelector((state) => state.projectData.features_original);
    const active_file_type = useSelector((state) => state.projectData.active_file_type);
    const columns = active_file_type === 'original' ? features_original : features;
    const default_column_name = columns ? columns[0] : null;
    const column_name = useSelector((state) => state.visualizationData.column_name);
    const celected_column = column_name ? column_name : default_column_name;

    const handleChooseTypeByID = (e) => {
        dispatch(setVisualizationType(graph.id));
        dispatch(fetchVisualization(celected_column));
    }

    return (
        <div id={graph.id} className='' key={graph.id}>
            <button 
                id={graph.id}
                className={
                    useSelector((state) => state.visualizationData.id) === graph.id ?
                    "grafic-type-button_active"
                    : "grafic-type-button"
                }
                onClick={handleChooseTypeByID}
            >
                <img
                    id={graph.id} 
                    className='grafic-type-button__img'
                    width={45}
                    height={45}
                    src={graph.icon} 
                    alt="icon" 
                />
                <div id={graph.id}>
                    {graph.title}
                </div>
            </button>
        </div>
    )
}

function GraficSettings() {
    const id = useSelector((state) => state.visualizationData.id);
    const features = useSelector((state) => state.projectData.features);
    const features_original = useSelector((state) => state.projectData.features_original);
    const active_file_type = useSelector((state) => state.projectData.active_file_type);
    const columns = active_file_type === 'original' ? features_original : features;

    function getSettingsByID(id) {
        switch (id) {
            case "1":
                return (
                    <SelectColumn 
                        label="Column"
                        name="Column"
                        id="Column"
                        list={columns.map((item, index) => {
                            return {
                                id: index,
                                name: item,
                            }
                        })}
                    />
                )
            case "2":
                return (
                    <SelectColumn 
                        label="Column"
                        name="Column"
                        id="Column"
                        list={columns.map((item, index) => {
                            return {
                                id: index,
                                name: item,
                            }
                        })}
                    />
                )
            default:
                    return <div>Настройка данного графика не предусмотрена, попробуйте другой.</div>
        }
    }

    return (
        <div className='project-config__grafic-config'>
            {getSettingsByID(id)}
        </div>
    )
}


function SelectColumn(props) {
    const {label, name, id, list} = props;
    const optionsList = list.map((item) => {
        return (
            <option 
                className="select-option__select__option"
                name={item.name}
                value={item.name}
                key={item.id}
            >
                {item.name}
            </option>
        )
    })

    const dispatch = useDispatch();

    const handleChange = (e) => {
        dispatch(fetchVisualization(e.target.value));
    } 
    
    return (
        <div className="select-option-wrapper">
            <label for={id} className="select-option__label">
                {label}
            </label>
            <div className="select-option__select-wrapper">
                <select 
                    className="select-option__select"
                    name={name}
                    id={id}
                    onChange={handleChange} 
                >
                    {optionsList}
                </select>               
            </div>

        </div>
    )
}
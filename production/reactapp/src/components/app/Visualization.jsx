import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNormalDistribution, getCorrelationMatrix, getBoxPlot} from "../../api/projectApi"
import { setColumn, setImg, setVisualizationType } from '../../redux/visualizationData';
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


export const getPicture = column_name => {
    return (dispatch, getState) => {
        const vis_state = getState().visualizationData;
        const pro_state = getState().projectData;
        const type_id = vis_state.id;
        const project_id = pro_state.id;

        dispatch(setColumn(column_name));

        const setPng = (res) => {
            const base64 = btoa(
                new Uint8Array(res.data).reduce(
                  (data, byte) => data + String.fromCharCode(byte),
                  ''
                )
              )
            dispatch(setImg(`data:image/png;charset=utf-8;base64,${base64}`))
            console.log(vis_state)
        }

        switch (type_id) {
            case "0":
                getCorrelationMatrix(project_id).then((res) => { setPng(res) });
                break;
            case "1":
                getNormalDistribution(project_id, column_name).then((res) => { setPng(res) });
                break;
            case "2":
                getBoxPlot(project_id, column_name).then((res) => { setPng(res) });
                break;
            default:
                return;
        }
    }
}

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
            <div className="project-config__title">
                Визуализация
            </div>
            <div className="project-config__content project-config__content_vis">
                <div className='project-config__content__vis-options'>
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
                    <div className='project-config__content_vis-result__title'>
                        { actualGraficType ? 
                            <span/> // discription or title if necessary
                            : "Выберете график"}
                    </div>
                    <div className='project-config__content_vis-result__img-container'>
                        {
                            actualGraficType ?
                                <img id="image-g" alt="Выберите график" className='project-config__content_vis-result__img-container_img' src={imgSrc}/>
                                : <span/>
                        }
                    </div>
                    { downloadButton_sm }
                </div>
            </div>
        </div>
    )

}


function GraficTypeSelector() {
    const list = graficTypes.map((x) => {
        return (
            <GraphButton
                graph={x}
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

    console.log(useSelector((state) => state.visualizationData))
    const dispatch = useDispatch();
    const features = useSelector((state) => state.projectData.features);
    const default_column_name = features ? features[0] : null;
    const column_name = useSelector((state) => state.visualizationData.column_name);
    const column = column_name ? column_name : default_column_name;

    const handleChooseTypeByID = (e) => {
        dispatch(setVisualizationType(graph.id));
        dispatch(getPicture(column))
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

function GraficSettings(props) {
    const id = useSelector((state) => state.visualizationData.id);
    const columns = useSelector((state) => state.projectData.features);
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
        dispatch(getPicture(e.target.value));
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
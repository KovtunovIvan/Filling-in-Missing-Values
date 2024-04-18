import { useEffect, useState } from 'react';
import { SelectOption } from './SelectOption';
import matrixIcon from "../../theme/img/visualization/matrix-icon.svg"
import nornDistibutionIcon from "../../theme/img/visualization/norm-distribution-icon.svg"
import boxBlotIcon from "../../theme/img/visualization/box-plot-icon.svg"

const graficTypes = [ 
    {
        id: 0,
        title: "Матрица корреляций",
        icon: matrixIcon,
    },
    {
        id: 1,
        title: "Нормальное распределение",
        icon: nornDistibutionIcon,
    },
    {
        id: 2,
        title: "Box-plot",
        icon: boxBlotIcon,
    },
]

function Visualization(props) {
    const { disabled, } = props;
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeGraficID, setActiveGraficID] = useState(graficTypes[0].id);

    const buttonStyle = disabled ? "button button_disable" : "button button_default";

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
    function setterActiveID(id){
        setActiveGraficID(id)
    }

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
                            <GraficTypeSelector 
                                activeID={activeGraficID} 
                                setter={setterActiveID}
                            />
                            : <GraficSettings
                                activeID={activeGraficID} 
                            />
                    }

                    {
                        disabled ?                
                            <button 
                                className={buttonStyle}
                                disabled
                            >
                                Скачать
                            </button>
                            :<button 
                                className={buttonStyle}
                            >
                                Скачать
                            </button>
                    }
                </div>
                <div className='project-config__content_vis-result'>
                    <div className='project-config__content_vis-result__title'>
                        {graficTypes[activeGraficID].title}
                    </div>
                    <div className='project-config__content_vis-result__img-container'>
                        <img id="image-g" alt="grafic" />
                    </div>
                </div>

            </div>
        </div>
    )

}


function GraficTypeSelector(props) {
    const {activeID, setter} = props;

    const list = graficTypes.map((x) => {
        return (
            <GraphButton
                graph={x}
                activeID={activeID}
                setter={setter}
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
    const {graph, activeID, setter} = props;

    const [isActive, setIsActive] = useState(false);

    const handleChooseTypeByID = (e) => {
        setter(graph.id);
    }

    useEffect(()=> {
        if(graph.id === activeID) {
            setIsActive(true)
        } else {
            setIsActive(false)
        }
    }, [activeID])

    console.log(graph.id);

    return (
        <div id={graph.id} className='' key={graph.id}>
            <button 
                id={graph.id}
                className={
                    isActive ?
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
    const {activeID} = props;

    function getSettingsByID(id) {
        switch (id) {
            case "1":
                return (
                    <SelectOption 
                        label="Column"
                        name="Column"
                        id="Column"
                        list={[{id: 1, name:"name1"}, { id: 2, name:"name2"}]}
                        disabled={true}
                    />
                )
            case "2":
                return (
                    <SelectOption 
                        label="Column"
                        name="Column"
                        id="Column"
                        list={[{id: 1, name:"name1"}, { id: 2, name:"name2"}]}
                        disabled={true}
                    />
                )
            default:
                    return <div>Настройка данного графика не предусмотрена, попробуйте другой.</div>
        }
    }
    console.log(activeID)

    return (
        <div className='project-config__grafic-config'>
            {getSettingsByID(activeID)}
        </div>
    )
}

export { Visualization }
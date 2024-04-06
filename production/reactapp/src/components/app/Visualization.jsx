import { useState } from 'react';
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

function Visualization() {
    const disabled = true;
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeGraficID, setActiveGraficID] = useState(graficTypes[0].id);

    const isActive = false;
    const buttonStyle = isActive ? "button button_default vis-button" : "button button_disable vis-button" 

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
    function handleChooseTypeByID(id){
        setActiveGraficID(id)
    }

    console.log(activeGraficID);
    console.log(graficTypes[activeGraficID].title);
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
                            className='project-config__content__navigation__item'
                            onClick={hendleSelector}
                        >
                            Тип
                        </button>
                        <button
                            id="1"
                            className='project-config__content__navigation__item'
                            onClick={hendleSelector}
                        >
                            Настройки
                        </button>
                    </div>
                    {
                        (activeIndex === 0) ?
                            <GraficTypeSelector 
                                activeID={activeGraficID} 
                                setter={handleChooseTypeByID}
                            />
                            : <GraficSettings
                                activeID={activeGraficID} 
                            />
                    }
                    <button 
                        className={buttonStyle}
                    >
                        Скачать
                    </button>
                </div>
                <div className='project-config__content_vis-result'>
                    <div className='project-config__content_vis-result__title'>
                        {graficTypes[activeGraficID].title}
                    </div>
                    <div className='project-config__content_vis-result__img-container'>
                        <img src="#" alt="grafic" />
                    </div>
                </div>

            </div>
        </div>
    )

}


function GraficTypeSelector(props) {
    const {activeID, setter} = props;

    const handleChooseTypeByID = (e) => {
        const id = e.target.id;
        setter(id);
    }

    const list = graficTypes.map((x) => {
        const style = x.id === activeID ? "grafic-type-button_active" : "grafic-type-button";
        return (
            <div id={x.id} className='' key={x.id}>
                <button 
                    id={x.id}
                    className={style}
                    onClick={handleChooseTypeByID}
                >
                    <img 
                        id={x.id} 
                        width={50}
                        src={x.icon} 
                        alt="icon" 
                    />
                    <div id={x.id}>
                        {x.title}
                    </div>
                </button>
            </div>
        )
    })

    return (
        <div className="project-config__grafic-selector">
            {list}
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
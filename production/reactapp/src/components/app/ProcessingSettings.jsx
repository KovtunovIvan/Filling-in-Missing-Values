import { useSelector } from "react-redux";
import {Form, redirect, useNavigate} from "react-router-dom"
import { sendDataForProcessing } from "../../api/projectApi"
import { SelectOption } from "./SelectOption";

const fillMethods = [ 
    {
        id: 0,
        name:"Mean",
    },
    {
        id: 1,
        name:"Median", 
    },
    {
        id: 2,
        name:"Min", 
    },
    {
        id: 3,
        name:"Max", 
    },
    {
        id: 4,
        name:"Interpol",
    },
    {
        id: 5,
        name:"LinReg",
    },
    {
        id: 6,
        name:"KNN",
    },
    {
        id: 7,
        name:"DecTree",
    },
    {
        id: 8,
        name:"Forest",
    },
    {
        id: 9,
        name:"SVM",
    },
    {
        id: 10,
        name:"XGBoost",
    },
    {
        id: 11,
        name:"CatBoost",
    },      
]

const scalingMathods = [
    {
        id: 'standart',
        name:"Стандартизация",
    },   
    {
        id: 'normalize',
        name:"Нормализация",
    },   
]
 
export const sendFormData = async ({request, params}) => {
    let formData = await request.formData();
    const response = await sendDataForProcessing(formData);
     return redirect(`/app/projects/${params.id}`);
} 

export function ProcessingSettings(props) {
    const {disabled} = props;
    const buttonStyle = disabled ? "button button_disable" : "button button_default";
    const id = useSelector((state) => state.projectData.id);

    const navigate = useNavigate()
    const handleResetProjectInfo = async () => {
        navigate(0);
    }

    return (
        <div className="project-config-inner-wrapper project-config-inner-wrapper_processing">
            <div className="project-config__title">
                Обработка данных
            </div>
            <Form 
                action={`/app/projects/${id}`}
                method="post"
                className="project-config__content_processing">
                <div className="project-processing__content_form">
                    <SelectOption
                        label="Заполнение пропусков"
                        name="method_fill_id"
                        id="method_fill_id"
                        list={fillMethods}
                        disabled={disabled}
                    />
                    <SelectOption
                        label="Масштабирование"
                        name="method_scaling_id"
                        id="method_scaling_id"
                        list={scalingMathods}
                        disabled={disabled}
                    />
                </div>
                {
                    disabled ? 
                        <button
                            className={'project-config__right-button project-config__content_processing__button ' + buttonStyle}
                            disabled
                        >
                            Отправить
                        </button>
                        :<button
                            type="submit"
                            name="project_id"
                            value={id}
                            className={'project-config__right-button project-config__content_processing__button ' + buttonStyle}
                            onClick={handleResetProjectInfo}
                        >
                            Отправить
                        </button>
                }
            </Form>
        </div>
    )
}
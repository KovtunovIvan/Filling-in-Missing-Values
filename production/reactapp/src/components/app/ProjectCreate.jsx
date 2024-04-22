import { useEffect, useState } from 'react';
import { createNewProject } from "../../api/projectApi"
import { useNavigate } from 'react-router-dom';


const infoContent = "Загрузите файл формата .CSV или .XLSX. размером не более 100Мб с Вашего устройства." 
const acceptFiles = ".csv, .xlsx"

function ProjectCreate() {
    const initialCreateState = {
        loading: false,
        message: "",
    };
    const [isFileSelected, setIsFileSelected] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [createState, setCreateState] = useState(initialCreateState);

    useEffect(()=> {
        setIsActive(true);
    }, [isFileSelected])

    function handleUpload() {

        //!!!validation
        setIsFileSelected(true);
        if(isActive) {
            create();
        }
    }

    const navigate = useNavigate();

    function create() {
        setCreateState( {
            loading: true,
            message: ""
        });
        const selectedFile = document.getElementById("input__file").files[0];
        if(selectedFile){
            let formData = new FormData();
            formData.append("file", selectedFile);
            createNewProject(formData).then(
                () => { 
                    navigate(`/app/projects/`);
                },
                (error) => {
                    const resMessage =
                        (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                        error.message ||
                        error.toString();
    
                    setCreateState( {
                        loading: false,
                        message: resMessage
                    })
                })
        }
    }

    return (
        <div className="project-create-inner-wrapper">
            <div className="project-create__title">
                Создать проект
            </div>
                <div className="project-create__content__data__info">
                    {infoContent}
                </div>
                <div className='project-config__content__data__input-wrapper'>
                    <input 
                        type="file" 
                        name="file"
                        accept={acceptFiles}
                        id="input__file"
                        className='project-config__content__data__input'
                        onChange={handleUpload}
                    />
                    <label for="input__file" class="button button_default">
                        <div>Загрузить файл</div>
                    </label>
            </div>
        </div>
    )
}


export {ProjectCreate}
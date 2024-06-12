import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createNewProject } from "../../api/projectApi"
import { Loader } from '../optional/Loader';
import { resetProjectList } from '../../redux/projectListData';


const infoContent = "Загрузите файл формата .CSV или .XLSX. размером не более 10Мб с Вашего устройства." 
const acceptFiles = ".csv, .xlsx"

export function ProjectCreate() {
    const initialCreateState = {
        loading: false,
        error: false,
        message: "",
    };
    const [isFileSelected, setIsFileSelected] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [createState, setCreateState] = useState(initialCreateState);

    useEffect(()=> {
        setIsActive(true);
    }, [isFileSelected])

    const [isLoading, setloading] = useState(false);
    
    useEffect(()=> {
        if(createState.loading){
            setloading(true);
        }
    }, [createState.loading])

    function handleUpload() {
        //!!!validation
        const selectedFile = document.getElementById("input__file").files[0];
        if(selectedFile){
            setIsFileSelected(true);
            if(isActive) {
                create();
            }
        }
    }
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    function create() {
        setCreateState( {
            loading: true,
            message: ""
        });
        const selectedFile = document.getElementById("input__file").files[0];
        if(selectedFile['size'] < 10485760){
            let formData = new FormData();
            formData.append("file", selectedFile);
            createNewProject(formData).then(
                () => { 
                    dispatch(resetProjectList());
                    navigate('/app/projects/');
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
                        error: true,
                        message: resMessage
                    })
                })
        } else {
    
            setCreateState( {
                loading: false,
                error: true,
                message: "Выберете файл размером не более 10МБ"
            })
        }
    }

    return (
        <>
            <Loader active={isLoading} />
            <div className="project-create-inner-wrapper">
                <div className="project-create__title">
                    Создать проект
                </div>
                <div className="project-create__content__data__info">
                    {infoContent}
                </div>
                {
                    createState.error && <div className='project-create__content__data__error'>{createState.message}</div>
                }
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
        </>
        
    )
}
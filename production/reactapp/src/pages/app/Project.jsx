import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLoaderData } from "react-router-dom";
import { ProjectConfig } from "../../components/app/ProjectConfiguration";
import { ProcessingSettings } from "../../components/app/ProcessingSettings";
import { Visualization } from "../../components/app/Visualization";
import { fetchProject, fetchProjectTaskStatus } from "../../redux/projectData";
import { Loader } from "../../components/optional/Loader";

export const OneProjectLoader = async ({request, params}) => {
    if(params){
        return params.id;
    } else {
        return null;
    }
}

function Project() {
    const id = useLoaderData();
    const dispatch = useDispatch();
    const projectStatus = useSelector((state) => state.projectData.status);
    const projectTaskStatus = useSelector((state) => state.projectData.task_status);
    const [isLoading, setloading] = useState(true);
    const isProcessed = useSelector((state) => state.projectData.processed_csv_file_name) ? true : false;
    const initialIndexState = isProcessed ? 1 : 0;
    const [activeIndex, setActiveIndex] = useState(initialIndexState);
    const [isProcessingDisable, setIsProcessingDisable] = useState(true);

    useEffect(() => {
        if(projectTaskStatus === 'idle'){
            dispatch(fetchProjectTaskStatus(id))
        }
        if(projectStatus === 'loading' || projectTaskStatus === 'loading') {
            setloading(true);
        }
        if(projectStatus === 'succeeded' && projectTaskStatus === 'succeeded') {
            setloading(false);
        }
    }, [projectStatus, projectTaskStatus, dispatch, activeIndex, id])

    useEffect(()=>{
        if(activeIndex === 1){
            setIsProcessingDisable(true);
        } else {
            setIsProcessingDisable(false);
        }
    }, [projectStatus, activeIndex])

    useEffect(()=>{
        if(isProcessed){
            setActiveIndex(1);
        } else {
            setActiveIndex(0)
        }
    }, [isProcessed])

    useEffect(() => {
        if(projectStatus === 'idle' && projectTaskStatus === 'succeeded'){
            dispatch(fetchProject(id))
        }
    }, [projectTaskStatus, projectStatus, dispatch, id])

    function handleSwitchActive(index) {
        setActiveIndex(index);
    }

    function getActiveIndex() {
        return activeIndex
    }

    return (
            <div className="project-config-wrapper">
                <Loader active={isLoading} />
                <ProjectConfig 
                    isProcessed={isProcessed}
                    getter={getActiveIndex}
                    setter={handleSwitchActive}
                />
                <ProcessingSettings disabled={isProcessingDisable}/>
                <Visualization/>
            </div>
    )
}


export { Project }
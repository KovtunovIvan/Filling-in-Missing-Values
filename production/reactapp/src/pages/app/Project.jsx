import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLoaderData } from "react-router-dom";
import { ProjectConfig } from "../../components/app/ProjectConfiguration";
import { ProcessingSettings } from "../../components/app/ProcessingSettings";
import { Visualization } from "../../components/app/Visualization";
import { fetchProject, fetchProjectTaskStatus, setOriginalFile, setProcessedFile } from "../../redux/projectData";
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
    const visualizationStatus = useSelector((state) => state.visualizationData.status);
    const [isLoading, setloading] = useState(true);
    const isProcessed = useSelector((state) => state.projectData.processed_csv_file_name) ? true : false;
    let initialIndexState;
    if(isProcessed){
        initialIndexState = 1;
    } else {
        initialIndexState = 0;
    }
    const [activeIndex, setActiveIndex] = useState(initialIndexState);
    const [isProcessingDisable, setIsProcessingDisable] = useState(true);

    console.log(visualizationStatus);
    useEffect(() => {
        if(projectTaskStatus === 'idle'){
            dispatch(fetchProjectTaskStatus(id))
        }
        if(projectStatus === 'loading' || projectTaskStatus === 'loading' || visualizationStatus === 'loading') {
            setloading(true);
        }
        if(projectStatus === 'succeeded' && projectTaskStatus === 'succeeded' && (visualizationStatus === 'succeeded' || visualizationStatus === 'idle')) {
            setloading(false);
        }
    }, [dispatch, projectStatus, projectTaskStatus, activeIndex, id, visualizationStatus])

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
import { useLoaderData } from "react-router-dom";

import { getProjectByID } from "../../api/projectApi" 
import { ProjectConfig } from "../../components/app/ProjectConfiguration";
import { ProcessingSettings } from "../../components/app/ProcessingSettings";
import { Visualization, getPicture } from "../../components/app/Visualization";
import { useEffect, useState } from "react";
import { setProject, resetProject } from "../../redux/projectData";
import { useDispatch, useSelector } from "react-redux";

export const OneProjectLoader = async ({request, params}) => {
    if(params){
        const response = await getProjectByID(params.id);
        return response;   
    } else {
        return null;
    }
}

function Project() {
    const response = useLoaderData();

    //testing
    console.log(response)

    const dispatch = useDispatch();
    if(response){
        dispatch(setProject(response));
    } else {
        dispatch(resetProject);
    }

    const isProcessed = useSelector((state) => state.projectData.processed_csv_file_name) ? true : false;
    console.log(isProcessed)
    
    const initialIndexState = isProcessed ? 1 : 0;
    const [activeIndex, setActiveIndex] = useState(initialIndexState);
    const [isProcessingDisable, setIsProcessingDisable] = useState(true);

    useEffect(()=> {
        if(activeIndex === 1){
            setIsProcessingDisable(true);
        } else {
            setIsProcessingDisable(false);
        }
    }, [activeIndex])

    console.log(activeIndex);

    function handleSwitchActive(index) {
        setActiveIndex(index);
    }

    function getActiveIndex() {
        return activeIndex
    }

    return (
        <div className="project-config-container">
            <div className="project-config-wrapper">
                <ProjectConfig 
                    isProcessed={isProcessed}
                    getter={getActiveIndex}
                    setter={handleSwitchActive}
                />
                <ProcessingSettings disabled={isProcessingDisable}/>
                <Visualization/>
            </div>
        </div>
    )
}


export { Project }
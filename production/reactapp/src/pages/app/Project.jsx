import { useLoaderData } from "react-router-dom";

import { getProjectByID, getFileByUrl } from "../../api/userApi" 
import { ProjectConfig } from "../../components/app/ProjectConfiguration";
import { ProcessingSettings } from "../../components/app/ProcessingSettings";
import { Visualization } from "../../components/app/Visualization";
import { useEffect, useState } from "react";

export const OneProjectLoader = async ({request, params}) => {
    const id = 7;
    const response = await getProjectByID(id);
    //const file = await getFileByUrl(response.processed_csv_file_url)
    //console.log(file)
    return response;
}

function Project() {
    const data = useLoaderData();
    const projectID = data.id;
    const source = {
        name:  data.title,
        url: data.original_csv_file_url,
    }
    const result = 
        data.processed_csv_file_url ? {
            name:  data.processed_csv_file_name,
            url: data.processed_csv_file_url,
        } : null;

    const initialIndexState = result ? 1 : 0;
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
                    source={source} 
                    result={result} 
                    getter={getActiveIndex}
                    setter={handleSwitchActive}
                />
                <ProcessingSettings 
                    disabled={isProcessingDisable} id={projectID}/>
                <Visualization 
                    disabled={false}/>
            </div>
        </div>
    )
}


export { Project }
import { ProcessingSettings } from "../../components/app/ProcessingSettings"
import { Visualization } from "../../components/app/Visualization"
import { ProjectCreate } from "../../components/app/ProjectCreate"

function CreateProject() {
    return (
        <div className="project-config-container">
            <div className="project-config-wrapper">
                <ProjectCreate />
                <ProcessingSettings disabled={true}/>
                <Visualization disabled={true}/>
            </div>
        </div>
    )
}


export { CreateProject }
import { ProcessingSettings } from "../../components/app/ProcessingSettings"
import { Visualization } from "../../components/app/Visualization"
import { ProjectConfig } from "../../components/app/ProjectConfiguration"

function CreateProject() {
    return (
        <div className="project-config-container">
            <div className="project-config-wrapper">
                <ProjectConfig />
                <ProcessingSettings />
                <Visualization />
            </div>
        </div>
    )
}


export { CreateProject }
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProjectListItem } from "./ProjectListItem"


export function ProjectList(props) {
    const {data} = props;
    const navigate = useNavigate()
    useEffect(()=>{
            if(data.length === 0){
                navigate("/app")
            }
        }, [data.length, navigate]
    );
    const list = data.map(x => {
        return <ProjectListItem id={x.id} title={x.title} status={x.status}/>
    })

    return (
        <div className="project-list-wrapper">
            {list}
        </div>
    )
}
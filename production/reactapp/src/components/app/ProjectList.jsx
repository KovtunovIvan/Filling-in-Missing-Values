import { ProjectListItem } from "./ProjectListItem"

const test = [
    {
        id: 1,
        title: "project1.csv",
        status: "ready"
    },
    {
        id: 2,
        title: "project2.csv",
        status: "processing"
    },
    {
        id: 3,
        title: "project3.csv",
        status: "OK"
    },
    {
        id: 4,
        title: "project4.csv",
        status: "error"
    },
]



function ProjectList(props) {
    const {data} = props;
    const list = data.map(x => {
        return <ProjectListItem id={x.id} title={x.title} status={x.status}/>
    })

    return (
        <div className="project-list-wrapper">
            {list}
        </div>
    )
}

export { ProjectList }
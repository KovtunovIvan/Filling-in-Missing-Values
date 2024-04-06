import { useLoaderData, useNavigation } from "react-router-dom";
import { ProjectList } from "../../components/app/ProjectList"
import { getAllProjects } from "../../api/userApi"
import { LoadingPage } from "./LoadingPage";


export const projectsLoader = async ({request, params}) => {
    const data = await getAllProjects();
    const list = data.map((x) => {
        const item = {
            id: x.id, 
            title: x.title,
            status: "ready"
        }

        return item
    })

    return list;
}


function AllProjects() {
    const list = useLoaderData();

    const navigation = useNavigation();
    if (navigation.state === "loading") {
      return <LoadingPage/>;
    }

    return (
        <>
            <ProjectList data={list}/>
        </>
    )
}


export { AllProjects }
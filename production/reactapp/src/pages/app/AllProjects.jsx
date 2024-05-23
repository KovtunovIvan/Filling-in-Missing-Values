import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProjectList } from "../../components/app/ProjectList"
import { fetchProjectList } from "../../redux/projectListData";
import { Loader } from "../../components/optional/Loader";


export function AllProjects() {
    const projectListStatus = useSelector((state) => state.projectListData.status)
    const [isLoading, setloading] = useState(true);
    const list = useSelector((state) => state.projectListData.list);

    const dispatch = useDispatch();
    useEffect(() => {
        if(projectListStatus === 'idle' || projectListStatus === 'deleted'){
            dispatch(fetchProjectList())
        }
        if(projectListStatus === 'loading') {
            setloading(true);
        }
        if(projectListStatus === 'succeeded') {
            setloading(false);
        }
    }, [projectListStatus, dispatch, list])
   
    return (
        <>
            {
                isLoading ? <Loader active={isLoading}/> : <ProjectList data={list}/>
            }
        </>
    )
}
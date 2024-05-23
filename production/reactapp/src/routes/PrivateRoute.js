import { useEffect, useState } from "react";
import { fetchUser } from "../redux/userData";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../components/optional/Loader";


export function PrivateRoute({ children }) {

  const projectListStatus = useSelector((state) => state.userData.status)
  const [isLoading, setloading] = useState(true);

  const dispatch = useDispatch();
  useEffect(() => {
      if(projectListStatus === 'idle'){
          dispatch(fetchUser())
      }
      if(projectListStatus === 'loading') {
          setloading(true);
      }
      if(projectListStatus === 'succeeded') {
          setloading(false);
      }
  }, [projectListStatus, dispatch])

    return (
      <>
        { isLoading ? <Loader active={isLoading} /> : children }
      </>

    )
  }
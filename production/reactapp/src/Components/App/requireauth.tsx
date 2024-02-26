import {useLocation} from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";


export function RequireAuth({ children }: { children: JSX.Element }) {
    let username = useAppSelector((state) => state.userData.username)
    console.log(username)
    let location = useLocation();
    if (!username) {   
      return <Navigate to="/" state={{ from: location }} replace />;
    }
    return children;
  }
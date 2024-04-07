import { useLocation, Navigate } from "react-router-dom";
import { LocalStorageTools } from "../localStorage";

export function PrivateRoute({ user, children }) {
    const isUser = LocalStorageTools.getItemFromLocalStorage('tokens') ? true : false;
    let location = useLocation();
    if (!isUser) {   
      return <Navigate to="/u/login" state={{ from: location }} replace />;
    }
    return children;
  }
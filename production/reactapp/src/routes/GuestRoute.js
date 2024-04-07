import { useLocation, Navigate } from "react-router-dom";
import { LocalStorageTools } from "../localStorage";

export function GuestRoute({ children }) {
  const isUser = LocalStorageTools.getItemFromLocalStorage('tokens') ? true : false;
    let location = useLocation();
    if (isUser) {   
      return <Navigate to="/app/create" state={{ from: location }} replace />;
    } else {
      if(location.pathname === "/u") {
        return <Navigate to="/u/login" state={{ from: location }} replace />;
      }
    }
    return children;
  }
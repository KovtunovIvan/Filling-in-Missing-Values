import { useLocation, Navigate } from "react-router-dom";

export function GuestRoute({ user, children }) {
    let location = useLocation();
    if (user) {   
      return <Navigate to="/app" state={{ from: location }} replace />;
    } else {
      if(location.pathname === "/u") {
        return <Navigate to="/u/login" state={{ from: location }} replace />;
      }
    }
    return children;
  }
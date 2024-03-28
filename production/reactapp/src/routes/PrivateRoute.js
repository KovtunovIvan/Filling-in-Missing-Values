import { useLocation, Navigate } from "react-router-dom";


export function PrivateRoute({ user, children }) {
    let location = useLocation();
    if (!user) {   
      return <Navigate to="/u/login" state={{ from: location }} replace />;
    }
    return children;
  }
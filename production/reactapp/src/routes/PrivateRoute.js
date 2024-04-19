import { LocalStorageTools } from "../localStorage";
import { userCheck } from "../api/userApi"
import { setUser } from "../redux/userData";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { useLoaderData, redirect } from "react-router-dom";

export const userLoader = async ({request, params}) => {
    //testing
    console.log("FETCHING!");

    const isUser = LocalStorageTools.getItemFromLocalStorage('tokens') ? true : false;
    if(isUser){
      const tokens = LocalStorageTools.getItemFromLocalStorage('tokens');
      const userInfo = tokens ? jwtDecode(tokens.access) : null;
      return await userCheck(userInfo.user_id);
    }
    return redirect("/u/login");
}


export function PrivateRoute({ children }) {
    const data = useLoaderData().data;
    const dispatch = useDispatch();
    if(data) {
      dispatch(setUser(data));
  }
    //testing
    console.log(data);

    return children;
  }
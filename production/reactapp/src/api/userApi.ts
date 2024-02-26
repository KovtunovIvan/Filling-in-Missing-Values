import axios from "axios";
import { LocalStorageTools } from "../localStorage";
import authHeader from "./headers";
import { setUser } from "../redux/userData";
import { Token } from "../types";

const URL_LOCAL = 'http://127.0.0.1:8000/'

export const login = (email: string, password: string, dispatch: any) => {
  return axios.post(URL_LOCAL + "login/", {
    email,
    password
  })
  .then(
    response => {
      LocalStorageTools.setItemToLocalStorage("tokens", response.data.tokens);
      dispatch(setUser(response.data))
      return response.data;
    });
}
  
export const logout = (refreshToken:string | undefined) => {
  const auth = authHeader();
  //очистить стор и локалку
  LocalStorageTools.removeFromLocalStorage('tokens');
  console.log(auth)
  return axios.post(URL_LOCAL + "logout/", {
      headers: auth,
      data: {
        refresh: refreshToken,
      }
  })
}

export const userCheck = (id: number | {}) => {
  return axios.post(URL_LOCAL + 'idUserCheck/',{
    data: {
      id: id
    },
  });
}
  
export const register = (username: string, email: string, password: string, dispatch: any) => {
  return axios.post(URL_LOCAL + "register/", {
    username,
    email,
    password
  })
  .then(
    response => {
      LocalStorageTools.setItemToLocalStorage("tokens", response.data.tokens);
      dispatch(setUser(response.data))
      return response.data;
    });;
}
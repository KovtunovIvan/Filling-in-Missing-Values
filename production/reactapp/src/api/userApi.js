import { LocalStorageTools } from "../localStorage";
import authHeader  from "./headers";
import { setUser } from "../redux/userData";
import { instance } from "./requests";


export const login = async (email, password, dispatch) => {
  const response = await instance.post("login/", {
    email,
    password
  });
  LocalStorageTools.setItemToLocalStorage("tokens", response.data.tokens);
  dispatch(setUser(response.data));
  return response.data;
}
  
export const logout = (refreshToken) => {
  const auth = authHeader();
  
  LocalStorageTools.removeFromLocalStorage('tokens');
  return instance.post("logout/", {
    refresh: refreshToken,
  }, {
    headers: auth,
  });
}

export const userCheck = (id) => {
  return instance.post('idUserCheck/',{
    data: {
      id: id
    },
  });
}
  
export const register = async (email, password, dispatch) => {
  const response = await instance.post("register/", {
    email,
    password
  });
  LocalStorageTools.setItemToLocalStorage("tokens", response.data.tokens);
  dispatch(setUser(response.data));
  return response.data;;
}
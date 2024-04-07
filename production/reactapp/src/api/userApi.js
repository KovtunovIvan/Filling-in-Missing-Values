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
  return response;
}

export const getAllProjects = async () => {
  const auth = authHeader();
  const response = await instance.get("AllProjects/",{
      headers: auth,
    });
  return response.data;
}

export const createNewProject = async (file) => {
  const auth = authHeader();
  const response = await instance.post("upload-file/", file, {
      headers: auth,
    });
  return response.data;
}

export const getProjectByID = async (id) => {
  const auth = authHeader();
  const path = `get-project/${id}/`;
  const response = await instance.get(path, {
      headers: auth,
    });
  return response.data;
}

export const sendDataForProcessing = async (formData) => {
  const auth = authHeader();
  const project_id = formData.get("project_id");
  const method_fill_id = formData.get("method_fill_id");
  const method_scaling_id = formData.get("method_scaling_id");
  const path = `process-data/${project_id}/${method_fill_id}/${method_scaling_id}/`;
  const response = await instance.get(path, {
      headers: auth,
    });
  return response;
}

export const getFileByUrl = async (url) => {
  const auth = authHeader();
  const path = `${url}/`;
  const response = await instance.get(path, {
      headers: auth,
    });
  return response.data;
}
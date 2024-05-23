import { LocalStorageTools } from "../localStorage";
import authHeader  from "./headers";
import { setUser } from "../redux/userData";
import { URL_LOCAL, instance } from "./requests";


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

export const getAvatarByURL = (url) => {
  return `${URL_LOCAL}${url}`;
}

export const uploadAvatar = async (formData) => {
  const auth = authHeader();
  const response = await instance.post("upload-avatar/", formData, {
    headers: auth,
  });
  return response;
}

export const deleteAvatar = async () => {
  const auth = authHeader();
  const response = await instance.delete("delete-avatar/", {
    headers: auth,
  });
  return response;
}

export const updateProfile = async (formData) => {
  const auth = authHeader();
  const path = `update-profile/`;
  const response = await instance.put(path, formData, {
      headers: auth,
  });
  return response;
}

export const changePassword = async (formData) => {
  const auth = authHeader();
  const path = `change-password/`;
  const response = await instance.put(path, formData, {
    headers: auth,
  });
  return response;
}

export const deleteProfile = async (formData) => {
  const auth = authHeader();
  const path = `delete-profile/`;
  const response = await instance.delete(path, formData, {
    headers: auth,
  });
  return response;
}

export const restorePassword = async (email) => {
  const path = 'reset_password/'
  const formData = await new FormData();
  console.log(email)
  await formData.append("email", email)
  const response = await instance.post(path, formData);
  return response;
}

export const sendFeedBack = async (formData) => {
  const path = 'contact/'
  const response = await instance.post(path, formData);
  return response;
}

export const sendPresentationOrder = async (formData) => {
  const path = 'contact/'
  const response = await instance.post(path, formData);
  return response;
}

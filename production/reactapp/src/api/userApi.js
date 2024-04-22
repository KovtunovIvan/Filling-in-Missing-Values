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
  const middle_name = formData.get("middle_name");
  const first_name = formData.get("first_name");
  const last_name = formData.get("last_name");
  const phone_number = formData.get("phone_number");
  const path = `update-profile/${first_name}/${last_name}/${middle_name}/${phone_number}/`;
  const response = await instance.put(path, formData, {
      headers: auth,
    });
  return response;
}

export const changePassword = async (formData) => {
  const auth = authHeader();
  const old_password = formData.get("old_password");
  const new_password = formData.get("new_password");
  const path = `change-password/${old_password}/${new_password}/`;
  const response = await instance.put(path, formData, {
    headers: auth,
  });
  return response;
}

export const deleteProfile = async (formData) => {
  const auth = authHeader();
  const password = formData.get("password");
  const path = `delete-profile/${password}/`;
  const response = await instance.delete(path, {
    headers: auth,
    body: { password: password }
  });
  return response;
}

export const restorePassword = async (email) => {
  return {ok: true};
}

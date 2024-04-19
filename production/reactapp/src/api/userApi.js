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


export const uploadAvatar = async (file) => {
  const auth = authHeader();
  const response = await instance.post("upload-avatar/", {
    headers: auth,
    upload_file: file,
  });
  LocalStorageTools.setItemToLocalStorage("tokens", response.data.tokens);
  return response;
}

export const deleteAvatar = async (dispatch) => {
  const auth = authHeader();
  const response = await instance.post("delete-avatar/", {
    headers: auth,
  });
  LocalStorageTools.setItemToLocalStorage("tokens", response.data.tokens);
  dispatch(setUser(response.data));
  return response;
}

export const updateProfile = async (formData) => {
  const auth = authHeader();
  const middle_name = formData.get("middle_name");
  const first_name = formData.get("first_name");
  const last_name = formData.get("last_name");
  const phone_number = formData.get("phone_number");
  const path = `update-profile/${first_name}/${last_name}/${middle_name}/${phone_number}/`;
  const response = await instance.get(path, {
      headers: auth,
    });

  return response;
}

export const changePassword = async (formData) => {
  const auth = authHeader();
  const old_password = formData.old_password;
  const new_password = formData.new_password;
  const path = `change-password/${old_password}/${new_password}/`;
  const response = await instance.get(path, {
    headers: auth,
  });
  return response;
}

export const deleteProfile = async (formData) => {
  const auth = authHeader();
  const password = formData.password;
  const path = `delete-profile/${password}/`;
  const response = await instance.get(path, {
    headers: auth,
  });
  return response;
}

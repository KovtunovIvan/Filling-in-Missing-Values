import authHeader  from "./headers";
import { instance } from "./requests";


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
  const path = `https://127.0.0.1:8000/${url}/`;
  window.open(path);
}

export const getNormalDistribution = (id, columnName, file_type) => {
  const auth = authHeader();
  const path = `normal-distribution/${id}/${columnName}/${file_type}/`;
  return instance.get(path, {
    headers: auth,
    responseType: "arraybuffer"
  });
}

export const getCorrelationMatrix = (id, file_type) => {
  const auth = authHeader();
  const path = `correlation-matrix/${id}/${file_type}/`;
  return instance.get(path, {
    headers: auth,
    responseType: "arraybuffer"
  });
}

export const getBoxPlot = (id, columnName, file_type) => {
  const auth = authHeader();
  const path = `box-plot/${id}/${columnName}/${file_type}/`;
  return instance.get(path, {
    headers: auth,
    responseType: "arraybuffer"
  });
}

export const checkTaskStatus = (id) => {
  const auth = authHeader();
  const path = `check-task-status/${id}/`;
  return instance.get(path, {
    headers: auth,
  });
}

export const deleteProjectById = (id) => {
  const auth = authHeader();
  const path = `delete-project/${id}/`;
  return instance.delete(path, {
    headers: auth,
  });
}
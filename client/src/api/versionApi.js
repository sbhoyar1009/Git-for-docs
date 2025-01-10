import axios from "axios";

const apiUrl = "http://localhost:5001/api/version";

const API = axios.create({ baseURL: apiUrl });

// Add token to headers before every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.authorization = `Bearer ${token}`;
  }
  return req;
});

export const createCheckpoint = async (documentId, name, content) => {
  const response = await API.post(`/${documentId}`, {
    name: name,
    content: content,
  });
  return response;
};

export const fetchAllVersionsOfDocument = async (documentId) => {
  const response = await API.get(`/${documentId}`);
  return response.data;
};

export const rollbackToOldVersion = async (documentId,versionNo) => {
  const response = await API.put(`/rollback/${documentId}/${versionNo}`);
  return (response.data.message)
};


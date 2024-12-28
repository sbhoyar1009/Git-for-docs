import axios from "axios";

const apiUrl = "http://localhost:5001/api/user";
const API = axios.create({ baseURL: apiUrl });

// Attach token to headers for every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;



export const registerUser = async (username, password) => {
  const response = await axios.post(`${apiUrl}/register`, {
    username,
    password,
  });
  return response.data;
};

export const login = async (username, password) => {
    // console.log("API", username, password);
    // const response = await axios.post(`${apiUrl}/login`, {
    //   username,
    //   password,
    // });
    // return response.data;
  try {
    const response = await API.post("/login", { username, password });
    localStorage.setItem("token", response.data.token); // Save token
    return response.data;
  } catch (error) {
    // message.error("Login failed!");
  }
  };
  
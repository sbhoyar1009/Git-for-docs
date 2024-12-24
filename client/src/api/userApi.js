import axios from "axios";

const apiUrl = "http://localhost:5001/api/user";

export const registerUser = async (username, password) => {
  console.log("API", username, password);
  const response = await axios.post(`${apiUrl}/register`, {
    username,
    password,
  });
  return response.data;
};

export const login = async (username, password) => {
    console.log("API", username, password);
    const response = await axios.post(`${apiUrl}/login`, {
      username,
      password,
    });
    return response.data;
  };
  
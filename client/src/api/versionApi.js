import axios from "axios";

const apiUrl = "http://localhost:5001/api/version"

export const createCheckpoint = async (documentId,name,content) => {
    const response = await axios.post(`${apiUrl}/${documentId}`,{
        name : name,
        content: content
    })
    return response;
  };
  
import axios from 'axios';


const apiUrl = 'http://localhost:5001/api/text';



const API = axios.create({ baseURL: apiUrl });

// Add token to headers before every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.authorization = `Bearer ${token}`;
  }
  return req;
});

// Fetch all text documents
export const fetchAllTexts = async (userId) => {
  try {
    const response = await API.get(`/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
};

// Fetch a specific text document by its slug
export const fetchTextBySlug = async (userId,slug) => {
  try {
    const response = await API.get(`/${userId}/${slug}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching document by slug:', error);
    throw error;
  }
};

// Save the updated text (both title and content)
export const saveText = async (slug, { title, content,userId }) => {
  try {
    if (slug=="untitled"){
      await API.post(`/`, { title, content,userId });
    }else{
      await axios.put(`${apiUrl}/${slug}`, { title, content });
    }
  } catch (error) {
    console.error('Error saving document:', error);
    throw error;
  }
};

export const branchDocument = async (slug) => {
  try {
    const response = await API.post(`/${slug}/branch`);
    return response.data;
  } catch (error) {
    console.error('Error creating branch:', error);
    throw error;
  }
};
// Fetch differences between parent and child documents
export const getDifferences = async (slug) => {
  try {
    const response = await API.get(`/${slug}/differences`);
    return response.data.diffResult;
  } catch (error) {
    console.error('Error fetching differences:', error);
    throw error;
  }
};


export const getParentContent = async (slug) => {
  const response = await API.get(`/documents/${slug}/parent-content`);

  return response.data;
};

export const fetchDocumentTree = async () => {
  const response = await API.get(`/document/tree`);
  if (response.statusText!="OK") {
    throw new Error('Failed to fetch document tree');
  }
  return response.data;
};

export const mergeToParent = async (slug) => {
  const response = await API.post(`/merge/${slug}`);
  return response.data;
};

export const getDocumentStatistics = async (id) => {
  const response = await API.get(`/statistics/${id}`);
  return response.data.stats;
};
import axios from 'axios';

const apiUrl = 'http://localhost:5001/api/text';

// Fetch all text documents
export const fetchAllTexts = async () => {
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
};

// Fetch a specific text document by its slug
export const fetchTextBySlug = async (slug) => {
  try {
    const response = await axios.get(`${apiUrl}/${slug}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching document by slug:', error);
    throw error;
  }
};

// Save the updated text (both title and content)
export const saveText = async (slug, { title, content }) => {
  try {
    if (slug=="untitled"){
      await axios.post(`${apiUrl}/`, { title, content });
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
    const response = await axios.post(`${apiUrl}/${slug}/branch`);
    return response.data;
  } catch (error) {
    console.error('Error creating branch:', error);
    throw error;
  }
};
// Fetch differences between parent and child documents
export const getDifferences = async (slug) => {
  try {
    const response = await axios.get(`${apiUrl}/${slug}/differences`);
    console.log("Response is..",response.data.diffResult)
    return response.data.diffResult;
  } catch (error) {
    console.error('Error fetching differences:', error);
    throw error;
  }
};


export const getParentContent = async (slug) => {
  const response = await axios.get(`${apiUrl}/documents/${slug}/parent-content`);
  // console.log(response.data)
  // if (!response.ok) {
  //   throw new Error('Failed to fetch parent content');
  // }

  return response.data;
};

export const fetchDocumentTree = async () => {
  const response = await axios.get(`${apiUrl}/document/tree`);
  console.log(response)
  if (response.statusText!="OK") {
    throw new Error('Failed to fetch document tree');
  }
  return response.data;
};

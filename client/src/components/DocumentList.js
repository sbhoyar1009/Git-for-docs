import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllTexts } from '../api/textApi';
import NewDocumentButton from './NewDocumentButton';

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const getDocuments = async () => {
      try {
        const allTexts = await fetchAllTexts();
        setDocuments(allTexts);
      } catch (error) {
        alert('Error fetching documents');
      }
    };
    getDocuments();
  }, []);

  return (
    <div>
      <h1>Documents</h1>
      <NewDocumentButton />
      <ul>
        {documents.map((document) => (
          <li key={document._id}>
            <Link to={`/document/${document.slug}`}>{document.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentList;

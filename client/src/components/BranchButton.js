import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { branchDocument } from '../api/textApi';

const BranchButton = ({ slug }) => {
  const navigate = useNavigate();

  const handleBranch = async () => {
    try {
      const response = await branchDocument(slug);
      alert('Branch created successfully!');
      navigate(`/document/${response.branchedDoc.slug}`);
    } catch (error) {
      alert('Error creating branch');
    }
  };

  return <button onClick={handleBranch}>Branch</button>;
};

export default BranchButton;

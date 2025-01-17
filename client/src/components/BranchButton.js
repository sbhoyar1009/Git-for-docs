import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { branchDocument } from "../api/textApi";
import { Button } from "antd";
import { BranchesOutlined } from "@ant-design/icons";

const BranchButton = ({ slug }) => {
  const navigate = useNavigate();

  const handleBranch = async () => {
    try {
      const response = await branchDocument(slug);
      alert("Branch created successfully!");
      navigate(`/document/${response.branchedDoc.slug}`);
    } catch (error) {
      alert("Error creating branch");
    }
  };

  return (
    <Button style={{ marginLeft: "10px" }} onClick={handleBranch}>
      <BranchesOutlined />
      Create a branch
    </Button>
  );
};

export default BranchButton;

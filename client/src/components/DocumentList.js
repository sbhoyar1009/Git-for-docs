import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchAllTexts } from "../api/textApi";
import NewDocumentButton from "./NewDocumentButton";
import Navbar from "./Navbar";
import { Button, DatePicker, Table } from "antd";
import DocumentStats from "./DocumentStats";

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();

  const handleViewDocument = (id) => {
    // Navigate to the document viewer page or handle logic
    // console.log("View document with ID:", id);
    navigate(`/document/${id}`);
  };

  useEffect(() => {
    const getDocuments = async () => {
      try {
        const allTexts = await fetchAllTexts();

        setDocuments(allTexts);
      } catch (error) {
        alert("Error fetching documents");
      }
    };
    getDocuments();
  }, []);
  const columns = [
    {
      title: "Sr. No.",
      key: "srno",
      render: (_, __, index) => index + 1, // Display serial number
    },
    // {
    //   title: "ID",
    //   dataIndex: "_id",
    //   key: "id",
    // },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      render: (text) => (text ? text : "N/A"), // Display "N/A" if slug is not present
    },
    {
      title: "View Document",
      key: "action",
      render: (_, record) => (
        <Button onClick={() => handleViewDocument(record.slug)}>
          View Document
        </Button>
      ),
    },
    {
      title: "View Document Stats",
      key: "action",
      render: (_, record) => (
        <DocumentStats documentId={record._id} />
      ),
    },
  ];

  return (
    <div style={{padding:"1rem"}}>
      <div>
      <h2>Documents</h2>
      <NewDocumentButton />
      </div>
      {documents && (
        <Table
          columns={columns}
          dataSource={documents}
          rowKey={(record) => record._id}
          pagination={false} // Disable pagination for main table
          // style={{ padding: "1rem" }}
        />
      )}
    </div>
  );
};

export default DocumentList;

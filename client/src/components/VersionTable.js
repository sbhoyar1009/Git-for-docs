import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchAllTexts } from "../api/textApi";
import NewDocumentButton from "./NewDocumentButton";
import Navbar from "./Navbar";
import { Button, DatePicker, Table } from "antd";
import DocumentStats from "./DocumentStats";
import { useSelector } from "react-redux";
import { fetchAllVersionsOfDocument } from "../api/versionApi";
import Modal from "antd/es/modal/Modal";
import { RollbackOutlined } from "@ant-design/icons";

const HtmlContentModal = ({ visible, title, htmlContent, onClose }) => {
  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
      width={800} // Optional: Set custom width
    >
      {/* Render the HTML content */}
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </Modal>
  );
};

const VersionTable = () => {
  const [documents, setDocuments] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const htmlContent = `
    <h2>Document Title</h2>
    <p>This is a paragraph with <strong>bold text</strong> and <em>italicized text</em>.</p>
    <ul>
      <li>List item 1</li>
      <li>List item 2</li>
    </ul>
  `;
  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };
  const navigate = useNavigate();
  const location = useLocation();
  const userId = useSelector((state) => state.user.userId);
  const documentID = location.pathname.split('/')[2]

  useEffect(() => {
    const getDocuments = async () => {
      try {
        const allTexts = await fetchAllVersionsOfDocument(documentID);
        console.log(allTexts);
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
    {
      title: "Title",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Version Number",
      dataIndex: "version",
      key: "version",
    },
    {
      title: "View Document",
      key: "action",
      render: (_, record) => (
        <>
          <Button onClick={handleOpenModal}>View Content</Button>
          <HtmlContentModal
            visible={isModalVisible}
            title={record.name}
            htmlContent={record.content}
            onClose={handleCloseModal}
          />
        </>
      ),
    },
    {
      title: "Rollback to this version",
      key: "action",
      render: (_, record) => (
        <Button onClick={handleOpenModal}>
          <RollbackOutlined />
          Rollback Content
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "1rem" }}>
      <div></div>
      {documents && (
        <Table
          columns={columns}
          dataSource={documents}
          rowKey={(record) => record._id}
          pagination={false} // Disable pagination for main table
        />
      )}
    </div>
  );
};

export default VersionTable;
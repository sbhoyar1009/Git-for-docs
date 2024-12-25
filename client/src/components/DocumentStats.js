import React, { useState } from "react";
import { Modal, Button, Typography, List, Spin, message } from "antd";
import { getDocumentStatistics } from "../api/textApi";

const { Title } = Typography;

const DocumentStats = ({documentId}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState(null);

  // Fetch stats when modal is opened
  const fetchStats = async () => {
    setLoading(true);
    try {
      const stats = await getDocumentStatistics(documentId);
      setStatistics(stats);
    } catch (error) {
      message.error("Failed to fetch document statistics.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setIsModalOpen(true);
    fetchStats(); // Fetch stats when opening the modal
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setStatistics(null); // Reset stats
  };

  return (
    <>
      <Button onClick={handleOpen}>
        View Document Statistics
      </Button>
      <Modal
        title="Document Statistics"
        visible={isModalOpen}
        onCancel={handleClose}
        footer={[
          <Button key="close" onClick={handleClose}>
            Close
          </Button>,
        ]}
      >
        {loading ? (
          <Spin size="large" />
        ) : statistics ? (
          <div>
            <Title level={4}>{statistics.title}</Title>
            <List>
              <List.Item>Word Count: {statistics.wordCount}</List.Item>
              <List.Item>
                Character Count: {statistics.characterCount}
              </List.Item>
              <List.Item>Child Documents: {statistics.childCount}</List.Item>
              <List.Item>
                Created At: {new Date(statistics.createdAt).toLocaleString()}
              </List.Item>
              <List.Item>
                Last Updated: {new Date(statistics.updatedAt).toLocaleString()}
              </List.Item>
            </List>
          </div>
        ) : (
          <Typography.Text>No statistics available</Typography.Text>
        )}
      </Modal>
    </>
  );
};

export default DocumentStats;

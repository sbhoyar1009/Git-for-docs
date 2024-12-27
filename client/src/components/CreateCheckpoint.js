import React, { useState } from "react";
import { Button, Modal, Input, message } from "antd";
import { createCheckpoint } from "../api/versionApi"; // API call to create checkpoint
import { CheckOutlined } from "@ant-design/icons";

const CreateCheckpoint = ({ id, content }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [checkpointName, setCheckpointName] = useState("");
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    if (!checkpointName) {
      message.error("Please enter a name for the checkpoint!");
      return;
    }

    setLoading(true);
    try {
      // Call the API to create a checkpoint
      await createCheckpoint(id, checkpointName, content);
      message.success("Checkpoint created successfully!");
      setIsModalVisible(false);
      setCheckpointName(""); // Clear input field after success
    } catch (error) {
      message.error("Error creating checkpoint!");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCheckpointName(""); // Clear input field if user cancels
  };

  return (
    <>
      <Button onClick={showModal} style={{ marginLeft: "10px" }}>
      <CheckOutlined />  Create Checkpoint
      </Button>
      <Modal
        title="Create Checkpoint"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
        okText="Create"
        cancelText="Cancel"
      >
        <Input
          placeholder="Enter checkpoint name"
          value={checkpointName}
          onChange={(e) => setCheckpointName(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default CreateCheckpoint;

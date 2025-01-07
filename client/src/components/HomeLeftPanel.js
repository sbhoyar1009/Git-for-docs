import React from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { DoubleRightOutlined } from "@ant-design/icons";
const { Title } = Typography;

export default function HomeLeftPanel() {
  return (
    <div className="features-section">
      <Title level={2} style={{ color: "#fff" }}>
        Welcome to Our App
      </Title>
      <ul className="features-list">
        <li>
          <DoubleRightOutlined /> <strong>Version Control : </strong>
          Track all changes and create checkpoints for documents, allowing users
          to view, compare, and roll back to previous versions with ease
        </li>
        <li>
          <DoubleRightOutlined /> <strong>Secure Payment Integration: </strong>
          Track all changes and create checkpoints for documents, allowing users
          to view, compare, and roll back to previous versions with ease
        </li>
      </ul>
    </div>
  );
}

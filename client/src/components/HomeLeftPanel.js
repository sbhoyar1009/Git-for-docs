import React from "react";
import { Form, Input, Button, Typography, message } from "antd";
const { Title } = Typography;

export default function HomeLeftPanel() {
  return (
    <div className="features-section">
      <Title level={2} style={{ color: "#fff" }}>
        Welcome to Our App
      </Title>
      <ul className="features-list">
        <li>✔️ Feature 1</li>
        <li>✔️ Feature 2</li>
        <li>✔️ Feature 3</li>
        <li>✔️ Feature 4</li>
        <li>✔️ Feature 5</li>
      </ul>
    </div>
  );
}

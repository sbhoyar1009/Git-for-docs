import React, { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { registerUser } from "../api/userApi";
import HomeLeftPanel from "./HomeLeftPanel";

const { Title } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values) => {
    const { username, password } = values;

    setLoading(true);
    try {
      const response = await registerUser(username, password);
    } catch (error) {
      message.error("Error registering user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left Side - Features */}
      <HomeLeftPanel />

      {/* Right Side - Login */}
      <div className="login-form-section">
        <div className="login-form-section">
          <div className="form-container">
            <Title level={2}>Register</Title>
            <Form
              name="register"
              onFinish={handleRegister}
              layout="vertical"
              autoComplete="off"
            >
              <Form.Item
                label="Username"
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                  { min: 4, message: "Username must be at least 4 characters" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                  { min: 6, message: "Password must be at least 6 characters" },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  style={{ width: "100%" }}
                >
                  Register
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

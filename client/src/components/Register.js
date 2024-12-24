import React, { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { registerUser } from "../api/userApi";

const { Title } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values) => {
    console.log(values)
    const { username, password } = values;

    setLoading(true);
    try {
      const response = await registerUser(username,password)
      console.log(response)
    } catch (error) {
      message.error("Error registering user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
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
  );
};

export default Register;

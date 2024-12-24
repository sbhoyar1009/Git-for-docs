import React, { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { login } from "../api/userApi";

const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    const { username, password } = values;

    setLoading(true);
    try {
      const response = await login(username,password);
    } catch (error) {
      message.error("Error logging in");
    } finally {
      setLoading(false);
    }
  };

  // return (
  //   <div style={{ maxWidth: 400, margin: "50px auto" }}>
  //     <Title level={2}>Login</Title>
  //     <Form
  //       name="login"
  //       onFinish={handleLogin}
  //       layout="vertical"
  //       autoComplete="off"
  //     >
  //       <Form.Item
  //         label="Username"
  //         name="username"
  //         rules={[{ required: true, message: "Please input your username!" }]}
  //       >
  //         <Input />
  //       </Form.Item>
  //       <Form.Item
  //         label="Password"
  //         name="password"
  //         rules={[{ required: true, message: "Please input your password!" }]}
  //       >
  //         <Input.Password />
  //       </Form.Item>
  //       <Form.Item>
  //         <Button
  //           type="primary"
  //           htmlType="submit"
  //           loading={loading}
  //           style={{ width: "100%" }}
  //         >
  //           Login
  //         </Button>
  //       </Form.Item>
  //     </Form>
  //   </div>
  // );
  return (
    <div className="login-page">
      {/* Left Side - Features */}
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

      {/* Right Side - Login */}
      <div className="login-form-section">
        <div className="form-container">
          <Title level={2}>Login</Title>
          <Form
            name="login"
            onFinish={handleLogin}
            layout="vertical"
            autoComplete="off"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: "Please input your username!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please input your password!" }]}
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
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );

};

export default Login;

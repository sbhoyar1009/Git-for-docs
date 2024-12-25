import React, { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { login } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import HomeLeftPanel from "./HomeLeftPanel";

const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const handleLogin = async (values) => {
    const { username, password } = values;
    setLoading(true);
    try {
      const response = await login(username,password);
      console.log(response.message)
      if(response?.message==="Login successful"){
        message.success("Login successful!"); // Show success popup
        navigate("/documents");
      }else {
        message.error(response.message || "Login failed!"); // Show error popup
      }
    } catch (error) {
      message.error("Error logging in");
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
              <div style={{margin:"1rem"}}>Not an user? <a href="/register">Register</a> here</div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );

};

export default Login;

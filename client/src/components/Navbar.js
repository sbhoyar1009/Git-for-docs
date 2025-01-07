import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Assuming you're using React Router for routing
import { Dropdown, Menu, Layout, Button } from "antd";
import { BranchesOutlined, HomeFilled, HomeOutlined, LogoutOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";

const { Header } = Layout;

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem("token");
    // Redirect to login page
    navigate("/");
  };

  const profileMenu = (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />}>
        <Link to="/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="2" icon={<SettingOutlined />}>
        <Link to="/settings">Settings</Link>
      </Menu.Item>
      <Menu.Item key="3" icon={<HomeOutlined />}>
        <Link to="/documents">Home</Link> {/* Home Button */}
      </Menu.Item>
      <Menu.Item key="4" icon={<BranchesOutlined />}>
        <Link to="/document/tree">Tree View</Link> {/* Tree View Button */}
      </Menu.Item>
      <Menu.Item key="5" icon={<LogoutOutlined />}>
        <Button type="link" onClick={handleLogout} style={{ padding: 0 }}>
          Logout
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        width: "100%",
        display: "flex",
        alignItems: "center",
        background: "#001529", // Default Ant Design dark theme color
        padding: "0 16px",
      }}
    >
      <div
        style={{
          color: "#fff",
          fontWeight: "bold",
          fontSize: "18px",
          marginRight: "auto",

        }}
      >
        AppLogo
      </div>

      {/* Profile Dropdown */}
      <div style={{marginRight: '1rem'}}>
      <Dropdown overlay={profileMenu} trigger={["click"]} >
        <Button type="text" icon={<UserOutlined />} style={{ color: "#fff" }}>
          Profile
        </Button>
      </Dropdown>
      </div>
    </Header>
  );
}

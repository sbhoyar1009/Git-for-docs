import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Assuming you're using React Router for routing
import { Breadcrumb, Button, Layout, Menu, theme } from "antd";
const { Header, Content, Footer } = Layout;

export default function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem("token");
    // Redirect to login page
    navigate("/");
  };
  const items = [
    {
      key: "1",
      label: <Link to="/documents">Home</Link>, // Link to Home page
    },
    {
      key: "2",
      label: <Link to="/document/tree">Tree View</Link>, // Link to Document Tree View
    },
    {
      key: "3",
      label: (
        <Button onClick={handleLogout}>
          Logout
        </Button>
      ), // Link to Home page
    },
  ];
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
          marginRight: "20px",
        }}
      >
        AppLogo
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["1"]}
        items={items}
        style={{
          marginLeft: "auto", // Push the menu to the right
          marginRight: "2rem",
          minWidth: 0,
        }}
      />
    </Header>
  );
}

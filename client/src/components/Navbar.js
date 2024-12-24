import React from "react";
import { Link } from "react-router-dom"; // Assuming you're using React Router for routing
import { Breadcrumb, Layout, Menu, theme } from "antd";
const { Header, Content, Footer } = Layout;


const items = [
  {
    key: "1",
    label: <Link to="/">Home</Link>, // Link to Home page
  },
  {
    key: "2",
    label: <Link to="/document/tree">Tree View</Link>, // Link to Document Tree View
  },
];

export default function Navbar() {
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

import React from "react";
import "../src/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DocumentList from "./components/DocumentList";
import DocumentDetail from "./components/DocumentDetail";
import DocumentTreeView from "./components/DocumentTreeView";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import VersionTable from "./components/VersionTable";
import Payment from "./components/Payment";
import Profile from "./components/Profile";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/documents"
          element={
            <PrivateRoute>
              <DocumentList />
            </PrivateRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PrivateRoute>
              <Register />
            </PrivateRoute>
          }
        />

        <Route
          path="/document/:slug"
          element={
            <PrivateRoute>
              <DocumentDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/document/:id/versions"
          element={
            <PrivateRoute>
              <VersionTable />
            </PrivateRoute>
          }
        />
        <Route
          path="/document/tree"
          element={
            <PrivateRoute>
              <DocumentTreeView />
            </PrivateRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <PrivateRoute>
              <Payment />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

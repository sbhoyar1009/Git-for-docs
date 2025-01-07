import React from 'react';
import "../src/App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DocumentList from './components/DocumentList';
import DocumentDetail from './components/DocumentDetail';
import DocumentTreeView from './components/DocumentTreeView';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import VersionTable from './components/VersionTable';
import Payment from './components/Payment';
import Profile from './components/Profile';

const App = () => {
  return (

    <Router>
      <Navbar />
      <Routes>
        <Route path="/documents" element={<DocumentList />} />
        <Route path='/register' element={<Register />} />
        <Route path='/' element={<Login />} />

        <Route path="/document/:slug" element={<DocumentDetail />} />
        <Route path="/document/:id/versions" element={<VersionTable />} />
        <Route path="/document/tree" element={<DocumentTreeView />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default App;

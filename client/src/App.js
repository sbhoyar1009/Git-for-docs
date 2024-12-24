import React from 'react';
import "../src/App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DocumentList from './components/DocumentList';
import DocumentDetail from './components/DocumentDetail';
import DocumentTreeView from './components/DocumentTreeView';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';

const App = () => {
  return (

    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<DocumentList />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />

        <Route path="/document/:slug" element={<DocumentDetail />} />
        <Route path="/document/tree" element={<DocumentTreeView />} />
          {/* <Route path="/document/:slug" element={<TextEditor />} /> */}
      </Routes>
    </Router>
  );
};

export default App;

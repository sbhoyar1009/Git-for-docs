import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DocumentList from './components/DocumentList';
import DocumentDetail from './components/DocumentDetail';
import TextEditor from './components/TextEditor';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DocumentList />} />
        <Route path="/document/:slug" element={<DocumentDetail />} />
          {/* <Route path="/document/:slug" element={<TextEditor />} /> */}
      </Routes>
    </Router>
  );
};

export default App;

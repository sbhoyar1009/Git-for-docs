import React from 'react';

const DiffViewer = ({ diff }) => {
  return (
    <div
      style={{
        backgroundColor: '#f9f9f9',
        padding: '10px',
        borderRadius: '5px',
        lineHeight: '1.6',
        maxWidth: '100%',
        wordWrap: 'break-word',
      }}
    >

          <div key={diff.index} style={{ marginBottom: '10px' }}>
                <span key={diff.index} >
                  {diff.difference}
                </span>
          </div>

    </div>
  );
};

export default DiffViewer;



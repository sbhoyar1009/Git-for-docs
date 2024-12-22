import React from 'react';

const DiffViewer = ({ diff }) => {
  console.log(diff)
  // const style = {
  //   backgroundColor: diff.parent ? '#d4fcdc' : diff.child ? '#fcdcdc' : 'transparent',
  //   color: diff.child ? '#d9534f' : diff.parent ? '#5cb85c' : 'black',
  //   textDecoration: diff.child ? 'line-through' : 'none',
  //   padding: '0 2px',
  //   display: 'inline',
  // };
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



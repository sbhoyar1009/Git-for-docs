import React from 'react';

const SaveButton = ({ onClick, isSaving }) => {
  return (
    <button onClick={onClick} disabled={isSaving} style={{ marginTop: '10px' }}>
      {isSaving ? 'Saving...' : 'Save Document'}
    </button>
  );
};

export default SaveButton;

import { Button } from 'antd';
import React from 'react';

const SaveButton = ({ onClick, isSaving }) => {
  return (
    <Button onClick={onClick} disabled={isSaving} style={{ marginTop: '10px' }}>
      {isSaving ? 'Saving...' : 'Save Document'}
    </Button>
  );
};

export default SaveButton;

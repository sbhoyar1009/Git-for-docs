import React, { useState } from 'react';
import { getDifferences } from '../api/textApi';
import { Button } from 'antd';

const CompareChangesButton = ({ slug }) => {
  const [differences, setDifferences] = useState(null);

  const handleCompare = async () => {
    try {
      const diff = await getDifferences(slug);
      setDifferences(diff);
    } catch (error) {
      alert('Error fetching differences');
    }
  };

  return (
    <div>
      <Button onClick={handleCompare}>Compare Changes</Button>
      {differences && (
        <div>
          <h3>Differences:</h3>
          <pre>{JSON.stringify(differences, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CompareChangesButton;

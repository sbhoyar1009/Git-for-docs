import React from "react";
import Tree from "react-d3-tree";

const DocumentTree = ({ data }) => {
  const containerStyles = {
    width: "100%",
    height: "500px",
    border: "1px solid #ddd",
    padding: "10px",
    borderRadius: "8px",
  };

  return (
    <div style={containerStyles}>
      <Tree
        data={data}
        orientation="vertical"
        translate={{ x: 200, y: 200 }}
        collapsible={true}
        nodeSize={{ x: 200, y: 100 }}
        separation={{ siblings: 1, nonSiblings: 2 }}
      />
    </div>
  );
};

export default React.memo(DocumentTree);

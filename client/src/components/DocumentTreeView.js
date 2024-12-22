import React, { useEffect, useState } from "react";
import DocumentTree from "./DocumentTree";
import Tree from "react-d3-tree";
import { fetchDocumentTree } from "../api/textApi";

const DocumentTreeView = () => {
  const [treeData, setTreeData] = useState(null);

  useEffect(() => {
    const getTreeData = async () => {
      try {
        if (!treeData) { // Prevent unnecessary fetches
          const data = await fetchDocumentTree();
          setTreeData(data);
        }
      } catch (error) {
        console.error("Error fetching tree data:", error);
      }
    };
    getTreeData();
  }, [treeData]); // Depend only on `treeData`

  const containerStyles = {
    width: "100%",
    height: "500px",
    border: "1px solid #ddd",
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "8px",
  };

  return (
    <div>
      <h1>Document Hierarchy</h1>
      {treeData && treeData.length > 0 ? (
        treeData.map((tree, index) => (
          <div key={index} style={containerStyles}>
            <h3>Tree {index + 1}</h3>
            <Tree
              data={tree}
              orientation="vertical"
              translate={{ x: 200, y: 200 }}
              collapsible={true}
              nodeSize={{ x: 200, y: 100 }}
              separation={{ siblings: 1, nonSiblings: 2 }}
            />
          </div>
        ))
      ) : (
        <p>Loading tree data...</p>
      )}
    </div>
  );
};


export default DocumentTreeView;

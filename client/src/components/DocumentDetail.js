import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  fetchTextBySlug,
  saveText,
  getDifferences,
  getParentContent,
  mergeToParent,
} from "../api/textApi";
import TextEditor from "./TextEditor";
import SaveButton from "./SaveButton";
import BranchButton from "./BranchButton";
import DiffViewer from "./DiffViewer";
import { Button } from "antd";
import { Input } from "antd";
import {
  LeftOutlined,
  MergeOutlined,
  RightOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import CreateCheckpoint from "./CreateCheckpoint";
import { useSelector } from "react-redux";
import ExportPDF from "./ExportPDF";
import ExportToDocx from "./ExportToDocx";

const { TextArea } = Input;

const DocumentDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = useSelector((state) => state.user.userId);
  const [document, setDocument] = useState(null);
  const [title, setTitle] = useState("Untitled Document");
  const [content, setContent] = useState("<p>Start writing...</p>");
  const [paragraphDiffs, setParagraphDiffs] = useState(null);
  const [showDifferences, setShowDifferences] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [parent, setParent] = useState(null);
  const [documentID, setDocumentID] = useState(null);

  useEffect(() => {
    const getDocument = async () => {
      if (slug == "untitled") {
        // Handle case where slug is undefined or blank
        setDocument({
          title: "Untitled Document",
          content: "<p>Start writing...</p>",
        });
        setTitle("Untitled Document");
        setContent("<p>Start writing...</p>");
        return;
      }

      try {
        const documentData = await fetchTextBySlug(userId,slug);
        setDocument(documentData);
        setDocumentID(documentData._id);
        setTitle(documentData.title);
        setContent(documentData.content);
        setParent(documentData?.parent);
      } catch (error) {
        alert("Document not found");
      }
    };
    getDocument();
  }, [slug]);

  const handleCompareChanges = async () => {
    try {
      const paragraphDiffs = await getDifferences(slug);
      setParagraphDiffs(paragraphDiffs);
      setShowDifferences(true);
    } catch (error) {
      alert("Error fetching differences");
    }
  };

  const handleSaveText = async () => {
    setIsSaving(true);
    try {
      await saveText(slug, { title, content,userId });
      alert("Document saved successfully");
      // navigate("/documents");
    } catch (error) {
      alert("Error saving document");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToParent = async () => {
    if (!document?.parent) {
      alert("No parent document available for this branch.");
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to reset to the parent content? All unsaved changes will be lost."
      )
    ) {
      return;
    }

    try {
      setIsResetting(true);
      const response = await getParentContent(slug);
      setContent(response.parentContent);
      alert("Content has been reset to parent version.");
    } catch (error) {
      alert("Failed to reset content to parent.");
    } finally {
      setIsResetting(false);
    }
  };

  const handleMergeToParent = async () => {
    if (!document?.parent) {
      alert("No parent document available for this branch.");
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to merge this document into its parent? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await mergeToParent(slug);
      alert("Merged successfully.");
      navigate(`/documents/${response.parentDocument.slug}`); // Redirect to the parent document
    } catch (error) {
      alert("Error merging documents.");
    }
  };

  const handlePreviousVersions = async()=>{
    navigate(`/document/${document._id}/versions`)
  }

  return (
    <div>
      {document ? (
        <>
        
          <div style={{ margin: "1rem" }}>
            <TextArea
              placeholder="Autosize height based on content lines"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoSize
              style={{ padding: "1rem" }}
            />
            <>              <Button onClick={handlePreviousVersions} style={{"margin":"10px"}}>View Previous Versions</Button>
            <TextEditor text={content} onChange={setContent} />
            </>

            <div
              style={{
                marginTop: "40px",
                marginLeft: "50px",
              }}
            >
              <SaveButton onClick={handleSaveText} isSaving={isSaving} />
              <BranchButton slug={slug} />
              <ExportToDocx htmlContent={document.content}/>
              {documentID && <CreateCheckpoint id={documentID} content={content} />}
              {document?.parent && (
                <>
                  <Button
                    onClick={handleCompareChanges}
                    style={{ marginLeft: "10px" }}
                  >
                    <LeftOutlined />
                    <RightOutlined />
                    Compare Changes
                  </Button>
                  <Button
                    onClick={handleResetToParent}
                    style={{
                      marginLeft: "10px",
                    }}
                    disabled={isResetting}
                  >
                    <RollbackOutlined />
                    {isResetting ? "Resetting..." : "Rollback to Parent"}
                  </Button>

                  <Button
                    onClick={handleMergeToParent}
                    style={{ marginLeft: "10px" }}
                  >
                    <MergeOutlined />
                    Merge to Parent
                  </Button>
                </>
              )}

            </div>

            {showDifferences && paragraphDiffs && (
              <div style={{ marginTop: "20px" }}>
                <h3>Paragraph Differences:</h3>
                {paragraphDiffs.map((paraDiff, index) => (
                  <div key={index} style={{ marginBottom: "20px" }}>
                    <h4>Paragraph {index + 1}:</h4>
                    <DiffViewer diff={paraDiff} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DocumentDetail;

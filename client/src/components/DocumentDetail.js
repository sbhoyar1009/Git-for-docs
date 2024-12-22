import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchTextBySlug,
  saveText,
  getDifferences,
  getParentContent,
} from "../api/textApi";
import TextEditor from "./TextEditor";
import SaveButton from "./SaveButton";
import BranchButton from "./BranchButton";
import DiffViewer from "./DiffViewer";

const DocumentDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [document, setDocument] = useState(null);
  const [title, setTitle] = useState("Untitled Document");
  const [content, setContent] = useState("<p>Start writing...</p>");
  const [paragraphDiffs, setParagraphDiffs] = useState(null);
  const [showDifferences, setShowDifferences] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [parent,setParent] = useState(null);

  useEffect(() => {
    console.log(slug)
    const getDocument = async () => {
      if (slug=="untitled") {
        // Handle case where slug is undefined or blank
        setDocument({ title: "Untitled Document", content: "<p>Start writing...</p>" });
        setTitle("Untitled Document");
        setContent("<p>Start writing...</p>");
        return;
      }

      try {
        const documentData = await fetchTextBySlug(slug);
        setDocument(documentData);
        setTitle(documentData.title);
        setContent(documentData.content);
        setParent(documentData?.parent)
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
      await saveText(slug, { title, content });
      alert("Document saved successfully");
      navigate("/");
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

  return (
    <div>
      {document ? (
        <>
          <h1>Edit Document</h1>
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              style={{ fontSize: "24px", width: "100%", marginBottom: "20px" }}
            />
            <div>{parent?parent:"This is parent doc"}</div>
            <TextEditor text={content} onChange={setContent} />

            <div style={{ marginTop: "20px" }}>
              <SaveButton onClick={handleSaveText} isSaving={isSaving} />
              <BranchButton slug={slug} />
              <button
                onClick={handleCompareChanges}
                style={{ marginLeft: "10px" }}
              >
                Compare Changes
              </button>
              <button
                onClick={handleResetToParent}
                style={{
                  marginLeft: "10px",
                  backgroundColor: "orange",
                  color: "white",
                }}
                disabled={isResetting}
              >
                {isResetting ? "Resetting..." : "Reset to Parent"}
              </button>
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

import React from "react";
import { useNavigate } from "react-router-dom";

export default function NewDocumentButton() {
    const navigate = useNavigate();
    const handleOnClick = ()=>{
        navigate("/document/untitled");
    }
  return <button onClick={handleOnClick}>New Doc</button>;
}

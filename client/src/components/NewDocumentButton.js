import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Flex } from 'antd';

export default function NewDocumentButton() {
    const navigate = useNavigate();
    const handleOnClick = ()=>{
        navigate("/document/untitled");
    }

  return (
    <Button onClick={handleOnClick}>New Document</Button>
  )
}

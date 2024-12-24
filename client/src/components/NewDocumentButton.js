import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Flex } from 'antd';
import { PlusOutlined } from "@ant-design/icons";

export default function NewDocumentButton() {
    const navigate = useNavigate();
    const handleOnClick = ()=>{
        navigate("/document/untitled");
    }

  return (
    <Button style={{margin:"1rem"}}onClick={handleOnClick}><PlusOutlined />New Document</Button>
  )
}

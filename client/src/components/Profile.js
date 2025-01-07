import React, { useEffect, useState } from "react";
import { Card, Form, Input, Button, DatePicker, Modal, message } from "antd";
import moment from "moment";
import axios from "axios"; // To make API calls
import { useSelector } from "react-redux";
import { getUserData } from "../api/userApi";

const Profile = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userData,setUserData] = useState({});
  const userId = useSelector((state) => state.user.userId);

  useEffect(async()=>{
    const response = await getUserData(userId);
    console.log("Profile response is ...", response)
    setUserData(response)
  },[])


  const [selectedDate, setSelectedDate] = useState(null);

  // Handle change event when a date is selected
  const handleChange = (date) => {
    if (date && date.isValid()) {
      setSelectedDate(date);
      message.success(`Selected date: ${date.format('YYYY-MM-DD')}`);
    } else {
      message.error('Invalid date');
    }
  };
  const handleEditProfile = () => {
    setIsModalVisible(true);
    form.setFieldsValue(userData); // Pre-fill the form with user info
  };

  const handleFormSubmit = async (values) => {
    console.log("Form Submitted:", values);
    
    setIsModalVisible(false);

    try {
      // Send updated data to backend (Replace `apiUrl` with your actual API URL)
      const response = await axios.put("http://localhost:5001/api/user/profile", {
        ...values,
        userId: userId,
      });

      message.success("Profile updated successfully!");
      console.log("Updated User:", response.data);
      window.location.reload()
    } catch (error) {
      message.error("Failed to update profile");
      console.error(error);
    }
  };

  const handleFormFailure = (errorInfo) => {
    console.log("Validation Failed:", errorInfo);
    message.error("Please correct the errors in the form.");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <h2>Profile</h2>

      {/* User Info Card */}
      <Card
        style={{ marginBottom: "2rem" }}
        title="User Information"
        extra={
          <Button type="primary" onClick={handleEditProfile}>
            Edit Profile
          </Button>
        }
      >
        <p>
          <strong>Full Name:</strong> {userData.fullName}
        </p>
    
        <p>
          <strong>Phone:</strong> {userData.phone}
        </p>
        <p>
          <strong>Address:</strong> {userData.address}
        </p>
        <p>
          <strong>Website:</strong>{" "}
          <a href={userData.website} target="_blank" rel="noopener noreferrer">
            {userData.website}
          </a>
        </p>
      </Card>

      {/* Edit Profile Modal */}
      <Modal
        title="Edit Profile"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          onFinishFailed={handleFormFailure}
        >
          {/* Full Name */}
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: "Please enter your full name" }]}
          >
            <Input placeholder="Enter your full name" />
          </Form.Item>

          {/* Date of Birth */}
          {/* <Form.Item
            label="Date of Birth"
            name="dob"
            rules={[
              { required: true, message: "Please select your date of birth" },
            ]}
          > */}
{/* <DatePicker
        value={selectedDate}
        onChange={handleChange}
        format="YYYY-MM-DD" // Display format
      /> */}
          {/* </Form.Item> */}

          {/* Phone Number */}
          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[
              { required: true, message: "Please enter your phone number" },
              {
                pattern: /^[0-9]{10}$/,
                message: "Phone number must be 10 digits",
              },
            ]}
          >
            <Input placeholder="Enter your phone number" />
          </Form.Item>

          {/* Address */}
          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please enter your address" }]}
          >
            <Input.TextArea placeholder="Enter your address" rows={4} />
          </Form.Item>

          {/* Website Link */}
          <Form.Item
            label="Website Link"
            name="website"
            rules={[
              { required: true, message: "Please enter your website link" },
              {
                type: "url",
                message: "Please enter a valid URL (e.g., https://example.com)",
              },
            ]}
          >
            <Input placeholder="Enter your website link" />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;

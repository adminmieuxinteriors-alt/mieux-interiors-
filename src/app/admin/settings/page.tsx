"use client";

import { useEffect, useState, useRef } from "react";
import { Card, Form, Input, Button, Upload, Space, Typography, Spin, Image, Alert, App as AntApp } from "antd";
import { UploadOutlined, SaveOutlined, PictureOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

export default function AdminSettingsPage() {
  const [form] = Form.useForm();
  const { message } = AntApp.useApp();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const uploadSessionRef = useRef(0);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.success && data.data) {
        setCurrentImage(data.data.heroBgImage);
        form.setFieldsValue({ heroBgImage: data.data.heroBgImage });
      } else {
        message.error("Failed to load settings.");
      }
    } catch (err) {
      console.error("Fetch settings error:", err);
      message.error("Error connecting to database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async (values: { heroBgImage: string }) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentImage(values.heroBgImage);
        message.success("Homepage background image updated successfully!");
      } else {
        message.error(data.message || "Failed to update settings.");
      }
    } catch (err) {
      console.error("Save settings error:", err);
      message.error("Error updating settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleMediaUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      onError(new Error("Invalid file type"));
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB limit
    if (file.size > maxSize) {
      message.error("Image exceeds the 5MB size limit.");
      onError(new Error("File size limit exceeded"));
      return;
    }

    const currentSession = uploadSessionRef.current;
    setUploading(true);
    try {
      // 1. Fetch Cloudinary signature from our secure API
      const signRes = await fetch("/api/upload/sign");
      const signData = await signRes.json();
      
      if (!signData.success) {
        throw new Error(signData.message || "Failed to generate upload signature");
      }

      if (uploadSessionRef.current !== currentSession) return;

      const { signature, timestamp, apiKey, cloudName, folder } = signData;

      // 2. Build form data for direct signed upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", folder);

      // 3. Post directly to Cloudinary API
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
      const uploadRes = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      
      if (uploadSessionRef.current !== currentSession) return;

      if (!uploadRes.ok) {
        throw new Error(uploadData.error?.message || "Cloudinary upload failed");
      }

      const imageUrl = uploadData.secure_url;
      form.setFieldsValue({ heroBgImage: imageUrl });
      setCurrentImage(imageUrl);
      onSuccess(uploadData);
      message.success("Image uploaded successfully! Click 'Save Changes' to apply.");
    } catch (err: any) {
      console.error("Upload error:", err);
      onError(err);
      if (uploadSessionRef.current === currentSession) {
        message.error(err.message || "Upload failed.");
      }
    } finally {
      if (uploadSessionRef.current === currentSession) {
        setUploading(false);
      }
    }
  };

  const handleBeforeUpload = () => {
    uploadSessionRef.current += 1; // Increment session ref to cancel prior unfinished uploads
    return true;
  };

  return (
    <div style={{ paddingBottom: "32px", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginBottom: "24px" }}>
        <Title level={2} className="font-serif" style={{ margin: 0 }}>
          Homepage Settings
        </Title>
        <Paragraph style={{ color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
          Configure global sections and elements on the public homepage.
        </Paragraph>
      </div>

      <Spin spinning={loading} tip="Loading settings...">
        <Space direction="vertical" size={24} style={{ width: "100%" }}>
        {/* Current Image Preview */}
        <Card title={<span className="font-serif" style={{ fontSize: "16px", fontWeight: 600 }}>Hero Background Image Preview</span>} variant="borderless" style={{ borderRadius: "12px", boxShadow: "0 4px 20px rgba(138, 106, 74, 0.04)" }}>
          {currentImage ? (
            <div style={{ position: "relative", width: "100%", height: "260px", overflow: "hidden", borderRadius: "8px" }}>
              <Image
                src={currentImage}
                alt="Current Hero Background"
                style={{ width: "100%", height: "260px", objectFit: "cover" }}
              />
              <div style={{ position: "absolute", bottom: "12px", left: "12px", background: "rgba(0,0,0,0.6)", padding: "4px 12px", borderRadius: "4px" }}>
                <Text style={{ color: "#ffffff", fontSize: "12px" }}>Active background image</Text>
              </div>
            </div>
          ) : (
            <Alert message="No background image active" type="warning" showIcon />
          )}
        </Card>

        {/* Form settings */}
        <Card variant="borderless" style={{ borderRadius: "12px", boxShadow: "0 4px 20px rgba(138, 106, 74, 0.04)" }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSaveSettings}
            requiredMark={false}
          >
            <Form.Item
              name="heroBgImage"
              label={<span style={{ fontWeight: 600 }}>Hero Background Image Source</span>}
              rules={[{ required: true, message: "Please specify or upload a hero background image" }]}
              extra="Enter an external image URL, or upload a file directly to Cloudinary using the panel below."
            >
              <Input 
                prefix={<PictureOutlined style={{ color: "var(--text-secondary)" }} />}
                placeholder="https://images.unsplash.com/photo-..." 
                size="large"
                style={{ height: "45px" }}
                onChange={(e) => setCurrentImage(e.target.value)}
              />
            </Form.Item>

            <Form.Item label={<span style={{ fontWeight: 600 }}>Upload New Image</span>}>
              <Upload
                accept="image/*"
                showUploadList={false}
                customRequest={handleMediaUpload}
                beforeUpload={handleBeforeUpload}
              >
                <Button 
                  icon={<UploadOutlined />} 
                  loading={uploading} 
                  size="large"
                  style={{ height: "45px" }}
                >
                  {uploading ? "Uploading to Cloudinary..." : "Select & Upload Image"}
                </Button>
              </Upload>
            </Form.Item>

            <Form.Item style={{ margin: "24px 0 0 0" }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={saving}
                icon={<SaveOutlined />}
                size="large"
                style={{ height: "45px", minWidth: "150px" }}
              >
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Space>
      </Spin>
    </div>
  );
}

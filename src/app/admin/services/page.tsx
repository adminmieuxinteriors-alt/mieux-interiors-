"use client";

import { useEffect, useState, useRef } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, Switch, Space, Popconfirm, Typography, Upload, App as AntApp } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, AppstoreOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { TextArea } = Input;

interface ServiceType {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  media?: { url: string; type: "image" | "video" }[];
  linkUrl: string;
  order: number;
  active: boolean;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceType | null>(null);
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [coverLoading, setCoverLoading] = useState(false);
  const [mediaItems, setMediaItems] = useState<{ url: string; type: "image" | "video" }[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  
  const uploadSessionRef = useRef(0);
  const [form] = Form.useForm();
  const { message } = AntApp.useApp();

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      if (data.success) {
        setServices(data.data);
      } else {
        message.error("Failed to load services.");
      }
    } catch (err) {
      console.error(err);
      message.error("Error loading services database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleMediaUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    const isVideo = file.type.startsWith("video/") || /\.(mp4|webm|ogg|mov|mkv)$/i.test(file.name);
    const maxSize = isVideo ? 20 * 1024 * 1024 : 5 * 1024 * 1024;
    const limitMb = isVideo ? 20 : 5;

    if (file.size > maxSize) {
      message.error(`${isVideo ? "Video" : "Image"} exceeds the ${limitMb}MB size limit.`);
      onError(new Error("File size limit exceeded"));
      return;
    }

    const currentSession = uploadSessionRef.current;
    setMediaLoading(true);
    try {
      const fileType: "image" | "video" = isVideo ? "video" : "image";

      // 1. Fetch signature parameters from our secure API
      const signRes = await fetch("/api/upload/sign");
      const signData = await signRes.json();
      
      if (!signData.success) {
        throw new Error(signData.message || "Failed to generate upload signature");
      }

      if (uploadSessionRef.current !== currentSession) {
        return; // Discard since session changed
      }

      const { signature, timestamp, apiKey, cloudName, folder } = signData;

      // 2. Build form data for Cloudinary direct signed upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", folder);

      // 3. Post directly to Cloudinary
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
      const uploadRes = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      
      if (uploadSessionRef.current !== currentSession) {
        return; // Discard since session changed
      }

      if (!uploadRes.ok) {
        throw new Error(uploadData.error?.message || "Cloudinary upload failed");
      }

      const newItem = { url: uploadData.secure_url, type: fileType };
      const updatedMedia = [...mediaItems, newItem];
      setMediaItems(updatedMedia);
      form.setFieldsValue({ media: updatedMedia });
      message.success(`${isVideo ? "Video" : "Image"} uploaded successfully.`);
      onSuccess(null, file);
    } catch (err: any) {
      console.error(err);
      if (uploadSessionRef.current === currentSession) {
        message.error(err.message || "Upload error.");
        onError(err);
      }
    } finally {
      if (uploadSessionRef.current === currentSession) {
        setMediaLoading(false);
      }
    }
  };

  const moveMedia = (index: number, direction: number) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= mediaItems.length) return;
    const updated = [...mediaItems];
    const temp = updated[index];
    updated[index] = updated[nextIndex];
    updated[nextIndex] = temp;
    setMediaItems(updated);
    form.setFieldsValue({ media: updated });
  };

  const removeMedia = (index: number) => {
    const updated = mediaItems.filter((_, i) => i !== index);
    setMediaItems(updated);
    form.setFieldsValue({ media: updated });
  };

  const handleOpenModal = (service?: ServiceType) => {
    uploadSessionRef.current += 1;
    if (service) {
      setEditingService(service);
      setCoverUrl(service.coverImage || "");
      const existingMedia = service.media || (service.coverImage ? [{ url: service.coverImage, type: "image" as const }] : []);
      setMediaItems(existingMedia);
      form.setFieldsValue({
        ...service,
        media: existingMedia,
      });
    } else {
      setEditingService(null);
      setCoverUrl("");
      setMediaItems([]);
      form.resetFields();
      form.setFieldsValue({ order: 0, active: true, linkUrl: "/services", media: [] });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    uploadSessionRef.current += 1;
    setModalOpen(false);
    setEditingService(null);
    setCoverUrl("");
    setMediaItems([]);
    form.resetFields();
  };

  const handleFinish = async (values: any) => {
    if (mediaItems.length === 0) {
      message.error("Please upload or provide at least one media item.");
      return;
    }

    const coverImage = mediaItems[0]?.url || "";
    const payload = {
      ...values,
      media: mediaItems,
      coverImage,
    };

    try {
      let res;
      if (editingService) {
        res = await fetch(`/api/services/${editingService._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (data.success) {
        message.success(
          editingService ? "Offering updated." : "Offering created."
        );
        handleCloseModal();
        fetchServices();
      } else {
        message.error(data.message || "Failed to save offering.");
      }
    } catch (err) {
      console.error(err);
      message.error("Error saving offering.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        message.success("Offering deleted.");
        fetchServices();
      } else {
        message.error(data.message || "Failed to delete offering.");
      }
    } catch (err) {
      console.error(err);
      message.error("Error deleting offering.");
    }
  };

  const handleToggleActive = async (record: ServiceType, checked: boolean) => {
    try {
      const res = await fetch(`/api/services/${record._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: checked }),
      });
      const data = await res.json();
      if (data.success) {
        message.success(`Offering ${checked ? "activated" : "deactivated"}.`);
        setServices(
          services.map((s) => (s._id === record._id ? { ...s, active: checked } : s))
        );
      } else {
        message.error("Failed to update status.");
      }
    } catch (err) {
      console.error(err);
      message.error("Status update error.");
    }
  };

  const columns = [
    {
      title: "Media (Cover / Count)",
      dataIndex: "media",
      key: "media",
      width: 160,
      render: (media: any[], record: ServiceType) => {
        const cover = media?.[0]?.url || record.coverImage;
        const count = media?.length || (record.coverImage ? 1 : 0);
        const type = media?.[0]?.type || "image";
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ position: "relative", width: "60px", height: "40px", borderRadius: "4px", overflow: "hidden", border: "1px solid var(--border-color)", backgroundColor: "#000" }}>
              {type === "video" && cover ? (
                <video src={cover} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted />
              ) : cover ? (
                <img src={cover} alt="Cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", backgroundColor: "#eee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>No media</div>
              )}
            </div>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 500 }}>
              {count} item{count !== 1 ? "s" : ""}
            </span>
          </div>
        );
      },
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text: string) => <span style={{ fontWeight: 600 }}>{text}</span>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "40%",
      render: (text: string) => (
        <span style={{ color: "var(--text-secondary)" }}>
          {text.length > 100 ? `${text.substring(0, 100)}...` : text}
        </span>
      ),
    },
    {
      title: "Link Path",
      dataIndex: "linkUrl",
      key: "linkUrl",
      render: (text: string) => <code style={{ fontSize: "12px" }}>{text}</code>,
    },
    {
      title: "Sort Order",
      dataIndex: "order",
      key: "order",
      sorter: (a: ServiceType, b: ServiceType) => a.order - b.order,
    },
    {
      title: "Active",
      dataIndex: "active",
      key: "active",
      render: (active: boolean, record: ServiceType) => (
        <Switch checked={active} onChange={(checked) => handleToggleActive(record, checked)} />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_: any, record: ServiceType) => (
        <Space size={12}>
          <Button
            type="text"
            icon={<EditOutlined style={{ color: "var(--primary-color)" }} />}
            onClick={() => handleOpenModal(record)}
          />
          <Popconfirm
            title="Delete Offering"
            description="Are you sure you want to delete this design offering?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <Title level={2} className="font-serif" style={{ margin: 0 }}>
            Design Offerings (Services)
          </Title>
          <div style={{ color: "var(--text-secondary)" }}>
            Manage the core service cards shown under "Our Design Offerings" on the homepage.
          </div>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleOpenModal()}
          style={{ height: "40px", borderRadius: "6px" }}
        >
          Add Offering
        </Button>
      </div>

      <Table
        dataSource={services}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
        bordered={false}
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(138, 106, 74, 0.04)",
        }}
      />

      <Modal
        title={
          <span className="font-serif" style={{ fontSize: "20px", fontWeight: 700 }}>
            {editingService ? "Edit Design Offering" : "Create New Design Offering"}
          </span>
        }
        open={modalOpen}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
        width={600}
        okText={editingService ? "Save Changes" : "Create Offering"}
        cancelText="Discard"
        okButtonProps={{ style: { height: "38px" } }}
        cancelButtonProps={{ style: { height: "38px" } }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ order: 0, active: true, linkUrl: "/services" }}
          style={{ marginTop: "20px" }}
        >
          <Form.Item
            name="title"
            label="Offering Title"
            rules={[{ required: true, message: "Please input the offering title" }]}
          >
            <Input placeholder="E.g., Residential Homes" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Short Description"
            rules={[
              { required: true, message: "Please input the description" },
              { min: 10, message: "Description must be at least 10 characters long" },
            ]}
          >
            <TextArea rows={3} placeholder="E.g., Bespoke villas, luxury apartments, and residential architectural planning..." />
          </Form.Item>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Form.Item
              name="linkUrl"
              label="Redirect URL Link"
              rules={[{ required: true, message: "Please input redirect URL link" }]}
            >
              <Input placeholder="E.g., /services" />
            </Form.Item>

            <Form.Item
              name="order"
              label="Sort Order Index"
              rules={[{ required: true, message: "Please specify sorting order" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", alignItems: "center", marginBottom: "20px" }}>
            <Form.Item name="active" label="Is Active (Visible)?" valuePropName="checked">
              <Switch />
            </Form.Item>
          </div>

          {/* Gallery Media Upload & Management */}
          <div style={{ marginBottom: "20px" }}>
            <span style={{ display: "block", marginBottom: "8px", fontWeight: 600, fontSize: "14px" }}>
              Gallery Media (Photos & Videos)
            </span>
            
            {/* Gallery Grid preview */}
            {mediaItems.length > 0 ? (
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", 
                gap: "12px", 
                marginBottom: "16px",
                border: "1px dashed var(--border-color)",
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: "var(--bg-warm)"
              }}>
                {mediaItems.map((item, index) => (
                  <div key={index} style={{ 
                    position: "relative", 
                    borderRadius: "6px", 
                    overflow: "hidden", 
                    border: "1px solid var(--border-color)", 
                    backgroundColor: "#000",
                    height: "90px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}>
                    {/* Media thumbnail */}
                    <div style={{ flex: 1, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {item.type === "video" ? (
                        <video src={item.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted />
                      ) : (
                        <img src={item.url} alt={`Slide ${index + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      )}
                    </div>
                    
                    {/* Overlay type label */}
                    <div style={{ 
                      position: "absolute", 
                      top: 4, 
                      left: 4, 
                      backgroundColor: "rgba(0,0,0,0.6)", 
                      color: "#fff", 
                      fontSize: "9px", 
                      padding: "2px 4px", 
                      borderRadius: "3px",
                      textTransform: "uppercase" 
                    }}>
                      {item.type}
                    </div>

                    {/* Order & delete controls overlay */}
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center", 
                      backgroundColor: "rgba(255,255,255,0.9)", 
                      padding: "2px 4px",
                      borderTop: "1px solid var(--border-color)"
                    }}>
                      <Space size={2}>
                        <Button 
                          type="text" 
                          size="small" 
                          disabled={index === 0} 
                          onClick={() => moveMedia(index, -1)}
                          style={{ padding: 0, width: "18px", height: "18px", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                          ◀
                        </Button>
                        <Button 
                          type="text" 
                          size="small" 
                          disabled={index === mediaItems.length - 1} 
                          onClick={() => moveMedia(index, 1)}
                          style={{ padding: 0, width: "18px", height: "18px", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                          ▶
                        </Button>
                      </Space>
                      
                      <Button 
                        type="text" 
                        danger 
                        size="small" 
                        icon={<DeleteOutlined style={{ fontSize: "11px" }} />} 
                        onClick={() => removeMedia(index)}
                        style={{ padding: 0, width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                textAlign: "center", 
                padding: "24px", 
                border: "1px dashed var(--border-color)", 
                borderRadius: "8px", 
                color: "var(--text-secondary)",
                marginBottom: "16px"
              }}>
                No photos or videos added yet. Upload files or add URLs below.
              </div>
            )}

            {/* Upload or Add URL panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <Upload
                  accept="image/*,video/*"
                  showUploadList={false}
                  customRequest={handleMediaUpload}
                >
                  <Button icon={<UploadOutlined />} loading={mediaLoading}>
                    Upload Photo / Video
                  </Button>
                </Upload>
                <span style={{ color: "var(--text-secondary)" }}>or</span>
                <span style={{ fontWeight: 500, fontSize: "13px" }}>Add via URL:</span>
              </div>
              
              <div style={{ display: "flex", gap: "8px" }}>
                <Input 
                  id="direct-media-url" 
                  placeholder="Paste direct URL (e.g. https://.../image.jpg)" 
                  style={{ flex: 1 }}
                />
                <select 
                  id="direct-media-type" 
                  style={{ 
                    borderRadius: "6px", 
                    border: "1px solid var(--border-color)", 
                    padding: "0 8px",
                    backgroundColor: "#fff"
                  }}
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
                <Button 
                  type="default" 
                  onClick={() => {
                    const urlInput = document.getElementById("direct-media-url") as HTMLInputElement;
                    const typeSelect = document.getElementById("direct-media-type") as HTMLSelectElement;
                    if (urlInput && urlInput.value.trim()) {
                      const url = urlInput.value.trim();
                      const type = typeSelect.value as "image" | "video";
                      const updatedMedia = [...mediaItems, { url, type }];
                      setMediaItems(updatedMedia);
                      form.setFieldsValue({ media: updatedMedia });
                      urlInput.value = "";
                    } else {
                      message.error("Please enter a valid URL.");
                    }
                  }}
                >
                  Add URL
                </Button>
              </div>
            </div>

            {/* Hidden field to pass media to form validation */}
            <Form.Item
              name="media"
              rules={[{ required: true, message: "Please upload or add at least one media item" }]}
              style={{ display: "none" }}
            >
              <Input />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

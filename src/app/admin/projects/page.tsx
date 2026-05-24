"use client";

import { useState, useRef, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Space,
  Tag,
  Upload,
  Typography,
  Popconfirm,
  Spin,
  App as AntApp,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import Image from "next/image";

const { Title } = Typography;
const { TextArea } = Input;

interface ProjectType {
  _id: string;
  title: string;
  slug: string;
  category: "home" | "office" | "interior";
  location: string;
  shortDescription: string;
  fullDescription: string;
  coverImage?: string;
  media?: { url: string; type: "image" | "video" }[];
  gallery?: string[];
  year?: number | null;
  area?: string | null;
  status: "draft" | "published" | "featured";
  styleTags?: string[];
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectType | null>(null);
  const [form] = Form.useForm();
  const { message } = AntApp.useApp();

  // Custom upload state
  const [mediaItems, setMediaItems] = useState<{ url: string; type: "image" | "video" }[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const uploadSessionRef = useRef(0);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.success) {
        setProjects(data.data);
      } else {
        message.error("Failed to load projects.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      message.error("Error loading projects database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenModal = (project?: ProjectType) => {
    uploadSessionRef.current += 1;
    if (project) {
      setEditingProject(project);
      form.setFieldsValue({
        ...project,
        styleTags: project.styleTags || [],
      });
      let initialMedia: { url: string; type: "image" | "video" }[] = [];
      if (project.media && project.media.length > 0) {
        initialMedia = project.media;
      } else {
        if (project.coverImage) {
          initialMedia.push({ url: project.coverImage, type: "image" });
        }
        if (project.gallery && project.gallery.length > 0) {
          project.gallery.forEach((url) => {
            if (url !== project.coverImage) {
              initialMedia.push({ url, type: "image" });
            }
          });
        }
      }
      setMediaItems(initialMedia);
      form.setFieldsValue({ media: initialMedia });
    } else {
      setEditingProject(null);
      form.resetFields();
      setMediaItems([]);
      form.setFieldsValue({ status: "draft", category: "home", media: [] });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    uploadSessionRef.current += 1;
    setModalOpen(false);
    setEditingProject(null);
    setMediaItems([]);
    form.resetFields();
  };

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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingProject) {
      const title = e.target.value;
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      form.setFieldsValue({ slug });
    }
  };

  const handleFinish = async (values: any) => {
    if (mediaItems.length === 0) {
      message.error("Please upload or provide at least one media item.");
      return;
    }

    const coverImage = mediaItems[0]?.url || "";
    const galleryUrls = mediaItems.filter(item => item.type === "image").map(item => item.url);

    const payload = {
      ...values,
      media: mediaItems,
      coverImage,
      gallery: galleryUrls,
    };

    if (!payload.coverImage) {
      message.error("Cover image is required.");
      return;
    }

    try {
      let res;
      if (editingProject) {
        res = await fetch(`/api/projects/${editingProject._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (data.success) {
        message.success(
          editingProject ? "Project updated successfully!" : "Project created successfully!"
        );
        handleCloseModal();
        fetchProjects();
      } else {
        message.error(data.message || "Failed to save project.");
      }
    } catch (err) {
      console.error(err);
      message.error("An error occurred while saving.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        message.success("Project deleted successfully.");
        fetchProjects();
      } else {
        message.error(data.message || "Failed to delete project.");
      }
    } catch (err) {
      console.error(err);
      message.error("An error occurred while deleting.");
    }
  };

  const columns = [
    {
      title: "Media (Cover / Count)",
      dataIndex: "media",
      key: "media",
      width: 160,
      render: (media: any[], record: ProjectType) => {
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
      render: (text: string, record: ProjectType) => (
        <div>
          <span style={{ fontWeight: 600 }}>{text}</span>
          <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>/{record.slug}</div>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (cat: string) => {
        let color = "purple";
        if (cat === "home") color = "cyan";
        if (cat === "office") color = "blue";
        return (
          <Tag color={color} style={{ textTransform: "capitalize" }}>
            {cat}
          </Tag>
        );
      },
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      render: (year: number) => year || "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "default";
        if (status === "featured") color = "gold";
        if (status === "published") color = "success";
        return (
          <Tag color={color} style={{ textTransform: "uppercase", fontWeight: 600 }}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_: any, record: ProjectType) => (
        <Space size={12}>
          <Button
            type="text"
            icon={<EditOutlined style={{ color: "var(--primary-color)" }} />}
            onClick={() => handleOpenModal(record)}
          />
          <Popconfirm
            title="Delete Project"
            description="Are you sure you want to delete this project?"
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
            Portfolio Projects
          </Title>
          <div style={{ color: "var(--text-secondary)" }}>
            Add, update, or remove architectural and interior projects.
          </div>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleOpenModal()}
          style={{ height: "40px", borderRadius: "6px" }}
        >
          Add New Project
        </Button>
      </div>

      <Table
        dataSource={projects}
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
            {editingProject ? "Edit Project Details" : "Create New Project Entry"}
          </span>
        }
        open={modalOpen}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
        width={720}
        okText={editingProject ? "Save Changes" : "Create Project"}
        cancelText="Discard"
        okButtonProps={{ style: { height: "38px" } }}
        cancelButtonProps={{ style: { height: "38px" } }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ status: "draft", category: "home" }}
          style={{ marginTop: "20px" }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Form.Item
              name="title"
              label="Project Title"
              rules={[{ required: true, message: "Please input the project title" }]}
            >
              <Input placeholder="E.g., Oak & Bronze Villa" onChange={handleTitleChange} />
            </Form.Item>

            <Form.Item
              name="slug"
              label="URL Slug (Auto-generated)"
              rules={[{ required: true, message: "Please input URL slug" }]}
            >
              <Input placeholder="e.g. oak-bronze-villa" />
            </Form.Item>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
            <Form.Item
              name="category"
              label="Project Category"
              rules={[{ required: true, message: "Please select category" }]}
            >
              <Select placeholder="Select category">
                <Select.Option value="home">Residential/Home</Select.Option>
                <Select.Option value="office">Workspace/Office</Select.Option>
                <Select.Option value="interior">Interior Architecture</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="status"
              label="Visibility Status"
              rules={[{ required: true, message: "Please select status" }]}
            >
              <Select placeholder="Select status">
                <Select.Option value="draft">Draft (Hidden)</Select.Option>
                <Select.Option value="published">Published (Visible)</Select.Option>
                <Select.Option value="featured">Featured (Homepage slider)</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="location"
              label="Location"
              rules={[{ required: true, message: "Please input location" }]}
            >
              <Input placeholder="E.g., Nadapuram, Kozhikode" />
            </Form.Item>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Form.Item name="year" label="Project Completion Year">
              <InputNumber style={{ width: "100%" }} placeholder="E.g., 2025" min={1990} max={2100} />
            </Form.Item>

            <Form.Item name="area" label="Total Area/Size">
              <Input placeholder="E.g., 3500 Sq. Ft." />
            </Form.Item>
          </div>

          <Form.Item
            name="shortDescription"
            label="Short Summary"
            rules={[
              { required: true, message: "Please input a short description (min 10 chars)" },
              { min: 10, message: "Must be at least 10 characters" },
            ]}
          >
            <Input placeholder="A brief hook description shown in project grid summaries..." />
          </Form.Item>

          <Form.Item
            name="fullDescription"
            label="Detailed Project Narrative"
            rules={[
              { required: true, message: "Please input a full description (min 20 chars)" },
              { min: 20, message: "Must be at least 20 characters" },
            ]}
          >
            <TextArea rows={4} placeholder="Full background stories, architect specifications, styling choices, etc." />
          </Form.Item>

          <Form.Item name="styleTags" label="Design Theme Tags">
            <Select mode="tags" style={{ width: "100%" }} placeholder="Type tag and press Enter (e.g. Minimalist, Oak Wood, Warm Beige)" />
          </Form.Item>

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

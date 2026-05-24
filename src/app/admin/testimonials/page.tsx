"use client";

import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, Switch, Space, Popconfirm, Typography, Rate, App as AntApp } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, CommentOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { TextArea } = Input;

interface TestimonialType {
  _id: string;
  name: string;
  place?: string;
  quote: string;
  rating: number;
  featured: boolean;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialType | null>(null);
  const [form] = Form.useForm();
  const { message } = AntApp.useApp();

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/testimonials");
      const data = await res.json();
      if (data.success) {
        setTestimonials(data.data);
      } else {
        message.error("Failed to load reviews.");
      }
    } catch (err) {
      console.error(err);
      message.error("Error loading reviews database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleOpenModal = (testimonial?: TestimonialType) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      form.setFieldsValue(testimonial);
    } else {
      setEditingTestimonial(null);
      form.resetFields();
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingTestimonial(null);
    form.resetFields();
  };

  const handleFinish = async (values: any) => {
    try {
      let res;
      if (editingTestimonial) {
        res = await fetch(`/api/testimonials/${editingTestimonial._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
      } else {
        res = await fetch("/api/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
      }

      const data = await res.json();
      if (data.success) {
        message.success(
          editingTestimonial ? "Review updated." : "Review created."
        );
        handleCloseModal();
        fetchTestimonials();
      } else {
        message.error(data.message || "Failed to save review.");
      }
    } catch (err) {
      console.error(err);
      message.error("Error saving review.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        message.success("Review deleted.");
        fetchTestimonials();
      } else {
        message.error(data.message || "Failed to delete review.");
      }
    } catch (err) {
      console.error(err);
      message.error("Error deleting review.");
    }
  };

  const handleToggleFeatured = async (record: TestimonialType, checked: boolean) => {
    try {
      const res = await fetch(`/api/testimonials/${record._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: checked }),
      });
      const data = await res.json();
      if (data.success) {
        message.success(`Review ${checked ? "featured" : "unfeatured"}.`);
        setTestimonials(
          testimonials.map((t) => (t._id === record._id ? { ...t, featured: checked } : t))
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
      title: "Client Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: TestimonialType) => (
        <div>
          <span style={{ fontWeight: 600 }}>{text}</span>
          {record.place && (
            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              {record.place}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Client Quote",
      dataIndex: "quote",
      key: "quote",
      width: "40%",
      render: (text: string) => (
        <span style={{ fontStyle: "italic", color: "var(--text-color)" }}>
          &ldquo;{text.length > 100 ? `${text.substring(0, 100)}...` : text}&rdquo;
        </span>
      ),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating: number) => <Rate disabled defaultValue={rating} style={{ fontSize: "14px" }} />,
    },
    {
      title: "Featured",
      dataIndex: "featured",
      key: "featured",
      render: (featured: boolean, record: TestimonialType) => (
        <Switch checked={featured} onChange={(checked) => handleToggleFeatured(record, checked)} />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_: any, record: TestimonialType) => (
        <Space size={12}>
          <Button
            type="text"
            icon={<EditOutlined style={{ color: "var(--primary-color)" }} />}
            onClick={() => handleOpenModal(record)}
          />
          <Popconfirm
            title="Delete Review"
            description="Are you sure you want to delete this review?"
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
            Client Reviews
          </Title>
          <div style={{ color: "var(--text-secondary)" }}>
            Manage client reviews displayed on the homepage slider.
          </div>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleOpenModal()}
          style={{ height: "40px", borderRadius: "6px" }}
        >
          Add Review
        </Button>
      </div>

      <Table
        dataSource={testimonials}
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
            {editingTestimonial ? "Edit Client Review" : "Create New Review Entry"}
          </span>
        }
        open={modalOpen}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
        width={600}
        okText={editingTestimonial ? "Save Changes" : "Submit Review"}
        cancelText="Discard"
        okButtonProps={{ style: { height: "38px" } }}
        cancelButtonProps={{ style: { height: "38px" } }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ rating: 5, featured: false }}
          style={{ marginTop: "20px" }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Form.Item
              name="name"
              label="Client Name"
              rules={[{ required: true, message: "Please input client name" }]}
            >
              <Input placeholder="E.g., Nisam M. H." />
            </Form.Item>

            <Form.Item name="place" label="Location / City">
              <Input placeholder="E.g., Kallachi, Nadapuram" />
            </Form.Item>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", alignItems: "center" }}>
            <Form.Item
              name="rating"
              label="Rating (1-5 Stars)"
              rules={[{ required: true, message: "Please select rating" }]}
            >
              <Rate />
            </Form.Item>

            <Form.Item name="featured" label="Show on Homepage?" valuePropName="checked">
              <Switch />
            </Form.Item>
          </div>

          <Form.Item
            name="quote"
            label="Client Feedback Quote"
            rules={[
              { required: true, message: "Please input the quote text" },
              { min: 5, message: "Quote must be at least 5 characters long" },
            ]}
          >
            <TextArea rows={4} placeholder="E.g. Antigravity exceeded our expectations with their modern designs..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

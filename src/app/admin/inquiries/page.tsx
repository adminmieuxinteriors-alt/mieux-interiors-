"use client";

import { useEffect, useState } from "react";
import { Table, Tag, Button, Space, Select, Popconfirm, Typography, Card, Input, App as AntApp } from "antd";
import { DeleteOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title } = Typography;

interface InquiryType {
  _id: string;
  name: string;
  phone: string;
  email: string;
  projectType: string;
  location: string;
  budget?: string;
  message: string;
  status: "new" | "contacted" | "closed";
  createdAt: string;
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<InquiryType[]>([]);
  const [loading, setLoading] = useState(true);
  const { message } = AntApp.useApp();

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/inquiries");
      const data = await res.json();
      if (data.success) {
        setInquiries(data.data);
      } else {
        message.error("Failed to load inquiries.");
      }
    } catch (err) {
      console.error(err);
      message.error("Error loading inquiries database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        message.success("Inquiry status updated.");
        // update local state
        setInquiries(
          inquiries.map((inq) => (inq._id === id ? { ...inq, status: newStatus as any } : inq))
        );
      } else {
        message.error(data.message || "Failed to update status.");
      }
    } catch (err) {
      console.error(err);
      message.error("Status update error.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        message.success("Inquiry entry deleted.");
        setInquiries(inquiries.filter((inq) => inq._id !== id));
      } else {
        message.error(data.message || "Failed to delete inquiry.");
      }
    } catch (err) {
      console.error(err);
      message.error("Error deleting inquiry.");
    }
  };

  const columns = [
    {
      title: "Client",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: InquiryType) => (
        <div>
          <span style={{ fontWeight: 600 }}>{text}</span>
          <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
            <Space>
              <span><PhoneOutlined /> {record.phone}</span>
              <span>•</span>
              <span><MailOutlined /> {record.email}</span>
            </Space>
          </div>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "projectType",
      key: "projectType",
      render: (type: string) => (
        <span style={{ textTransform: "capitalize", fontWeight: 500 }}>{type}</span>
      ),
    },
    {
      title: "Location & Budget",
      dataIndex: "location",
      key: "location",
      render: (loc: string, record: InquiryType) => (
        <div>
          <div><EnvironmentOutlined /> {loc}</div>
          {record.budget && (
            <div style={{ fontSize: "12px", color: "var(--primary-color)" }}>
              Budget: {record.budget}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("DD MMM YYYY, hh:mm A"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status: string, record: InquiryType) => (
        <Select
          value={status}
          onChange={(val) => handleStatusChange(record._id, val)}
          style={{ width: "130px" }}
          options={[
            { value: "new", label: <Tag color="gold">NEW</Tag> },
            { value: "contacted", label: <Tag color="blue">CONTACTED</Tag> },
            { value: "closed", label: <Tag color="success">CLOSED</Tag> },
          ]}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 80,
      render: (_: any, record: InquiryType) => (
        <Popconfirm
          title="Delete Inquiry"
          description="Are you sure you want to delete this consultation inquiry?"
          onConfirm={() => handleDelete(record._id)}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ danger: true }}
        >
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <Title level={2} className="font-serif" style={{ margin: 0 }}>
          Consultation Inquiries
        </Title>
        <div style={{ color: "var(--text-secondary)" }}>
          View and reply to prospective client project inquiries submitted from the Contact page.
        </div>
      </div>

      <Table
        dataSource={inquiries}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        expandable={{
          expandedRowRender: (record) => (
            <div style={{ padding: "16px 24px", backgroundColor: "#faf8f5", borderRadius: "6px", border: "1px solid var(--border-color)" }}>
              <span style={{ fontWeight: 600, color: "var(--primary-color)", display: "block", marginBottom: "8px" }}>
                Client Project Notes & Requirements:
              </span>
              <p style={{ margin: 0, whiteSpace: "pre-wrap", color: "var(--text-color)", lineHeight: 1.6 }}>
                {record.message}
              </p>
            </div>
          ),
          rowExpandable: (record) => !!record.message,
        }}
        scroll={{ x: true }}
        bordered={false}
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(138, 106, 74, 0.04)",
        }}
      />
    </div>
  );
}

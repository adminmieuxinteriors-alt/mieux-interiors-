"use client";

import { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Table, Tag, Typography, Button, Space, Empty, Spin, App as AntApp } from "antd";
import {
  FolderOpenOutlined,
  MailOutlined,
  CommentOutlined,
  FileTextOutlined,
  ArrowRightOutlined,
  UserOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import dayjs from "dayjs";

const { Title, Paragraph, Text } = Typography;

interface Stats {
  totalProjects: number;
  totalInquiries: number;
  newInquiries: number;
  totalTestimonials: number;
  totalServices: number;
  totalUsers: number;
  recentInquiries: any[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const { message } = AntApp.useApp();

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      } else {
        message.error("Failed to load statistics.");
      }
    } catch (err) {
      console.error("Dashboard error:", err);
      message.error("Error connecting to database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const columns = [
    {
      title: "Client Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <Space>
          <UserOutlined style={{ color: "var(--primary-color)" }} />
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      ),
    },
    {
      title: "Project Type",
      dataIndex: "projectType",
      key: "projectType",
      render: (text: string) => <span style={{ textTransform: "capitalize" }}>{text}</span>,
    },
    {
      title: "Date Received",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("DD MMM YYYY, hh:mm A"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "default";
        if (status === "new") color = "gold";
        if (status === "contacted") color = "blue";
        if (status === "closed") color = "success";
        return (
          <Tag color={color} style={{ textTransform: "uppercase", fontWeight: 600, borderRadius: "4px" }}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Link href="/admin/inquiries">
          <Button type="link" size="small" style={{ padding: 0 }}>
            View Details
          </Button>
        </Link>
      ),
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          gap: "16px",
        }}
      >
        <Spin size="large" />
        <Text type="secondary">Loading statistics...</Text>
      </div>
    );
  }

  const data = stats || {
    totalProjects: 0,
    totalInquiries: 0,
    newInquiries: 0,
    totalTestimonials: 0,
    totalServices: 0,
    totalUsers: 0,
    recentInquiries: [],
  };

  return (
    <div style={{ paddingBottom: "32px" }}>
      <div style={{ marginBottom: "24px" }}>
        <Title level={2} className="font-serif" style={{ margin: 0 }}>
          Welcome back, Admin
        </Title>
        <Paragraph style={{ color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
          Here is the current overview of Mieux Interiors & Architects.
        </Paragraph>
      </div>

      {/* Stats Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: "32px" }}>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card
            variant="borderless"
            style={{
              boxShadow: "0 4px 20px rgba(138, 106, 74, 0.04)",
              borderRadius: "12px",
            }}
          >
            <Statistic
              title="Total Projects"
              value={data.totalProjects}
              prefix={<FolderOpenOutlined style={{ color: "var(--primary-color)", marginRight: "8px" }} />}
              valueStyle={{ fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card
            variant="borderless"
            style={{
              boxShadow: "0 4px 20px rgba(138, 106, 74, 0.04)",
              borderRadius: "12px",
            }}
          >
            <Statistic
              title="Pending Inquiries"
              value={data.newInquiries}
              prefix={<MailOutlined style={{ color: "#d48806", marginRight: "8px" }} />}
              valueStyle={{ fontWeight: 700, color: data.newInquiries > 0 ? "#d48806" : "inherit" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card
            variant="borderless"
            style={{
              boxShadow: "0 4px 20px rgba(138, 106, 74, 0.04)",
              borderRadius: "12px",
            }}
          >
            <Statistic
              title="Total Inquiries"
              value={data.totalInquiries}
              prefix={<FileTextOutlined style={{ color: "#096dd9", marginRight: "8px" }} />}
              valueStyle={{ fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card
            variant="borderless"
            style={{
              boxShadow: "0 4px 20px rgba(138, 106, 74, 0.04)",
              borderRadius: "12px",
            }}
          >
            <Statistic
              title="Client Reviews"
              value={data.totalTestimonials}
              prefix={<CommentOutlined style={{ color: "#389e0d", marginRight: "8px" }} />}
              valueStyle={{ fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card
            variant="borderless"
            style={{
              boxShadow: "0 4px 20px rgba(138, 106, 74, 0.04)",
              borderRadius: "12px",
            }}
          >
            <Statistic
              title="Design Offerings"
              value={data.totalServices}
              prefix={<AppstoreOutlined style={{ color: "#722ed1", marginRight: "8px" }} />}
              valueStyle={{ fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Link href="/admin/users">
            <Card
              hoverable
              variant="borderless"
              style={{
                boxShadow: "0 4px 20px rgba(138, 106, 74, 0.04)",
                borderRadius: "12px",
              }}
            >
              <Statistic
                title="Registered Users"
                value={data.totalUsers}
                prefix={<UserOutlined style={{ color: "var(--primary-color)", marginRight: "8px" }} />}
                valueStyle={{ fontWeight: 700 }}
              />
            </Card>
          </Link>
        </Col>
      </Row>

      {/* Main sections */}
      <Row gutter={[24, 24]}>
        {/* Recent Inquiries */}
        <Col xs={24} lg={16}>
          <Card
            title={<span className="font-serif" style={{ fontSize: "18px", fontWeight: 600 }}>Recent Consultation Inquiries</span>}
            extra={
              <Link href="/admin/inquiries">
                <Button type="link" icon={<ArrowRightOutlined />} iconPosition="end">
                  All Inquiries
                </Button>
              </Link>
            }
            variant="borderless"
            style={{
              boxShadow: "0 4px 20px rgba(138, 106, 74, 0.04)",
              borderRadius: "12px",
            }}
          >
            {data.recentInquiries.length > 0 ? (
              <Table
                dataSource={data.recentInquiries}
                columns={columns}
                rowKey="_id"
                pagination={false}
                scroll={{ x: true }}
              />
            ) : (
              <Empty description="No inquiries received yet." style={{ padding: "32px 0" }} />
            )}
          </Card>
        </Col>

        {/* Quick Actions Panel */}
        <Col xs={24} lg={8}>
          <Card
            title={<span className="font-serif" style={{ fontSize: "18px", fontWeight: 600 }}>Quick Administrative Tasks</span>}
            variant="borderless"
            style={{
              boxShadow: "0 4px 20px rgba(138, 106, 74, 0.04)",
              borderRadius: "12px",
              height: "100%",
            }}
          >
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
              <Paragraph style={{ color: "var(--text-secondary)", margin: 0 }}>
                Manage design project galleries, reviews, and client inquiries from these links:
              </Paragraph>

              <Link href="/admin/projects">
                <Button type="primary" block style={{ height: "40px", fontWeight: 500 }}>
                  Manage Portfolio Projects
                </Button>
              </Link>

              <Link href="/admin/users">
                <Button block style={{ height: "40px", fontWeight: 500 }}>
                  Manage Registered Users
                </Button>
              </Link>

              <Link href="/admin/inquiries">
                <Button block style={{ height: "40px", fontWeight: 500 }}>
                  View All Consultation Inquiries
                </Button>
              </Link>

              <Link href="/admin/testimonials">
                <Button block style={{ height: "40px", fontWeight: 500 }}>
                  Update Client Reviews
                </Button>
              </Link>

              <Link href="/admin/services">
                <Button block style={{ height: "40px", fontWeight: 500 }}>
                  Manage Design Offerings (Services)
                </Button>
              </Link>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

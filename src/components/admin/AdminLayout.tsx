"use client";

import { Layout, Menu, Button, Space, Typography, App as AntApp } from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  DashboardOutlined,
  FolderOpenOutlined,
  MailOutlined,
  CommentOutlined,
  LogoutOutlined,
  HomeOutlined,
  AppstoreOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Logo from "../public/Logo";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { message } = AntApp.useApp();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        message.success("Logged out successfully.");
        router.push("/admin/login");
      } else {
        message.error("Logout failed.");
      }
    } catch (err) {
      console.error("Logout error:", err);
      message.error("Failed to logout.");
    }
  };

  const getActiveKey = () => {
    if (pathname.startsWith("/admin/dashboard")) return "1";
    if (pathname.startsWith("/admin/services")) return "2";
    if (pathname.startsWith("/admin/projects")) return "3";
    if (pathname.startsWith("/admin/inquiries")) return "4";
    if (pathname.startsWith("/admin/testimonials")) return "5";
    if (pathname.startsWith("/admin/users")) return "6";
    return "1";
  };

  const menuItems = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: <Link href="/admin/dashboard">Dashboard</Link>,
    },
    {
      key: "2",
      icon: <AppstoreOutlined />,
      label: <Link href="/admin/services">Design Offerings</Link>,
    },
    {
      key: "3",
      icon: <FolderOpenOutlined />,
      label: <Link href="/admin/projects">Featured Works</Link>,
    },
    {
      key: "4",
      icon: <MailOutlined />,
      label: <Link href="/admin/inquiries">Inquiries</Link>,
    },
    {
      key: "5",
      icon: <CommentOutlined />,
      label: <Link href="/admin/testimonials">Client Reviews</Link>,
    },
    {
      key: "6",
      icon: <UserOutlined />,
      label: <Link href="/admin/users">Registered Users</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sider panel */}
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        theme="dark"
        style={{
          boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ padding: "24px 16px", display: "flex", justifyContent: "center", borderBottom: "1px solid #1f1f1f" }}>
          <Link href="/admin/dashboard" style={{ display: "flex" }}>
            <Logo light fontSize="20px" subtitleSize="7px" />
          </Link>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getActiveKey()]}
          items={menuItems}
          style={{ padding: "16px 0" }}
        />
      </Sider>

      <Layout>
        {/* Header navigation bar */}
        <Header
          style={{
            background: "#ffffff",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 2px 8px rgba(138, 106, 74, 0.05)",
          }}
        >
          <Title level={4} style={{ margin: 0 }} className="font-serif">
            Studio Management Console
          </Title>

          <Space size={16}>
            <Button type="text" href="/" icon={<HomeOutlined />}>
              View Live Website
            </Button>
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{
                borderRadius: "4px",
              }}
            >
              Logout
            </Button>
          </Space>
        </Header>

        {/* Content body wrapper */}
        <Content style={{ margin: "24px", minHeight: "280px" }}>{children}</Content>
      </Layout>
    </Layout>
  );
}

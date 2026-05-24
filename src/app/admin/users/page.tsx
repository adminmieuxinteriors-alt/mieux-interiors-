"use client";

import { useEffect, useState } from "react";
import { Table, Button, Input, Space, Popconfirm, Typography, Card, Breadcrumb, App as AntApp } from "antd";
import { UserOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Paragraph } = Typography;

interface UserRecord {
  _id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const { message } = AntApp.useApp();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      } else {
        message.error(data.message || "Failed to load registered users.");
      }
    } catch (err) {
      console.error("Fetch users error:", err);
      message.error("Error connecting to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        message.success("User deleted successfully.");
        setUsers(users.filter((user) => user._id !== id));
      } else {
        message.error(data.message || "Failed to delete user.");
      }
    } catch (err) {
      console.error("Delete user error:", err);
      message.error("Error deleting user.");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: UserRecord, b: UserRecord) => a.name.localeCompare(b.name),
      render: (text: string) => (
        <Space>
          <UserOutlined style={{ color: "var(--primary-color)" }} />
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a: UserRecord, b: UserRecord) => a.email.localeCompare(b.email),
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Registration Date",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a: UserRecord, b: UserRecord) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      render: (date: string) => dayjs(date).format("DD MMM YYYY, hh:mm A"),
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      render: (_: any, record: UserRecord) => (
        <Popconfirm
          title="Delete registered user?"
          description="Are you sure you want to delete this user? They will lose access to gated pages."
          onConfirm={() => handleDeleteUser(record._id)}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ danger: true }}
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            size="small"
          >
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ paddingBottom: "32px" }}>
      {/* Breadcrumb */}
      <Breadcrumb
        style={{ marginBottom: "16px" }}
        items={[
          {
            title: <a href="/admin/dashboard">Console</a>,
          },
          {
            title: "Registered Users",
          },
        ]}
      />

      {/* Header section */}
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <Title level={2} className="font-serif" style={{ margin: 0 }}>
            Registered Users
          </Title>
          <Paragraph style={{ color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
            Manage client and guest viewer profiles that registered to view the live website.
          </Paragraph>
        </div>
      </div>

      {/* Main card */}
      <Card
        variant="borderless"
        style={{
          boxShadow: "0 4px 20px rgba(138, 106, 74, 0.04)",
          borderRadius: "12px",
        }}
      >
        <Space direction="vertical" size={20} style={{ width: "100%" }}>
          {/* Controls */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Input
              placeholder="Search by name, email, or phone..."
              prefix={<SearchOutlined style={{ color: "var(--text-secondary)" }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ maxWidth: "320px", height: "38px", borderRadius: "6px" }}
              allowClear
            />
            <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
              Total: <strong>{filteredUsers.length}</strong> users
            </span>
          </div>

          {/* Table */}
          <Table
            columns={columns}
            dataSource={filteredUsers}
            rowKey="_id"
            loading={loading}
            scroll={{ x: true }}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
            }}
          />
        </Space>
      </Card>
    </div>
  );
}

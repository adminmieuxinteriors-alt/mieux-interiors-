"use client";

import { useState, Suspense } from "react";
import { Form, Input, Button, Card, Typography, Tabs, App as AntApp } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LockOutlined, MailOutlined, UserOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import Logo from "@/components/public/Logo";

const { Paragraph, Text } = Typography;

function UserLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const { message } = AntApp.useApp();

  const redirect = searchParams.get("redirect") || "/";

  const onFinishLogin = async (values: any) => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (data.success) {
        message.success("Logged in successfully. Welcome back!");
        router.push(redirect);
        setTimeout(() => { window.location.href = redirect; }, 500);
      } else {
        message.error(data.message || "Invalid credentials.");
      }
    } catch (err) {
      console.error("User login error:", err);
      message.error("Login request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinishLogin} requiredMark={false}>
      <Form.Item
        name="email"
        rules={[
          { required: true, message: "Please input your email" },
          { type: "email", message: "Please enter a valid email" },
        ]}
      >
        <Input
          prefix={<MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
          placeholder="Email address"
          size="large"
          style={{ height: "45px" }}
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your password" }]}
        style={{ marginBottom: "24px" }}
      >
        <Input.Password
          prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
          placeholder="Password"
          size="large"
          style={{ height: "45px" }}
        />
      </Form.Item>
      <Button
        type="primary"
        htmlType="submit"
        size="large"
        block
        loading={loading}
        style={{ height: "45px", fontWeight: 600, borderRadius: "6px" }}
      >
        Sign In
      </Button>
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <Text type="secondary" style={{ fontSize: "14px" }}>
          New to Mieux?{" "}
          <Link href="/register" style={{ color: "var(--primary-color)", fontWeight: 500 }}>
            Register here
          </Link>
        </Text>
      </div>
    </Form>
  );
}

function AdminLoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { message } = AntApp.useApp();

  const onFinishLogin = async (values: any) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (data.success) {
        message.success("Logged in successfully. Welcome to Mieux Admin!");
        router.push("/admin/dashboard");
      } else {
        message.error(data.message || "Invalid credentials.");
      }
    } catch (err) {
      console.error("Admin login error:", err);
      message.error("Login request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinishLogin} requiredMark={false}>
      <Form.Item
        name="email"
        rules={[
          { required: true, message: "Please input your email" },
          { type: "email", message: "Please enter a valid email" },
        ]}
      >
        <Input
          prefix={<MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
          placeholder="Admin email"
          size="large"
          style={{ height: "45px" }}
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your password" }]}
        style={{ marginBottom: "24px" }}
      >
        <Input.Password
          prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
          placeholder="Password"
          size="large"
          style={{ height: "45px" }}
        />
      </Form.Item>
      <Button
        type="primary"
        htmlType="submit"
        size="large"
        block
        loading={loading}
        style={{ height: "45px", fontWeight: 600, borderRadius: "6px" }}
      >
        Sign In as Admin
      </Button>
    </Form>
  );
}

export default function LoginPage() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 180px)",
        backgroundColor: "var(--bg-warm)",
        padding: "40px 24px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "440px",
          borderRadius: "16px",
          boxShadow: "0 10px 40px rgba(138, 106, 74, 0.06)",
          border: "1px solid var(--border-color)",
        }}
        styles={{ body: { padding: "40px 36px 28px" } }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "24px", gap: "8px" }}>
          <Link href="/" style={{ display: "flex" }}>
            <Logo fontSize="26px" />
          </Link>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.2em",
              color: "var(--text-secondary)",
              textTransform: "uppercase",
            }}
          >
            Welcome Back
          </span>
          <Paragraph style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "14px", margin: "4px 0 0 0" }}>
            Sign in to access premium design features and details.
          </Paragraph>
        </div>

        <Tabs
          defaultActiveKey="user"
          centered
          items={[
            {
              key: "user",
              label: (
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <UserOutlined /> Login as User
                </span>
              ),
              children: (
                <Suspense fallback={<div style={{ textAlign: "center", padding: "20px 0" }}>Loading...</div>}>
                  <UserLoginForm />
                </Suspense>
              ),
            },
            {
              key: "admin",
              label: (
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <SafetyCertificateOutlined /> Login as Admin
                </span>
              ),
              children: <AdminLoginForm />,
            },
          ]}
        />
      </Card>
    </div>
  );
}

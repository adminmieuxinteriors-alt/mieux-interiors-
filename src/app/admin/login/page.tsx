"use client";

import { useState } from "react";
import { Form, Input, Button, Card, Typography, App as AntApp } from "antd";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import Logo from "../../../components/public/Logo";

const { Paragraph } = Typography;

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { message } = AntApp.useApp();

  const onFinishLogin = async (values: any) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      console.error(err);
      message.error("Login request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "var(--bg-warm)",
        padding: "24px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "400px",
          borderRadius: "12px",
          boxShadow: "0 8px 30px rgba(138, 106, 74, 0.08)",
          border: "1px solid var(--border-color)",
        }}
        styles={{ body: { padding: "40px 32px" } }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "32px", gap: "8px" }}>
          <Link href="/" style={{ display: "flex" }}>
            <Logo fontSize="26px" layout="vertical" />
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
            Studio Portal
          </span>
        </div>

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
            style={{ height: "45px", fontWeight: 600 }}
          >
            Sign In
          </Button>
        </Form>
      </Card>
    </div>
  );
}

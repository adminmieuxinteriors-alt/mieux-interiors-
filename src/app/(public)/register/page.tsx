"use client";

import { useState } from "react";
import { Form, Input, Button, Card, Typography, App as AntApp } from "antd";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LockOutlined, MailOutlined, UserOutlined, PhoneOutlined } from "@ant-design/icons";
import Logo from "@/components/public/Logo";

const { Paragraph, Text } = Typography;

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { message } = AntApp.useApp();

  const onFinishRegister = async (values: any) => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (data.success) {
        message.success("Registration successful! Welcome to Mieux Interiors.");
        // Redirect to homepage
        router.push("/");
        // Force refresh to update Navbar state
        setTimeout(() => {
          window.location.href = "/";
        }, 500);
      } else {
        message.error(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Register page submit error:", err);
      message.error("Registration request failed.");
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
        minHeight: "calc(100vh - 180px)", // adjustment for header/footer
        backgroundColor: "var(--bg-warm)",
        padding: "40px 24px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "450px",
          borderRadius: "16px",
          boxShadow: "0 10px 40px rgba(138, 106, 74, 0.06)",
          border: "1px solid var(--border-color)",
        }}
        styles={{ body: { padding: "40px 36px" } }}
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
            Create Your Account
          </span>
          <Paragraph style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "14px", margin: "4px 0 0 0" }}>
            Register to unlock full access to our project galleries, design offerings, and consultation features.
          </Paragraph>
        </div>

        <Form layout="vertical" onFinish={onFinishRegister} requiredMark={false}>
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please input your full name" }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Full Name"
              size="large"
              style={{ height: "45px" }}
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Email Address"
              size="large"
              style={{ height: "45px" }}
            />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              { required: true, message: "Please input your phone number" },
              { pattern: /^[0-9+\s-]{8,20}$/, message: "Please enter a valid phone number" }
            ]}
          >
            <Input
              prefix={<PhoneOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Phone Number (e.g. +91 9876543210)"
              size="large"
              style={{ height: "45px" }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please input your password" },
              { min: 6, message: "Password must be at least 6 characters" }
            ]}
            style={{ marginBottom: "24px" }}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Password (Min. 6 characters)"
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
            Sign Up
          </Button>

          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <Text type="secondary" style={{ fontSize: "14px" }}>
              Already have an account?{" "}
              <Link href="/login" style={{ color: "var(--primary-color)", fontWeight: 500 }}>
                Sign In here
              </Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
}

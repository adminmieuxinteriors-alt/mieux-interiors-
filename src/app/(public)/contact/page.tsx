"use client";

import { useState } from "react";
import { Form, Input, Select, Button, Row, Col, Typography, Card, Space, App as AntApp } from "antd";
import { PhoneOutlined, MailOutlined, EnvironmentOutlined, WhatsAppOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

export default function ContactPage() {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const { message } = AntApp.useApp();

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (data.success) {
        message.success("Your design inquiry has been submitted! Our architects will contact you shortly.");
        form.resetFields();
      } else {
        message.error(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      message.error("Failed to submit inquiry. Please check your internet connection.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: "var(--bg-warm)", minHeight: "100vh", paddingBottom: "80px" }}>
      {/* Page Header */}
      <section
        style={{
          backgroundColor: "#2b2621",
          color: "#ffffff",
          padding: "80px 40px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <span
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              fontSize: "12px",
              color: "var(--primary-color)",
              fontWeight: 600,
              display: "block",
              marginBottom: "8px",
            }}
          >
            Connect
          </span>
          <Title level={1} style={{ color: "#ffffff", fontSize: "40px", margin: 0 }} className="font-serif">
            Book a Consultation
          </Title>
          <Paragraph style={{ color: "#d8cfc0", fontSize: "16px", marginTop: "16px", lineHeight: "1.6" }}>
            Visit our studio or drop us a message. We will review your architectural project scope and estimate material requirements.
          </Paragraph>
        </div>
      </section>

      {/* Main Content Form & Contact Info */}
      <section style={{ maxWidth: "1200px", margin: "60px auto 0 auto", padding: "0 40px" }}>
        <Row gutter={[48, 48]}>
          {/* Form Column */}
          <Col xs={24} lg={14}>
            <Card
              variant="borderless"
              style={{
                borderRadius: "12px",
                boxShadow: "0 8px 24px rgba(138, 106, 74, 0.03)",
                border: "1px solid var(--border-color)",
              }}
              styles={{ body: { padding: "40px" } }}
            >
              <Title level={2} className="font-serif" style={{ fontSize: "26px", marginBottom: "32px" }}>
                Send a Message
              </Title>

              <Form layout="vertical" form={form} onFinish={onFinish} requiredMark={false}>
                <Row gutter={[16, 0]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="name"
                      label="Your Name"
                      rules={[
                        { required: true, message: "Please enter your name" },
                        { min: 2, message: "Name must be at least 2 characters long" }
                      ]}
                    >
                      <Input placeholder="Enter your full name" style={{ height: "42px" }} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="phone"
                      label="Phone Number"
                      rules={[
                        { required: true, message: "Please enter your phone number" },
                        { min: 8, message: "Please enter a valid phone number" }
                      ]}
                    >
                      <Input placeholder="Enter mobile number" style={{ height: "42px" }} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[16, 0]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="email"
                      label="Email Address"
                      rules={[{ type: "email", message: "Please enter a valid email" }]}
                    >
                      <Input placeholder="Enter email (optional)" style={{ height: "42px" }} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="projectType"
                      label="Project Type"
                      rules={[{ required: true, message: "Select project type" }]}
                    >
                      <Select
                        placeholder="Select project category"
                        style={{ height: "42px" }}
                        options={[
                          { label: "Residential Home", value: "home" },
                          { label: "Office Workspace", value: "office" },
                          { label: "Bespoke Interior", value: "interior" },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[16, 0]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="location"
                      label="Site Location"
                      rules={[
                        { required: true, message: "Please specify site location" },
                        { min: 2, message: "Location must be at least 2 characters long" }
                      ]}
                    >
                      <Input placeholder="e.g., Nadapuram, Kallachi" style={{ height: "42px" }} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="budget" label="Estimated Budget">
                      <Input placeholder="e.g., 20 - 30 Lakhs (optional)" style={{ height: "42px" }} />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="message"
                  label="Inquiry / Message"
                  rules={[
                    { required: true, message: "Please leave your message details" },
                    { min: 10, message: "Message must be at least 10 characters long" }
                  ]}
                >
                  <Input.TextArea
                    rows={5}
                    placeholder="Describe your design needs, size of property, etc."
                  />
                </Form.Item>

                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={submitting}
                  block
                  style={{ height: "48px", marginTop: "12px", fontSize: "16px", fontWeight: 600 }}
                >
                  Submit Consultation Request
                </Button>
              </Form>
            </Card>
          </Col>

          {/* Info Column */}
          <Col xs={24} lg={10}>
            <Space direction="vertical" size={24} style={{ width: "100%" }}>
              <Card
                variant="borderless"
                style={{
                  borderRadius: "12px",
                  border: "1px solid var(--border-color)",
                }}
                styles={{ body: { padding: "32px" } }}
              >
                <Title level={3} className="font-serif" style={{ fontSize: "22px", marginBottom: "24px" }}>
                  Studio Information
                </Title>

                <Space direction="vertical" size={20} style={{ width: "100%" }}>
                  <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    <EnvironmentOutlined style={{ fontSize: "20px", color: "var(--primary-color)", marginTop: "4px" }} />
                    <div>
                      <Text type="secondary" style={{ fontSize: "12px", display: "block" }}>NADAPURAM OFFICE</Text>
                      <Text style={{ fontWeight: 500 }}>First Floor, Royal Plaza, Nadapuram, Kozhikode, KL</Text>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    <EnvironmentOutlined style={{ fontSize: "20px", color: "var(--primary-color)", marginTop: "4px" }} />
                    <div>
                      <Text type="secondary" style={{ fontSize: "12px", display: "block" }}>KALLACHI BRANCH</Text>
                      <Text style={{ fontWeight: 500 }}>Opp. Town Masjid, Kallachi, Vadakara, India 673506</Text>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                    <PhoneOutlined style={{ fontSize: "20px", color: "var(--primary-color)" }} />
                    <div>
                      <Text type="secondary" style={{ fontSize: "12px", display: "block" }}>TELEPHONE</Text>
                      <a href="tel:+919744335051" style={{ fontWeight: 500 }}>+91 97443 35051</a>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                    <MailOutlined style={{ fontSize: "20px", color: "var(--primary-color)" }} />
                    <div>
                      <Text type="secondary" style={{ fontSize: "12px", display: "block" }}>EMAIL ADDRESS</Text>
                      <a href="mailto:info@mieuxinteriors.com" style={{ fontWeight: 500 }}>info@mieuxinteriors.com</a>
                    </div>
                  </div>
                </Space>
              </Card>

              {/* Direct WhatsApp Call-to-action */}
              <Card
                className="whatsapp-card"
                variant="borderless"
                style={{
                  background: "#25d366",
                  backgroundColor: "#25d366",
                  borderRadius: "12px",
                  color: "#ffffff",
                }}
                styles={{
                  body: {
                    padding: "32px",
                    textAlign: "center",
                    backgroundColor: "#25d366",
                    color: "#ffffff",
                    borderRadius: "12px",
                  },
                }}
              >
                <WhatsAppOutlined style={{ fontSize: "40px", marginBottom: "16px" }} />
                <Title level={3} style={{ color: "#ffffff", margin: 0 }} className="font-serif">
                  Quick Chat on WhatsApp
                </Title>
                <Paragraph style={{ color: "#ffffff", opacity: 0.9, marginTop: "8px", fontSize: "14px" }}>
                  Need an immediate architectural layout answer? Message our designers directly.
                </Paragraph>
                <Button
                  size="large"
                  href="https://wa.me/919744335051?text=Hi%20Mieux%20Interiors,%20I%20would%20like%20to%20inquire%20about%20a%20property%20design."
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    backgroundColor: "#ffffff",
                    borderColor: "#ffffff",
                    color: "#25d366",
                    fontWeight: 600,
                    marginTop: "8px",
                  }}
                >
                  Start WhatsApp Chat
                </Button>
              </Card>
            </Space>
          </Col>
        </Row>
      </section>

      {/* Map Embed Section */}
      <section style={{ maxWidth: "1200px", margin: "60px auto 0 auto", padding: "0 40px" }}>
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps?q=11.6863,75.6775&z=15&output=embed"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
}

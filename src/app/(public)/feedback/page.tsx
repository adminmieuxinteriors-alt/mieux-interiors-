"use client";

import { useState, useEffect } from "react";
import { Form, Input, Button, Card, Rate, Typography, App as AntApp, Spin, Row, Col } from "antd";
import { useRouter } from "next/navigation";
import { MessageOutlined, EnvironmentOutlined, UserOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

export default function FeedbackPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const { message } = AntApp.useApp();
  const [loading, setLoading] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(true);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [fetchingTestimonials, setFetchingTestimonials] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/users/me");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            form.setFieldsValue({
              name: data.user.name,
            });
          }
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
      } finally {
        setFetchingUser(false);
      }
    };

    const fetchTestimonials = async () => {
      try {
        const res = await fetch("/api/testimonials");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            setTestimonials(data.data);
          }
        }
      } catch (err) {
        console.error("Error fetching testimonials:", err);
      } finally {
        setFetchingTestimonials(false);
      }
    };

    fetchUser();
    fetchTestimonials();
  }, [form]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          place: values.place || "",
          quote: values.quote,
          rating: values.rating,
          featured: false, // Default to false, admin can feature it if they want
        }),
      });

      const data = await res.json();
      if (data.success) {
        message.success("Thank you for your valuable review! It has been submitted.");
        
        // Prepend the new review to the list immediately
        setTestimonials((prev) => [data.data, ...prev]);
        form.resetFields();

        // Re-populate the user's name
        const userRes = await fetch("/api/users/me");
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData.success && userData.user) {
            form.setFieldsValue({ name: userData.user.name });
          }
        }
      } else {
        message.error(data.message || "Failed to submit review.");
      }
    } catch (err) {
      console.error("Review submission error:", err);
      message.error("Error submitting review.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingUser) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 180px)",
          backgroundColor: "var(--bg-warm)",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "calc(100vh - 180px)",
        backgroundColor: "var(--bg-warm)",
        padding: "60px 24px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Row gutter={[48, 48]} align="stretch">
          {/* Write a Review Form */}
          <Col xs={24} lg={11}>
            <Card
              style={{
                borderRadius: "16px",
                boxShadow: "0 10px 40px rgba(138, 106, 74, 0.05)",
                border: "1px solid var(--border-color)",
                height: "100%",
              }}
              styles={{ body: { padding: "40px 36px" } }}
            >
              <div style={{ textAlign: "center", marginBottom: "32px" }}>
                <span
                  style={{
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    fontSize: "11px",
                    color: "var(--primary-color)",
                    fontWeight: 600,
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  Share Your Experience
                </span>
                <Title level={2} className="font-serif" style={{ margin: 0, fontSize: "28px" }}>
                  Write a Review
                </Title>
                <Paragraph style={{ color: "var(--text-secondary)", marginTop: "8px", fontSize: "14px" }}>
                  Your feedback helps us grow and continue delivering exceptional architectural and interior designs.
                </Paragraph>
              </div>

              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                requiredMark={false}
                initialValues={{ rating: 5 }}
              >
                <Form.Item
                  name="name"
                  label={<Text style={{ fontWeight: 500 }}>Your Name</Text>}
                  rules={[{ required: true, message: "Please enter your name" }]}
                >
                  <Input
                    prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                    placeholder="e.g. John Doe"
                    size="large"
                    style={{ height: "45px", borderRadius: "6px" }}
                  />
                </Form.Item>

                <Form.Item
                  name="place"
                  label={<Text style={{ fontWeight: 500 }}>Your Location / Place (Optional)</Text>}
                >
                  <Input
                    prefix={<EnvironmentOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                    placeholder="e.g. Nadapuram, Kallachi"
                    size="large"
                    style={{ height: "45px", borderRadius: "6px" }}
                  />
                </Form.Item>

                <Form.Item
                  name="rating"
                  label={<Text style={{ fontWeight: 500 }}>Rating</Text>}
                  rules={[{ required: true, message: "Please select a rating" }]}
                >
                  <Rate style={{ color: "var(--primary-color)", fontSize: "24px" }} />
                </Form.Item>

                <Form.Item
                  name="quote"
                  label={<Text style={{ fontWeight: 500 }}>Your Review</Text>}
                  rules={[{ required: true, message: "Please enter your review feedback" }]}
                >
                  <TextArea
                    placeholder="Tell us about your experience designing with Mieux Interiors..."
                    rows={5}
                    style={{ borderRadius: "6px" }}
                  />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, marginTop: "8px" }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    loading={loading}
                    style={{ height: "48px", fontWeight: 600, borderRadius: "6px" }}
                  >
                    Submit Review
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* List of Recent Reviews */}
          <Col xs={24} lg={13}>
            <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <div style={{ marginBottom: "24px" }}>
                <span
                  style={{
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    fontSize: "11px",
                    color: "var(--primary-color)",
                    fontWeight: 600,
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  What Others Say
                </span>
                <Title level={2} className="font-serif" style={{ margin: 0, fontSize: "28px" }}>
                  Client Reviews
                </Title>
              </div>

              {fetchingTestimonials ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
                  <Spin size="large" />
                </div>
              ) : testimonials.length === 0 ? (
                <Card
                  style={{
                    borderRadius: "12px",
                    border: "1px solid var(--border-color)",
                    textAlign: "center",
                    padding: "40px",
                  }}
                >
                  <Text type="secondary">No reviews submitted yet. Be the first to write one!</Text>
                </Card>
              ) : (
                <div style={{ flex: 1, overflowY: "auto", maxHeight: "650px", paddingRight: "8px" }}>
                  {testimonials.map((item) => (
                    <Card
                      key={item._id}
                      style={{
                        borderRadius: "12px",
                        border: "1px solid var(--border-color)",
                        marginBottom: "16px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                      }}
                      styles={{ body: { padding: "20px" } }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "10px",
                        }}
                      >
                        <div>
                          <Text style={{ fontWeight: 600, fontSize: "16px", display: "block" }}>
                            {item.name}
                          </Text>
                          {item.place && (
                            <Text type="secondary" style={{ fontSize: "13px" }}>
                              <EnvironmentOutlined style={{ marginRight: "4px" }} />
                              {item.place}
                            </Text>
                          )}
                        </div>
                        <Rate
                          disabled
                          defaultValue={item.rating}
                          style={{ fontSize: "14px", color: "var(--primary-color)" }}
                        />
                      </div>
                      <Paragraph
                        style={{
                          margin: 0,
                          fontStyle: "italic",
                          color: "var(--text-main)",
                          fontSize: "14px",
                          lineHeight: 1.6,
                        }}
                      >
                        &ldquo;{item.quote}&rdquo;
                      </Paragraph>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

"use client";

import { Col, Row, Space, Typography, Card } from "antd";

const { Title, Paragraph, Text } = Typography;

export default function AboutPage() {
  const values = [
    {
      title: "Material Honesty",
      desc: "We prioritize raw textures, sustainable timber, architectural concretes, and custom bronze highlights, creating a tactile and sensory experience.",
    },
    {
      title: "Spatial Efficiency",
      desc: "Every inch of a project is calculated. We reject layout waste, designing smart, fluid movements that maximize daylight and ventilation.",
    },
    {
      title: "Contextual Sensitivity",
      desc: "Our architecture respects the microclimate and tropical context of Kerala, integrating local materials and landscape elements smoothly.",
    },
  ];

  return (
    <div style={{ backgroundColor: "var(--bg-warm)", minHeight: "100vh" }}>
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
            About Us
          </span>
          <Title level={1} style={{ color: "#ffffff", fontSize: "40px", margin: 0 }} className="font-serif">
            Our Studio & Philosophy
          </Title>
          <Paragraph style={{ color: "#d8cfc0", fontSize: "16px", marginTop: "16px", lineHeight: "1.6" }}>
            A trusted team of architects and interior designers in Nadapuram shaping bespoke residential and workplace architectures.
          </Paragraph>
        </div>
      </section>

      {/* Narrative Section */}
      <section style={{ padding: "80px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        <Row gutter={[48, 48]} align="middle">
          <Col xs={24} md={12}>
            <span style={{ color: "var(--primary-color)", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600 }}>
              The Mieux Story
            </span>
            <Title level={2} className="font-serif" style={{ fontSize: "32px", margin: "12px 0 24px 0" }}>
              Redefining Residential & Corporate Architectures
            </Title>
            <Paragraph style={{ color: "var(--text-secondary)", fontSize: "16px", lineHeight: "1.8" }}>
              Founded with the vision to bring uncompromising quality and bespoke design to the region, Mieux Interiors & Architects has grown into a leading architecture and interior design studio with offices in Nadapuram and Kallachi.
            </Paragraph>
            <Paragraph style={{ color: "var(--text-secondary)", fontSize: "16px", lineHeight: "1.8" }}>
              Our work is defined by clean lines, natural material compositions, and a dedicated focus on client requirements. We steer clear of repetitive design models, choosing instead to custom-craft layouts, furniture details, and exterior façades for each client.
            </Paragraph>
          </Col>
          <Col xs={24} md={12}>
            <div
              style={{
                height: "380px",
                borderRadius: "12px",
                overflow: "hidden",
                backgroundImage: `url('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </Col>
        </Row>
      </section>

      {/* Core Values */}
      <section style={{ backgroundColor: "#f6f3ed", padding: "80px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{ color: "var(--primary-color)", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600 }}>
              Our Beliefs
            </span>
            <Title level={2} className="font-serif" style={{ fontSize: "32px", marginTop: "8px" }}>
              Principles That Guide Us
            </Title>
          </div>

          <Row gutter={[24, 24]}>
            {values.map((v, i) => (
              <Col xs={24} md={8} key={i}>
                <Card
                  style={{
                    height: "100%",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                  }}
                  styles={{ body: { padding: "32px" } }}
                >
                  <Title level={4} className="font-serif" style={{ color: "var(--primary-color)", marginBottom: "16px" }}>
                    {v.title}
                  </Title>
                  <Paragraph style={{ color: "var(--text-secondary)", fontSize: "15px", lineHeight: "1.6", margin: 0 }}>
                    {v.desc}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Design Journey */}
      <section style={{ padding: "80px 40px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <Title level={2} className="font-serif" style={{ fontSize: "32px" }}>
            Our Work Process
          </Title>
          <Paragraph type="secondary">How we bring your dream design to reality.</Paragraph>
        </div>

        <Space direction="vertical" size={40} style={{ width: "100%" }}>
          <div style={{ display: "flex", gap: "24px" }}>
            <div
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "var(--primary-color)",
                border: "2px solid var(--primary-color)",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              1
            </div>
            <div>
              <Title level={4} style={{ margin: "4px 0 8px 0" }}>
                Consultation & Site Review
              </Title>
              <Paragraph type="secondary" style={{ fontSize: "15px", lineHeight: "1.6" }}>
                We discuss scope, design style preferences, functional space counts, and budget outline during an initial meeting. We then conduct detailed site measurements.
              </Paragraph>
            </div>
          </div>

          <div style={{ display: "flex", gap: "24px" }}>
            <div
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "var(--primary-color)",
                border: "2px solid var(--primary-color)",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              2
            </div>
            <div>
              <Title level={4} style={{ margin: "4px 0 8px 0" }}>
                Conceptual Layouts & Moodboards
              </Title>
              <Paragraph type="secondary" style={{ fontSize: "15px", lineHeight: "1.6" }}>
                We draw 2D spatial layouts and set color boards/moodboards to define the aesthetic direction of each space, refining them with your active feedback.
              </Paragraph>
            </div>
          </div>

          <div style={{ display: "flex", gap: "24px" }}>
            <div
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "var(--primary-color)",
                border: "2px solid var(--primary-color)",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              3
            </div>
            <div>
              <Title level={4} style={{ margin: "4px 0 8px 0" }}>
                3D Visualizations & Working Drawings
              </Title>
              <Paragraph type="secondary" style={{ fontSize: "15px", lineHeight: "1.6" }}>
                We generate high-fidelity 3D renders showcasing actual lighting, furniture surfaces, and finishes, followed by detailed construction drawings for wood fabrication and electrical layouts.
              </Paragraph>
            </div>
          </div>

          <div style={{ display: "flex", gap: "24px" }}>
            <div
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "var(--primary-color)",
                border: "2px solid var(--primary-color)",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              4
            </div>
            <div>
              <Title level={4} style={{ margin: "4px 0 8px 0" }}>
                Execution & Handover
              </Title>
              <Paragraph type="secondary" style={{ fontSize: "15px", lineHeight: "1.6" }}>
                Our onsite engineers oversee carpentry fabrication, ceiling installation, lighting placement, and paint scheduling, handing you a key to a completed, polished masterpiece.
              </Paragraph>
            </div>
          </div>
        </Space>
      </section>
    </div>
  );
}

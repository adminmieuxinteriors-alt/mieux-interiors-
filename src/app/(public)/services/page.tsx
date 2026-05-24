"use client";

import { Row, Col, Card, Typography, Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

export default function ServicesPage() {
  const serviceList = [
    {
      title: "Residential Architecture",
      subtitle: "Bespoke villas & home plans",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      description:
        "We plan homes that respond to the environment and look gorgeous. Our design includes site analysis, structural coordination, floor plan layouts, elevation styling, and landscape integration.",
      details: ["Bespoke Villa Designs", "Structural Planning & Consultation", "Exterior Elevation Modeling", "Tropical Landscape Concepts"],
    },
    {
      title: "Commercial & Office Workspaces",
      subtitle: "Productive corporate layouts",
      image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
      description:
        "Workspaces need flow, acoustic control, and aesthetic energy. We design corporate offices, showrooms, and retail stores that increase productivity and enhance branding.",
      details: ["Corporate Office Floorplans", "Ergonomic Furniture Layouts", "Acoustic Wall Panelling", "Retail Showroom Styling"],
    },
    {
      title: "Bespoke Interior Designing",
      subtitle: "Material harmony and details",
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
      description:
        "Our interior design package handles all detailed spaces. We produce ceiling patterns, lighting maps, and custom wooden cabinets, assuring a refined interior experience.",
      details: ["Modular Kitchen Configurations", "Wardrobe & TV Consol Detailings", "Lighting & Ceiling Schematics", "Custom Furniture Fabrications"],
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
            What We Offer
          </span>
          <Title level={1} style={{ color: "#ffffff", fontSize: "40px", margin: 0 }} className="font-serif">
            Our Services
          </Title>
          <Paragraph style={{ color: "#d8cfc0", fontSize: "16px", marginTop: "16px", lineHeight: "1.6" }}>
            Comprehensive design solutions spanning architectural planning, workplace ergonomics, and tailored carpentry detailing.
          </Paragraph>
        </div>
      </section>

      {/* Services List Grid */}
      <section style={{ padding: "80px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        <Row gutter={[40, 60]}>
          {serviceList.map((service, index) => (
            <Col xs={24} key={index}>
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid var(--border-color)",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 6px 20px rgba(138, 106, 74, 0.03)",
                }}
              >
                <Row gutter={[0, 0]} align="stretch">
                  <Col
                    xs={24}
                    lg={12}
                    style={{
                      backgroundImage: `url('${service.image}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      minHeight: "350px",
                    }}
                  />
                  <Col xs={24} lg={12} style={{ padding: "48px" }}>
                    <span
                      style={{
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                        fontSize: "12px",
                        color: "var(--primary-color)",
                        fontWeight: 600,
                      }}
                    >
                      {service.subtitle}
                    </span>
                    <Title level={2} className="font-serif" style={{ fontSize: "28px", margin: "8px 0 16px 0" }}>
                      {service.title}
                    </Title>
                    <Paragraph style={{ color: "var(--text-secondary)", fontSize: "15px", lineHeight: "1.7", marginBottom: "24px" }}>
                      {service.description}
                    </Paragraph>

                    <Row gutter={[16, 12]} style={{ marginBottom: "32px" }}>
                      {service.details.map((detail, idx) => (
                        <Col xs={12} key={idx}>
                          <Text style={{ fontSize: "14px", color: "var(--text-main)" }}>
                            <span style={{ color: "var(--primary-color)", marginRight: "8px", fontWeight: "bold" }}>•</span>
                            {detail}
                          </Text>
                        </Col>
                      ))}
                    </Row>

                    <Button type="primary" href="/contact" icon={<ArrowRightOutlined />}>
                      Book Consultation
                    </Button>
                  </Col>
                </Row>
              </div>
            </Col>
          ))}
        </Row>
      </section>

      {/* Consult Banner */}
      <section style={{ backgroundColor: "#f6f3ed", padding: "80px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <Title level={3} className="font-serif" style={{ fontSize: "26px", marginBottom: "16px" }}>
            Custom Furniture & Wood Detailing
          </Title>
          <Paragraph type="secondary" style={{ fontSize: "15px", marginBottom: "24px", lineHeight: "1.6" }}>
            All project contracts include full timber schedules and custom interior joinery. We work with highly skilled local wood fabricators in Kallachi to ensure immaculate cabinet work and structural oak accents.
          </Paragraph>
          <Button href="/contact" style={{ borderColor: "var(--primary-color)", color: "var(--primary-color)" }}>
            Inquire About Custom Furniture
          </Button>
        </div>
      </section>
    </div>
  );
}

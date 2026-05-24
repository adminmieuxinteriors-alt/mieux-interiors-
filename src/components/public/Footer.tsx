"use client";

import Link from "next/link";
import { Row, Col, Space, Typography } from "antd";
import {
  InstagramOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import Logo from "./Logo";

const { Title, Text, Paragraph } = Typography;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer
        style={{
          background: "#2b2621", // Dark warm charcoal
          color: "#eae4db",
          padding: "60px 40px 30px 40px",
          borderTop: "3px solid var(--primary-color)",
        }}
      >
        <Row gutter={[32, 40]} style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Col xs={24} md={8}>
            <Space direction="vertical" size={16}>
              <Link href="/" style={{ display: "flex" }}>
                <Logo light fontSize="26px" subtitleSize="9px" />
              </Link>
              <Paragraph style={{ color: "#d8cfc0", fontSize: "14px", lineHeight: "1.6" }}>
                Bespoke design studio based in Nadapuram and Kallachi, specializing in residential architecture, workspace design, and refined custom interiors.
              </Paragraph>

            </Space>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Title level={4} style={{ color: "#ffffff", marginBottom: "20px" }} className="font-serif">
              Studio Locations
            </Title>
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              <div style={{ display: "flex", alignItems: "flex-start" }}>
                <EnvironmentOutlined style={{ color: "var(--primary-color)", marginRight: "8px", marginTop: "4px" }} />
                <Text style={{ color: "#eae4db" }}>
                  <strong>Nadapuram Office:</strong><br />
                  First Floor, Royal Plaza, Nadapuram, Kozhikode, KL 673504
                </Text>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start" }}>
                <EnvironmentOutlined style={{ color: "var(--primary-color)", marginRight: "8px", marginTop: "4px" }} />
                <Text style={{ color: "#eae4db" }}>
                  <strong>Kallachi Branch:</strong><br />
                  Opp. Town Masjid, Kallachi, Vadakara, India 673506
                </Text>
              </div>
            </Space>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Title level={4} style={{ color: "#ffffff", marginBottom: "20px" }} className="font-serif">
              Inquiries
            </Title>
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <PhoneOutlined style={{ color: "var(--primary-color)", marginRight: "8px" }} />
                <a href="tel:+919744335051" style={{ color: "#eae4db" }}>
                  +91 97443 35051
                </a>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <MailOutlined style={{ color: "var(--primary-color)", marginRight: "8px" }} />
                <a href="mailto:info@mieuxinteriors.com" style={{ color: "#eae4db" }}>
                  info@mieuxinteriors.com
                </a>
              </div>
              <div style={{ display: "flex", alignItems: "center", marginTop: "4px" }}>
                <InstagramOutlined style={{ color: "var(--primary-color)", marginRight: "8px", fontSize: "16px" }} />
                <a
                  href="https://www.instagram.com/mieux_interior_/"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#eae4db" }}
                >
                  Instagram
                </a>
              </div>
            </Space>
          </Col>
        </Row>

        <div
          style={{
            maxWidth: "1200px",
            margin: "40px auto 0 auto",
            paddingTop: "20px",
            borderTop: "1px solid #4a4138",
            textAlign: "center",
            fontSize: "14px",
            color: "#d8cfc0",
          }}
        >
          <p>© {currentYear} Mieux Interiors & Architects. All Rights Reserved.</p>
        </div>
      </footer>

      {/* Global Floating WhatsApp Button */}
      <a
        href="https://wa.me/919744335051?text=Hi%20Mieux%20Interiors,%20I%20would%20like%20to%20book%20a%20design%20consultation."
        target="_blank"
        rel="noreferrer"
        className="whatsapp-float"
        title="Chat on WhatsApp"
      >
        <WhatsAppOutlined />
      </a>
    </>
  );
}

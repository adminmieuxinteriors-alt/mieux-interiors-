"use client";

import React, { useEffect, useState } from "react";
import { Row, Col, Space, Typography, Tag, Image, Button, Spin, Empty } from "antd";
import { ArrowLeftOutlined, CalendarOutlined, CompassOutlined, BorderOutlined, AppstoreOutlined } from "@ant-design/icons";
import Link from "next/link";
import MediaCardSlider from "@/components/public/MediaCardSlider";
import { optimizeMediaUrl } from "@/lib/cloudinary-optimize";

const { Title, Paragraph, Text } = Typography;

export default function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fallback map for local demo projects if DB is not set up
  const fallbackMap: Record<string, any> = {
    "the-bronze-villa": {
      title: "The Bronze Villa",
      category: "residential",
      location: "Kallachi",
      shortDescription: "A luxurious 4 BHK residential project featuring earthy tones and premium bronze accents.",
      fullDescription: "The Bronze Villa is designed to merge luxury with warmth. Every element in this home is carefully selected to reflect natural materials, with solid timber finishes, earthy olive accents, and custom bronze fixtures. The spatial layout is open, welcoming ample natural light throughout the double-height living room and dining spaces.",
      coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80"
      ],
      year: 2025,
      area: "3,800 sq ft",
      styleTags: ["Modern", "Bronze Accent", "Warm Minimalist"]
    },
    "earthy-slate-studio": {
      title: "Earthy Slate Studio",
      category: "commercial",
      location: "Kallachi, Kerala",
      shortDescription: "An ergonomic, productive office space for a creative design agency with natural accents.",
      fullDescription: "Earthy Slate Studio is a workplace that fosters productivity and creativity. Employing an open floor plan, acoustic wood paneling, slate-gray floor tiles, and custom linear lighting. The office features multiple collaborative pods, private call chambers, and a central social kitchen area that acts as the hub of the agency.",
      coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80"
      ],
      year: 2024,
      area: "2,200 sq ft",
      styleTags: ["Ergonomic", "Industrial", "Creative"]
    },
    "olive-harmony-residence": {
      title: "Olive Harmony Residence",
      category: "interior",
      location: "Kozhikode, Kerala",
      shortDescription: "Custom interior styling prioritizing material balance, natural ventilation, and muted olives.",
      fullDescription: "Olive Harmony Residence is an interior-only project designed for a family of four. It emphasizes material honesty and spatial efficiency. Custom-crafted wardrobes, cane sliding partitions, and a soothing color palette dominated by muted olive and warm white create a sanctuary-like atmosphere.",
      coverImage: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&w=800&q=80"
      ],
      year: 2025,
      area: "1,950 sq ft",
      styleTags: ["Custom Furniture", "Warm White", "Tropical Modernism"]
    }
  };

  useEffect(() => {
    async function loadProject() {
      try {
        const res = await fetch(`/api/projects/${encodeURIComponent(slug)}`);
        const json = await res.json();
        if (json.success && json.data) {
          setProject(json.data);
        } else {
          setProject(fallbackMap[slug] || null);
        }
      } catch (err) {
        console.error("Error loading project details:", err);
        setProject(fallbackMap[slug] || null);
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "80vh", backgroundColor: "var(--bg-warm)" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "80vh", backgroundColor: "var(--bg-warm)" }}>
        <Empty description="Project not found">
          <Button type="primary" href="/projects">Back to Portfolio</Button>
        </Empty>
      </div>
    );
  }

  const mediaItems = project.media && project.media.length > 0
    ? project.media
    : project.gallery
      ? project.gallery.map((url: string) => ({ url, type: "image" as const }))
      : project.coverImage
        ? [{ url: project.coverImage, type: "image" as const }]
        : [];

  return (
    <div style={{ backgroundColor: "var(--bg-warm)", minHeight: "100vh", paddingBottom: "100px" }}>
      {/* Cover Banner */}
      <section
        style={{
          position: "relative",
          height: "60vh",
          minHeight: "400px",
          backgroundColor: "#000",
          overflow: "hidden",
        }}
      >
        <MediaCardSlider media={project.media} coverImage={project.coverImage} height="60vh" width={1200} />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(to bottom, rgba(43, 38, 33, 0.2) 0%, rgba(43, 38, 33, 0.7) 100%)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "40px",
            right: "40px",
            maxWidth: "1200px",
            margin: "0 auto",
            color: "#ffffff",
            zIndex: 2,
          }}
        >
          <Link href="/projects" style={{ color: "#eae4db", display: "inline-flex", alignItems: "center", marginBottom: "16px" }}>
            <ArrowLeftOutlined style={{ marginRight: "8px" }} /> Back to Portfolio
          </Link>
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
            <Tag color="var(--primary-color)" style={{ textTransform: "uppercase", padding: "4px 8px" }}>
              {project.category}
            </Tag>
          </div>
          <Title level={1} style={{ color: "#ffffff", fontSize: "clamp(28px, 5vw, 48px)", margin: 0 }} className="font-serif">
            {project.title}
          </Title>
        </div>
      </section>

      {/* Details & Info */}
      <section style={{ maxWidth: "1200px", margin: "60px auto 0 auto", padding: "0 40px" }}>
        <Row gutter={[48, 48]}>
          <Col xs={24} lg={16}>
            <Title level={2} className="font-serif" style={{ fontSize: "28px", marginBottom: "24px" }}>
              Project Narrative
            </Title>
            <Paragraph style={{ fontSize: "16px", color: "var(--text-main)", lineHeight: "1.9" }}>
              {project.fullDescription}
            </Paragraph>

            {project.styleTags && project.styleTags.length > 0 && (
              <div style={{ marginTop: "40px" }}>
                <Title level={4} style={{ fontSize: "16px", marginBottom: "12px" }}>Style Tags</Title>
                <Space size={8} wrap>
                  {project.styleTags.map((tag: string, index: number) => (
                    <Tag key={index} style={{ border: "1px solid var(--border-color)", background: "#ffffff", color: "var(--text-main)" }}>
                      {tag}
                    </Tag>
                  ))}
                </Space>
              </div>
            )}
          </Col>

          {/* Sidebar Info Grid */}
          <Col xs={24} lg={8}>
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                padding: "32px",
                boxShadow: "0 4px 15px rgba(138, 106, 74, 0.02)",
              }}
            >
              <Title level={3} className="font-serif" style={{ fontSize: "22px", marginBottom: "24px" }}>
                Specifications
              </Title>

              <Space direction="vertical" size={24} style={{ width: "100%" }}>
                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <CompassOutlined style={{ fontSize: "20px", color: "var(--primary-color)" }} />
                  <div>
                    <Text type="secondary" style={{ fontSize: "12px", display: "block" }}>LOCATION</Text>
                    <Text style={{ fontWeight: 500 }}>{project.location}</Text>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <AppstoreOutlined style={{ fontSize: "20px", color: "var(--primary-color)" }} />
                  <div>
                    <Text type="secondary" style={{ fontSize: "12px", display: "block" }}>CATEGORY</Text>
                    <Text style={{ fontWeight: 500, textTransform: "capitalize" }}>{project.category}</Text>
                  </div>
                </div>

                {project.year && (
                  <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                    <CalendarOutlined style={{ fontSize: "20px", color: "var(--primary-color)" }} />
                    <div>
                      <Text type="secondary" style={{ fontSize: "12px", display: "block" }}>YEAR</Text>
                      <Text style={{ fontWeight: 500 }}>{project.year}</Text>
                    </div>
                  </div>
                )}

                {project.area && (
                  <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                    <BorderOutlined style={{ fontSize: "20px", color: "var(--primary-color)" }} />
                    <div>
                      <Text type="secondary" style={{ fontSize: "12px", display: "block" }}>PROJECT AREA</Text>
                      <Text style={{ fontWeight: 500 }}>{project.area}</Text>
                    </div>
                  </div>
                )}
              </Space>

              <Button type="primary" block href="/contact" style={{ marginTop: "32px", height: "45px" }}>
                Consult About This Project
              </Button>
            </div>
          </Col>
        </Row>
      </section>

      {/* Gallery Section */}
      {mediaItems.length > 0 && (
        <section style={{ maxWidth: "1200px", margin: "80px auto 0 auto", padding: "0 40px" }}>
          <Title level={2} className="font-serif" style={{ fontSize: "28px", marginBottom: "32px" }}>
            Photo Gallery
          </Title>

          <Image.PreviewGroup>
            <Row gutter={[20, 20]}>
              {mediaItems.map((item: any, index: number) => (
                <Col xs={24} sm={12} md={8} key={index}>
                  <div
                    style={{
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: "1px solid var(--border-color)",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.02)",
                      height: "240px",
                      position: "relative",
                      backgroundColor: "#000",
                    }}
                  >
                    {item.type === "video" ? (
                      <video
                        src={optimizeMediaUrl(item.url, { width: 800, type: "video" })}
                        controls
                        style={{
                          width: "100%",
                          height: "240px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Image
                        src={optimizeMediaUrl(item.url, { width: 800, type: "image" })}
                        alt={`${project.title} Gallery ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "240px",
                          objectFit: "cover",
                          cursor: "zoom-in",
                        }}
                        wrapperStyle={{ width: "100%", height: "100%" }}
                      />
                    )}
                  </div>
                </Col>
              ))}
            </Row>
          </Image.PreviewGroup>
        </section>
      )}
    </div>
  );
}

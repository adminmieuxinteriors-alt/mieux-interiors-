"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Tabs, Card, Row, Col, Typography, Spin } from "antd";
import MediaCardSlider from "@/components/public/MediaCardSlider";

const { Title, Paragraph, Text } = Typography;

export default function PublicProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);

  const fallbackProjects = [
    {
      _id: "1",
      title: "The Bronze Villa",
      slug: "the-bronze-villa",
      category: "home",
      location: "Kallachi, Nadapuram",
      coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      shortDescription: "A luxurious 4 BHK residential project featuring earthy tones and premium bronze accents."
    },
    {
      _id: "2",
      title: "Earthy Slate Studio",
      slug: "earthy-slate-studio",
      category: "office",
      location: "Nadapuram, Kerala",
      coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
      shortDescription: "An ergonomic, productive office space for a creative design agency with natural accents."
    },
    {
      _id: "3",
      title: "Olive Harmony Residence",
      slug: "olive-harmony-residence",
      category: "interior",
      location: "Kozhikode, Kerala",
      coverImage: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
      shortDescription: "Custom interior styling prioritizing material balance, natural ventilation, and muted olives."
    }
  ];

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch("/api/projects");
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          // Only show published or featured projects on public site
          const publicItems = json.data.filter((p: any) => p.status === "published" || p.status === "featured");
          setProjects(publicItems.length > 0 ? publicItems : json.data);
        } else {
          setProjects(fallbackProjects);
        }
      } catch (err) {
        console.error("Error loading portfolio projects:", err);
        setProjects(fallbackProjects);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  useEffect(() => {
    if (activeTab === "all") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter((p) => p.category === activeTab));
    }
  }, [activeTab, projects]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const tabs = [
    { key: "all", label: "All Projects" },
    { key: "home", label: "Residential" },
    { key: "office", label: "Corporate Offices" },
    { key: "interior", label: "Custom Interiors" },
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
            Our Work
          </span>
          <Title level={1} style={{ color: "#ffffff", fontSize: "40px", margin: 0 }} className="font-serif">
            Design Portfolio
          </Title>
          <Paragraph style={{ color: "#d8cfc0", fontSize: "16px", marginTop: "16px", lineHeight: "1.6" }}>
            Explore our architectural commissions and interior design assignments completed across Nadapuram, Kallachi, and Kozhikode.
          </Paragraph>
        </div>
      </section>

      {/* Tabs Filter & Grid */}
      <section style={{ padding: "60px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        <Tabs
          defaultActiveKey="all"
          onChange={handleTabChange}
          centered
          size="large"
          items={tabs.map((t) => ({ key: t.key, label: t.label }))}
          style={{ marginBottom: "48px" }}
        />

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            {filteredProjects.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <Text type="secondary" style={{ fontSize: "16px" }}>
                  No projects found in this category.
                </Text>
              </div>
            ) : (
              <Row gutter={[24, 32]}>
                {filteredProjects.map((project) => (
                  <Col xs={24} sm={12} md={8} key={project._id}>
                    <Link href={`/projects/${project.slug}`}>
                      <Card
                        hoverable
                        className="premium-card"
                        cover={
                          <MediaCardSlider
                            media={project.media}
                            coverImage={project.coverImage}
                            height="280px"
                          />
                        }
                        styles={{ body: { padding: "24px" } }}
                      >
                        <span
                          style={{
                            color: "var(--primary-color)",
                            fontSize: "12px",
                            textTransform: "uppercase",
                            fontWeight: 600,
                            letterSpacing: "0.05em",
                          }}
                        >
                          {project.category}
                        </span>
                        <Title level={3} className="font-serif" style={{ fontSize: "22px", margin: "8px 0" }}>
                          {project.title}
                        </Title>
                        <Text type="secondary" style={{ display: "block", marginBottom: "12px" }}>
                          {project.location}
                        </Text>
                        <Paragraph type="secondary" style={{ fontSize: "14px", margin: 0, lineHeight: "1.6" }}>
                          {project.shortDescription}
                        </Paragraph>
                      </Card>
                    </Link>
                  </Col>
                ))}
              </Row>
            )}
          </>
        )}
      </section>
    </div>
  );
}
                            </span >
                            <Title level={3} className="font-serif" style={{ fontSize: "22px", fontWeight: 300, margin: "4px 0", color: "var(--text-main)" }}>
                              {project.title}
                            </Title>
                            <Text type="secondary" style={{ display: "block", fontSize: "12px", marginBottom: "12px" }}>
                              {project.location}
                            </Text>
                            <Paragraph type="secondary" style={{ fontSize: "14px", margin: 0, lineHeight: "1.6" }}>
                              {project.shortDescription}
                            </Paragraph>
                          </div >
                        </MotionCard >
                      </Link >
                    </motion.div >
                  </div >
                ))}
              </motion.div >
            )}
          </>
        )}
      </section >

  <style jsx>{`
        .masonry-grid {
          column-count: 3;
          column-gap: 32px;
          width: 100%;
        }
        .masonry-item {
          break-inside: avoid;
          margin-bottom: 32px;
        }
        @media (max-width: 992px) {
          .masonry-grid {
            column-count: 2;
            column-gap: 24px;
          }
          .masonry-item {
            margin-bottom: 24px;
          }
        }
        @media (max-width: 576px) {
          .masonry-grid {
            column-count: 1;
          }
        }
      `}</style>
    </div >
  );
}

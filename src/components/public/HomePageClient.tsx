"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, Col, Row, Space, Typography, Rate, App as AntApp } from "antd";
import { ArrowRightOutlined, RightOutlined, LeftOutlined } from "@ant-design/icons";
import MediaCardSlider from "@/components/public/MediaCardSlider";

const { Title, Paragraph, Text } = Typography;

interface HomePageClientProps {
  initialProjects: any[];
  initialTestimonials: any[];
  initialServices: any[];
  initialHeroBgImage: string;
}

export default function HomePageClient({
  initialProjects,
  initialTestimonials,
  initialServices,
  initialHeroBgImage,
}: HomePageClientProps) {
  const router = useRouter();
  const { message } = AntApp.useApp();
  
  const [featuredProjects] = useState<any[]>(initialProjects);
  const [testimonials] = useState<any[]>(initialTestimonials);
  const [services] = useState<any[]>(initialServices);
  const [heroBgImage] = useState<string>(initialHeroBgImage);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleProtectedLinkClick = (e: React.MouseEvent, dest: string) => {
    const loggedIn = document.cookie.includes("mieux_user_logged_in=true");
    if (!loggedIn) {
      e.preventDefault();
      message.warning("Please sign in or register to view this page.");
      router.push(`/login?redirect=${encodeURIComponent(dest)}`);
    }
  };

  useEffect(() => {
    setIsLoggedIn(document.cookie.includes("mieux_user_logged_in=true"));
    setIsAdmin(document.cookie.includes("mieux_admin_logged_in=true"));
  }, []);

  // Testimonial sliding carousel logic
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setVisibleCount(Math.min(3, testimonials.length || 3));
      } else if (window.innerWidth >= 768) {
        setVisibleCount(Math.min(2, testimonials.length || 2));
      } else {
        setVisibleCount(1);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [testimonials.length]);

  useEffect(() => {
    if (testimonials.length <= visibleCount) {
      setActiveIndex(0);
      return;
    }
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex > testimonials.length - visibleCount) {
          return 0;
        }
        return nextIndex;
      });
    }, 4000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [testimonials.length, visibleCount]);

  const handlePrev = () => {
    if (testimonials.length === 0) return;
    setActiveIndex((prev) => {
      const prevIndex = prev - 1;
      if (prevIndex < 0) {
        return Math.max(0, testimonials.length - visibleCount);
      }
      return prevIndex;
    });
    resetAutoScroll();
  };

  const handleNext = () => {
    if (testimonials.length === 0) return;
    setActiveIndex((prev) => {
      const nextIndex = prev + 1;
      if (nextIndex > testimonials.length - visibleCount) {
        return 0;
      }
      return nextIndex;
    });
    resetAutoScroll();
  };

  const resetAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (testimonials.length <= visibleCount) return;
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex > testimonials.length - visibleCount) {
          return 0;
        }
        return nextIndex;
      });
    }, 4000);
  };

  return (
    <div style={{ backgroundColor: "var(--bg-warm)" }}>
      {/* Hero Banner */}
      <section
        className="hero-container animate-fade-in"
        style={{
          backgroundImage: `url('${heroBgImage}')`,
        }}
      >
        <div className="hero-overlay" />
        <div className="hero-content">
          <span
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.25em",
              fontSize: "14px",
              color: "#ffffff",
              display: "block",
              marginBottom: "16px",
              fontWeight: 600,
            }}
          >
            Architectural Designer • Nadapuram & Kallachi
          </span>
          <Title
            level={1}
            style={{
              color: "#ffffff",
              fontSize: "clamp(32px, 6vw, 64px)",
              lineHeight: "1.1",
              margin: 0,
              fontWeight: 700,
            }}
            className="font-serif"
          >
            Quality. Creativity. Perfection.
          </Title>
          <Paragraph
            style={{
              color: "#eae4db",
              fontSize: "clamp(16px, 2.5vw, 20px)",
              marginTop: "24px",
              lineHeight: "1.6",
              maxWidth: "680px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Trusted design studio crafting luxury homes, modern office workspaces, and custom interiors with material honesty and aesthetic balance in Nadapuram and Kallachi.
          </Paragraph>
          <div
            style={{
              fontSize: "18px",
              color: "#eae4db",
              marginTop: "16px",
              display: "flex",
              justifyContent: "center",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            <span>🏡 Homes</span>
            <span>🏢 Offices</span>
            <span>🛋 Interiors</span>
          </div>
          <Space size={16} style={{ marginTop: "40px" }} wrap>
            <Button
              type="primary"
              size="large"
              href="/projects"
              onClick={(e) => handleProtectedLinkClick(e, "/projects")}
              style={{ height: "50px", padding: "0 28px" }}
            >
              Explore Projects
            </Button>
            <Button
              ghost
              size="large"
              href="/contact"
              style={{ height: "50px", padding: "0 28px", color: "#ffffff", borderColor: "#ffffff" }}
            >
              Book Consultation
            </Button>
          </Space>
        </div>
      </section>

      {/* Philosophy Section */}
      <section style={{ padding: "100px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        <Row gutter={[48, 32]} align="middle">
          <Col xs={24} lg={12}>
            <span
              style={{
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                fontSize: "13px",
                color: "var(--primary-color)",
                fontWeight: 600,
                display: "block",
                marginBottom: "8px",
              }}
            >
              Our Philosophy
            </span>
            <Title level={2} className="font-serif" style={{ fontSize: "36px", marginBottom: "24px" }}>
              Bespoke Spaces Designed For Inspired Living
            </Title>
            <Paragraph style={{ color: "var(--text-secondary)", fontSize: "16px", lineHeight: "1.8" }}>
              At Mieux Interiors & Architects, we believe that design should be a direct reflection of its context, material, and user. We balance raw organic textures with premium materials like oak wood and custom bronze to create environments that are both functional and inspiring.
            </Paragraph>
            <Paragraph style={{ color: "var(--text-secondary)", fontSize: "16px", lineHeight: "1.8", marginBottom: "32px" }}>
              Whether designing a private residence in Kallachi or a workspace in Nadapuram, our dedicated team handles every step from conceptualization to execution with absolute precision.
            </Paragraph>
            <Button
              type="primary"
              href="/about"
              onClick={(e) => handleProtectedLinkClick(e, "/about")}
              icon={<ArrowRightOutlined />}
            >
              More About Us
            </Button>
          </Col>
          <Col xs={24} lg={12}>
            <div
              style={{
                position: "relative",
                height: "450px",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
                backgroundImage: `url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </Col>
        </Row>
      </section>

      {/* Services Section */}
      <section style={{ backgroundColor: "#f6f3ed", padding: "100px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <span
              style={{
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                fontSize: "13px",
                color: "var(--primary-color)",
                fontWeight: 600,
                display: "block",
                marginBottom: "8px",
              }}
            >
              What We Do
            </span>
            <Title level={2} className="font-serif" style={{ fontSize: "36px" }}>
              Our Design Offerings
            </Title>
          </div>

          <Row gutter={[24, 24]}>
            {services.map((service) => (
              <Col xs={24} sm={12} md={services.length === 1 ? 24 : services.length === 2 ? 12 : 8} key={service._id}>
                <Card
                  className="premium-card"
                  cover={<MediaCardSlider media={service.media} coverImage={service.coverImage} height="240px" />}
                  variant="borderless"
                >
                  <Title level={3} className="font-serif" style={{ fontSize: "22px", marginBottom: "12px" }}>
                    {service.title}
                  </Title>
                  <Paragraph style={{ color: "var(--text-secondary)", minHeight: "72px" }}>
                    {service.description}
                  </Paragraph>
                  <Link
                    href={service.linkUrl || "/services"}
                    onClick={(e) => handleProtectedLinkClick(e, service.linkUrl || "/services")}
                    style={{ color: "var(--primary-color)", fontWeight: 600 }}
                  >
                    Read More <RightOutlined style={{ fontSize: "12px" }} />
                  </Link>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Featured Projects Grid */}
      <section style={{ padding: "100px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "60px" }}>
          <div>
            <span
              style={{
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                fontSize: "13px",
                color: "var(--primary-color)",
                fontWeight: 600,
                display: "block",
                marginBottom: "8px",
              }}
            >
              Portfolio
            </span>
            <Title level={2} className="font-serif" style={{ fontSize: "36px", margin: 0 }}>
              Featured Works
            </Title>
          </div>
          <Button
            type="link"
            href="/projects"
            onClick={(e) => handleProtectedLinkClick(e, "/projects")}
            style={{ color: "var(--primary-color)", fontSize: "16px", fontWeight: 600 }}
          >
            All Projects <ArrowRightOutlined />
          </Button>
        </div>

        <Row gutter={[24, 24]}>
          {featuredProjects.map((project) => (
            <Col xs={24} md={8} key={project._id}>
              <Link
                href={`/projects/${project.slug}`}
                onClick={(e) => handleProtectedLinkClick(e, `/projects/${project.slug}`)}
              >
                <Card
                  hoverable
                  className="premium-card"
                  cover={
                    <MediaCardSlider
                      media={project.media}
                      coverImage={project.coverImage}
                      height="260px"
                    />
                  }
                  styles={{ body: { padding: "20px" } }}
                >
                  <span style={{ color: "var(--primary-color)", fontSize: "12px", textTransform: "uppercase", fontWeight: 600 }}>
                    {project.category}
                  </span>
                  <Title level={3} className="font-serif" style={{ fontSize: "20px", margin: "8px 0" }}>
                    {project.title}
                  </Title>
                  <Text type="secondary" style={{ display: "block", marginBottom: "12px" }}>
                    {project.location}
                  </Text>
                  <Paragraph type="secondary" style={{ fontSize: "14px", margin: 0 }}>
                    {project.shortDescription}
                  </Paragraph>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </section>

      {/* Testimonials */}
      <section style={{ backgroundColor: "#2b2621", color: "#ffffff", padding: "100px 40px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", textAlign: "center" }}>
          <span
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              fontSize: "13px",
              color: "var(--primary-color)",
              fontWeight: 600,
              display: "block",
              marginBottom: "16px",
            }}
          >
            Client Reviews
          </span>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", marginBottom: "50px" }}>
            <Title level={2} className="font-serif" style={{ color: "#ffffff", fontSize: "36px", margin: 0 }}>
              What Our Clients Say
            </Title>
            {(isLoggedIn || isAdmin) && (
              <Button
                type="primary"
                href="/feedback"
                size="small"
                style={{
                  borderRadius: "4px",
                  height: "32px",
                  fontSize: "13px",
                  fontWeight: 500,
                  backgroundColor: "var(--primary-color)",
                  borderColor: "var(--primary-color)",
                }}
              >
                Write a Review
              </Button>
            )}
          </div>

          <div style={{ position: "relative", width: "100%", display: "flex", alignItems: "center" }}>
            {/* Left Control Arrow */}
            {testimonials.length > visibleCount && (
              <Button
                type="text"
                shape="circle"
                icon={<LeftOutlined style={{ color: "#ffffff", fontSize: "16px" }} />}
                onClick={handlePrev}
                style={{
                  position: "absolute",
                  left: "-55px",
                  zIndex: 10,
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  width: "40px",
                  height: "40px",
                }}
                className="carousel-arrow-btn carousel-arrow-btn-left"
              />
            )}

            <div style={{ position: "relative", overflow: "hidden", width: "100%", padding: "10px 0" }}>
              <div
                style={{
                  display: "flex",
                  gap: "24px",
                  transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: `translateX(calc(-${activeIndex} * (100% + 24px) / ${visibleCount}))`,
                }}
              >
                {testimonials.map((t, i) => {
                  const isInViewport = i >= activeIndex && i < activeIndex + visibleCount;
                  return (
                    <div
                      key={t._id}
                      style={{
                        flexShrink: 0,
                        width: `calc((100% - ${(visibleCount - 1) * 24}px) / ${visibleCount})`,
                        opacity: isInViewport ? 1 : 0.2,
                        transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    >
                      <Card
                        style={{
                          background: "rgba(255, 255, 255, 0.03)",
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                          borderRadius: "16px",
                          textAlign: "left",
                          height: "100%",
                          transition: "all 0.4s ease",
                        }}
                        styles={{ body: { padding: "32px" } }}
                        className="testimonial-carousel-card"
                      >
                        <Rate
                          disabled
                          defaultValue={t.rating}
                          key={t._id}
                          style={{ color: "var(--primary-color)", marginBottom: "16px" }}
                        />
                        <Paragraph
                          style={{
                            color: "#eae4db",
                            fontSize: "15px",
                            fontStyle: "italic",
                            lineHeight: "1.7",
                            minHeight: "80px",
                          }}
                        >
                          &ldquo;{t.quote}&rdquo;
                        </Paragraph>
                        <div style={{ marginTop: "20px" }}>
                          <Title level={4} style={{ color: "#ffffff", margin: 0, fontSize: "17px" }}>
                            {t.name}
                          </Title>
                          <Text style={{ color: "#d8cfc0", fontSize: "13px" }}>{t.place}</Text>
                        </div>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Control Arrow */}
            {testimonials.length > visibleCount && (
              <Button
                type="text"
                shape="circle"
                icon={<RightOutlined style={{ color: "#ffffff", fontSize: "16px" }} />}
                onClick={handleNext}
                style={{
                  position: "absolute",
                  right: "-55px",
                  zIndex: 10,
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  width: "40px",
                  height: "40px",
                }}
                className="carousel-arrow-btn carousel-arrow-btn-right"
              />
            )}
          </div>
          <style jsx>{`
            .testimonial-carousel-card:hover {
              background: rgba(138, 106, 74, 0.08) !important;
              border-color: rgba(138, 106, 74, 0.5) !important;
              transform: translateY(-4px) scale(1.01);
              box-shadow: 0 8px 32px rgba(138, 106, 74, 0.15) !important;
            }
            .carousel-arrow-btn {
              transition: all 0.3s ease !important;
              backdrop-filter: blur(4px);
            }
            .carousel-arrow-btn:hover {
              background: var(--primary-color) !important;
              border-color: var(--primary-color) !important;
            }
            @media (max-width: 1220px) {
              .carousel-arrow-btn-left {
                left: 10px !important;
              }
              .carousel-arrow-btn-right {
                right: 10px !important;
              }
            }
          `}</style>
        </div>
      </section>

      {/* CTA section */}
      <section style={{ padding: "100px 40px", textAlign: "center", backgroundColor: "var(--bg-warm)" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <Title level={2} className="font-serif" style={{ fontSize: "36px", marginBottom: "16px" }}>
            Ready to design your dream space?
          </Title>
          <Paragraph type="secondary" style={{ fontSize: "16px", marginBottom: "32px", lineHeight: "1.6" }}>
            Book a complimentary design consultation at our Nadapuram studio or Kallachi showroom. Our architects will outline layout possibilities and material scopes.
          </Paragraph>
          <Button type="primary" size="large" href="/contact" style={{ height: "48px", padding: "0 32px" }}>
            Get Free Consultation
          </Button>
        </div>
      </section>
    </div>
  );
}

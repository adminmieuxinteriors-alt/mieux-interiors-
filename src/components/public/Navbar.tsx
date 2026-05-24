"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button, Drawer, Space, App as AntApp } from "antd";
import { MenuOutlined, LogoutOutlined } from "@ant-design/icons";
import Logo from "./Logo";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { message } = AntApp.useApp();

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Projects", href: "/projects" },
    ...(user ? [{ label: "Reviews", href: "/feedback" }] : []),
    { label: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    setIsAdmin(document.cookie.includes("mieux_admin_logged_in=true"));
    const fetchUserSession = async () => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);
        const res = await fetch("/api/users/me", { signal: controller.signal });
        clearTimeout(timeout);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setUser(data.user);
          }
        }
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          console.error("Error checking user session:", err);
        }
      }
    };
    fetchUserSession();
  }, []);

  const handleUserLogout = async () => {
    try {
      const res = await fetch("/api/users/logout", {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setUser(null);
        message.success("Signed out successfully.");
        // Redirect to homepage
        router.push("/");
        setTimeout(() => {
          window.location.href = "/";
        }, 500);
      } else {
        message.error("Failed to sign out.");
      }
    } catch (err) {
      console.error("Sign out error:", err);
      message.error("Error signing out.");
    }
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: "#ffffff",
        borderBottom: "1px solid var(--border-color)",
        padding: "16px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link href="/" style={{ display: "flex" }}>
          <Logo fontSize="24px" subtitleSize="8px" />
        </Link>
      </div>

      {/* Desktop Menu */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
        }}
        className="desktop-nav"
      >
        <Space size={32} style={{ marginRight: "32px" }}>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => {
                const requiresLogin = ["/about", "/services", "/projects", "/feedback"].includes(item.href);
                const isLoggedIn = document.cookie.includes("mieux_user_logged_in=true") || document.cookie.includes("mieux_admin_logged_in=true");
                if (requiresLogin && !isLoggedIn) {
                  e.preventDefault();
                  message.warning("Please sign in or register to view this page.");
                  router.push(`/login?redirect=${encodeURIComponent(item.href)}`);
                }
              }}
              style={{
                fontSize: "15px",
                fontWeight: 500,
                color: isActive(item.href)
                  ? "var(--primary-color)"
                  : "var(--text-secondary)",
                borderBottom: isActive(item.href)
                  ? "2px solid var(--primary-color)"
                  : "2px solid transparent",
                paddingBottom: "4px",
              }}
            >
              {item.label}
            </Link>
          ))}
        </Space>
        
        <Space size={16}>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginRight: "8px" }}>
              <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                Hi, <strong style={{ color: "var(--primary-color)" }}>{user.name}</strong>
              </span>
              <Button
                type="text"
                size="small"
                icon={<LogoutOutlined />}
                onClick={handleUserLogout}
                style={{ color: "var(--text-secondary)" }}
              >
                Sign Out
              </Button>
            </div>
          ) : isAdmin ? (
            <Button
              type="default"
              className="admin-panel-btn"
              href="/admin/dashboard"
              style={{
                marginRight: 0,
                borderColor: "var(--primary-color)",
                color: "var(--primary-color)",
                fontWeight: 500,
              }}
            >
              View Admin Panel
            </Button>
          ) : (
            <Button
              type="default"
              className="admin-login-btn"
              href="/login"
              style={{ marginRight: 0 }}
            >
              Signup/Login
            </Button>
          )}
        </Space>
      </nav>

      {/* Mobile Menu Icon */}
      <Button
        className="mobile-nav-toggle"
        type="text"
        icon={<MenuOutlined style={{ fontSize: "20px", color: "var(--primary-color)" }} />}
        onClick={toggleDrawer}
        style={{ display: "none" }}
      />

      {/* Mobile Navigation Drawer */}
      <Drawer
        title={
          <Link href="/" style={{ display: "flex" }} onClick={toggleDrawer}>
            <Logo fontSize="20px" subtitleSize="7px" />
          </Link>
        }
        placement="right"
        onClose={toggleDrawer}
        open={open}
        width={280}
        styles={{
          header: {
            borderBottom: "1px solid var(--border-color)",
          },
        }}
      >
        <Space direction="vertical" size={24} style={{ width: "100%", marginTop: "16px" }}>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => {
                toggleDrawer();
                const requiresLogin = ["/about", "/services", "/projects", "/feedback"].includes(item.href);
                const isLoggedIn = document.cookie.includes("mieux_user_logged_in=true") || document.cookie.includes("mieux_admin_logged_in=true");
                if (requiresLogin && !isLoggedIn) {
                  e.preventDefault();
                  message.warning("Please sign in or register to view this page.");
                  router.push(`/login?redirect=${encodeURIComponent(item.href)}`);
                }
              }}
              style={{
                display: "block",
                fontSize: "18px",
                fontWeight: 500,
                color: isActive(item.href)
                  ? "var(--primary-color)"
                  : "var(--text-main)",
                padding: "8px 0",
                borderBottom: "1px solid #f0ede8",
              }}
            >
              {item.label}
            </Link>
          ))}
          
          {user ? (
            <div style={{ padding: "8px 0", borderBottom: "1px solid #f0ede8" }}>
              <div style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "8px" }}>
                Logged in as <strong style={{ color: "var(--primary-color)" }}>{user.name}</strong>
              </div>
              <Button
                type="link"
                danger
                onClick={() => {
                  toggleDrawer();
                  handleUserLogout();
                }}
                style={{ padding: 0, textAlign: "left" }}
                block
              >
                Sign Out
              </Button>
            </div>
          ) : isAdmin ? (
            <Button
              type="default"
              href="/admin/dashboard"
              onClick={toggleDrawer}
              block
              style={{
                height: "45px",
                borderColor: "var(--primary-color)",
                color: "var(--primary-color)",
                fontWeight: 500,
              }}
            >
              View Admin Panel
            </Button>
          ) : (
            <Button
              type="default"
              href="/login"
              onClick={toggleDrawer}
              block
              style={{
                height: "45px",
                borderColor: "var(--primary-color)",
                color: "var(--primary-color)",
              }}
            >
              Signup/Login
            </Button>
          )}
        </Space>
      </Drawer>

      <style jsx global>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-nav-toggle {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
}

"use client";

import { Spin } from "antd";

export default function AdminLoading() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <Spin size="large" />
        <p style={{ marginTop: "16px", color: "var(--text-secondary)", fontSize: "14px" }}>
          Loading...
        </p>
      </div>
    </div>
  );
}

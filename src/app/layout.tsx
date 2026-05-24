import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { ConfigProvider, App as AntApp } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import AntdClientProvider from "@/components/AntdClientProvider";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mieux Interiors & Architects | Architectural Designer | Nadapuram | Kallachi",
  description: "Mieux Interiors & Architects: Trusted design studio in Nadapuram & Kallachi. 🏡 Homes | 🏢 Offices | 🛋 Interiors. Quality. Creativity. Perfection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AntdRegistry>
          <AntdClientProvider>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#8a6a4a", // Bronze accent
                  colorInfo: "#8a6a4a",
                  borderRadius: 8,
                  fontFamily: "var(--font-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                },
              }}
            >
              <AntApp style={{ minHeight: "100vh" }}>
                {children}
              </AntApp>
            </ConfigProvider>
          </AntdClientProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}

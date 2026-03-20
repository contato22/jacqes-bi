import type { Metadata } from "next";
import "./globals.css";
import AuthGuard from "@/components/AuthGuard";

export const metadata: Metadata = {
  title: "JACQES BI — Business Intelligence Dashboard",
  description:
    "Business Intelligence dashboard for JACQES, a portfolio company of AWQ Group.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import "../styles/layout.css";

export const metadata: Metadata = {
  title: "Techfix-IT ERP",
  description: "Logistics and Service ERP for Eire-ERP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

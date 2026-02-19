import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vanguard Blindside | Tactical Warfare",
  description: "1v1 Tactical Zero-Knowledge Warfare - A pixel art tank combat game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-black">
        {children}
      </body>
    </html>
  );
}

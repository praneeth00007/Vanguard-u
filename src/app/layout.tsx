import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vanguard Blindside | Tactical Warfare",
  description: "1v1 Tactical Zero-Knowledge Warfare - A pixel art tank combat game featuring intense 16-bit style battles",
  keywords: ["game", "tactical", "warfare", "pixel art", "tank", "combat", "multiplayer"],
  authors: [{ name: "Vanguard-u" }],
  openGraph: {
    title: "Vanguard Blindside",
    description: "1v1 Tactical Zero-Knowledge Warfare",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased bg-black min-h-screen">
        {children}
      </body>
    </html>
  );
}

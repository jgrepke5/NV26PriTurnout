import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "2026 Nevada Primary Turnout",
  description:
    "Live reporting on Nevada’s 2026 primary election turnout — statewide, by county, and in competitive legislative and congressional districts.",
  openGraph: {
    title: "2026 Nevada Primary Turnout",
    description:
      "Turnout figures updated daily at noon Pacific from official tracking data.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="site">{children}</div>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { loaderBootScript } from "./components/Loader";
import "./globals.css";

const display = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-display",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Adithya R K Nambiar — AI Engineer",
  description:
    "The portfolio of Adithya R K Nambiar, an AI engineer and research intern building grounded, useful intelligent systems.",
  metadataBase: new URL("https://adithya-r-k-nambiar.vercel.app"),
  openGraph: {
    title: "Adithya R K Nambiar — AI Engineer",
    description:
      "AI engineering, retrieval systems, data infrastructure, and research by Adithya R K Nambiar.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: loaderBootScript }} />
        <noscript><style>{".loader{display:none}"}</style></noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Discord Architect — AI Server Builder",
  description: "Costruisci il tuo server Discord perfetto in pochi secondi con l'intelligenza artificiale.",
  openGraph: {
    title: "Discord Architect",
    description: "AI-powered Discord server builder",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className="h-full">
      <body className="min-h-full flex flex-col noise">{children}</body>
    </html>
  );
}

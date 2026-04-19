import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Discord Architect — AI Server Builder",
  description: "Costruisci il tuo server Discord perfetto in pochi secondi con l'intelligenza artificiale. Canali, categorie e permessi generati dall'AI.",
  metadataBase: new URL("https://discord-architect.vercel.app"),
  openGraph: {
    title: "Discord Architect — AI Server Builder",
    description: "Descrivi la tua community e l'AI genera canali, categorie e permessi in secondi.",
    type: "website",
    url: "https://discord-architect.vercel.app",
    siteName: "Discord Architect",
  },
  twitter: {
    card: "summary_large_image",
    title: "Discord Architect — AI Server Builder",
    description: "Descrivi la tua community e l'AI genera canali, categorie e permessi in secondi.",
  },
  keywords: ["discord bot", "discord server builder", "AI discord", "discord architect", "bot discord italiano"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className="h-full">
      <body className="min-h-full flex flex-col noise">{children}</body>
    </html>
  );
}

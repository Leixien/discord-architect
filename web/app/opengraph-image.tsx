import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Discord Architect — AI Server Builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0C0D10",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          fontFamily: "monospace",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(0,217,163,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,217,163,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            right: -100,
            top: -100,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,217,163,0.07) 0%, transparent 70%)",
          }}
        />

        {/* Top: logo + status */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "8px",
                background: "rgba(0,217,163,0.1)",
                border: "1px solid rgba(0,217,163,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              ⬡
            </div>
            <span style={{ color: "#C9D1D9", fontSize: 22, fontWeight: 700, letterSpacing: "0.02em" }}>
              discord-architect
            </span>
            <span style={{ color: "#484F58", fontSize: 16 }}>v2.0</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#484F58", fontSize: 15 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00D9A3" }} />
            BOT ONLINE
          </div>
        </div>

        {/* Center: headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ color: "#484F58", fontSize: 18, fontWeight: 300, letterSpacing: "0.04em" }}>
            [01] // overview
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ color: "#C9D1D9", fontSize: 64, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05 }}>
              Server Discord
            </div>
            <div style={{ color: "#00D9A3", fontSize: 64, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05 }}>
              con l&apos;AI.
            </div>
          </div>
          <div style={{ color: "#8B949E", fontSize: 22, fontWeight: 300, maxWidth: 600, lineHeight: 1.6, marginTop: "8px" }}>
            Descrivi la tua community e l&apos;AI genera canali, categorie e permessi in secondi.
          </div>
        </div>

        {/* Bottom: stats */}
        <div style={{ display: "flex", gap: "48px", alignItems: "center" }}>
          {[
            { v: "500+", l: "server_attivi" },
            { v: "10.000+", l: "canali_creati" },
            { v: "99%", l: "uptime" },
            { v: "8", l: "slash_commands" },
          ].map((s) => (
            <div key={s.l} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ color: "#00D9A3", fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em" }}>{s.v}</div>
              <div style={{ color: "#484F58", fontSize: 14 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}

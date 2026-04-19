"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedCounter from "@/components/AnimatedCounter";

const INVITE_URL =
  "https://discord.com/oauth2/authorize?client_id=1495175766676213850&permissions=8&scope=bot+applications.commands";

const features = [
  { prefix: "01", title: "AI Server Builder", large: true, description: "Descrivi in linguaggio naturale la tua community — gaming, studio, community, anime o business. L'AI genera categorie, canali, permessi e struttura ottimale in pochi secondi, pronta per essere applicata al tuo server Discord." },
  { prefix: "02", title: "Sistema Ticket", large: false, description: "Canali privati per ogni richiesta, storico su database, priorità configurabile." },
  { prefix: "03", title: "Template Pronti", large: false, description: "Gaming, studio, anime e altro. Template curati pronti all'uso con un comando." },
  { prefix: "04", title: "Auto-Moderazione", large: false, description: "Filtra spam e link vietati. Sistema warn automatico con timeout progressivo." },
  { prefix: "05", title: "XP & Rank", large: false, description: "Premia i membri attivi con rank card personalizzate e ruoli automatici per livello." },
  { prefix: "06", title: "Giveaway", large: false, description: "Organizza giveaway con timer, più vincitori e gestione automatica degli ingressi." },
];

const commands = [
  { name: "/build", desc: "Genera struttura server da descrizione AI", badge: "AI" },
  { name: "/setup", desc: "Applica template predefinito al server", badge: "QUICK" },
  { name: "/ticket open", desc: "Apri un ticket di supporto privato", badge: null },
  { name: "/ticket setup", desc: "Configura il ruolo staff", badge: null },
  { name: "/automod", desc: "Moderazione automatica configurabile", badge: "MOD" },
  { name: "/rank", desc: "Visualizza rank e livello XP", badge: null },
  { name: "/stats", desc: "Statistiche server in tempo reale", badge: null },
  { name: "/giveaway", desc: "Avvia giveaway con premi e timer", badge: null },
];

const stats = [
  { value: 500, suffix: "+", label: "server_attivi" },
  { value: 10000, suffix: "+", label: "canali_creati" },
  { value: 99, suffix: "%", label: "uptime" },
  { value: 8, suffix: "", label: "slash_commands" },
];

const steps = [
  { n: "01", cmd: "$ descrivi", title: "Descrivi il server", body: "Scrivi in linguaggio naturale cosa vuoi. Tipo di community, canali, ruoli, tono — tutto in forma libera." },
  { n: "02", cmd: "$ genera", title: "L'AI elabora", body: "Il modello analizza la richiesta e costruisce una struttura ottimale con categorie, canali e permessi." },
  { n: "03", cmd: "$ applica", title: "Applicato in secondi", body: "La struttura viene creata direttamente sul tuo server Discord. Zero configurazione manuale." },
];

const terminalLines = [
  { prompt: true, text: "discord-architect /build --describe" },
  { prompt: false, text: '> "server gaming con FPS, RPG e community"', color: "var(--text2)" },
  { prompt: false, text: "✓  struttura analizzata", color: "var(--accent)" },
  { prompt: false, text: "✓  categoria GAMING creata", color: "var(--accent)" },
  { prompt: false, text: "✓  5 canali aggiunti", color: "var(--accent)" },
  { prompt: false, text: "✓  applicata al server", color: "var(--accent)" },
];

const ease = [0.22, 1, 0.36, 1] as const;

const navLinks = [
  { label: "features", href: "#feature", id: "feature" },
  { label: "how it works", href: "#howto", id: "howto" },
  { label: "commands", href: "#comandi", id: "comandi" },
];

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); });
      },
      { threshold: 0.35 }
    );
    navLinks.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* ── Navbar ── */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease }}
        style={{
          position: "fixed", top: 0, width: "100%", zIndex: 50,
          background: "rgba(12,13,16,0.94)",
          borderBottom: "1px solid var(--border2)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 48px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "6px", background: "rgba(0,217,163,0.1)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "var(--accent)", fontSize: "0.75rem" }}>⬡</span>
            </div>
            <span style={{ color: "var(--text)", fontWeight: 700, fontSize: "0.88rem", letterSpacing: "0.02em" }}>discord-architect</span>
            <span style={{ color: "var(--text3)", fontSize: "0.68rem" }}>v2.0</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {navLinks.map((item) => {
              const active = activeSection === item.id;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  style={{
                    color: active ? "var(--accent)" : "var(--text3)",
                    fontSize: "0.78rem",
                    textDecoration: "none",
                    padding: "5px 12px",
                    borderRadius: "var(--radius-sm)",
                    background: active ? "rgba(0,217,163,0.08)" : "transparent",
                    border: active ? "1px solid var(--border)" : "1px solid transparent",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = "var(--text)"; }}
                  onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = "var(--text3)"; }}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          <motion.a
            href={INVITE_URL} target="_blank" rel="noopener noreferrer"
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0,217,163,0.35)" }}
            whileTap={{ scale: 0.97 }}
            style={{ background: "var(--accent)", color: "#0C0D10", fontWeight: 700, fontSize: "0.72rem", padding: "7px 18px", borderRadius: "var(--radius-sm)", letterSpacing: "0.06em", textDecoration: "none" }}
          >
            AGGIUNGI →
          </motion.a>
        </div>
      </motion.nav>

      {/* ── Hero [01] ── */}
      <section ref={heroRef} style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden", paddingTop: "80px" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(0,217,163,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,217,163,0.02) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 60% 80% at 70% 40%, rgba(0,217,163,0.05) 0%, transparent 70%)" }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity, position: "relative", zIndex: 10, width: "100%", maxWidth: "1140px", margin: "0 auto", padding: "80px 48px" }}>
          <div className="hero-grid">
            {/* Left col */}
            <div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "32px" }}>
                <span style={{ color: "var(--accent)", fontSize: "0.8rem" }}>❯</span>
                <span style={{ color: "var(--text3)", fontSize: "0.75rem" }}>discord-architect@v2.0 ~/$</span>
                <span className="cursor-blink" />
              </motion.div>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} style={{ color: "var(--text3)", fontSize: "0.68rem", letterSpacing: "0.08em", marginBottom: "20px", fontWeight: 300 }}>
                [01] // overview
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.7, ease }}
                style={{ fontSize: "clamp(2.6rem, 6vw, 5.5rem)", fontWeight: 800, lineHeight: 1.06, letterSpacing: "-0.04em", marginBottom: "24px" }}
              >
                <span style={{ color: "var(--text2)", display: "block", fontWeight: 300, fontSize: "0.42em", letterSpacing: "0em", marginBottom: "10px" }}>
                  // costruisci il tuo
                </span>
                <span style={{ color: "var(--text)" }}>Server Discord</span>
                <br />
                <span style={{ color: "var(--accent)", textShadow: "0 0 40px rgba(0,217,163,0.35)" }}>con l&apos;AI</span>
                <span className="cursor-blink" style={{ marginLeft: "6px" }} />
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.9, maxWidth: "420px", marginBottom: "40px", fontWeight: 300 }}
              >
                Descrivi la tua community in linguaggio naturale.<br />
                Canali, categorie e permessi generati in secondi.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "56px" }}
              >
                <motion.a
                  href={INVITE_URL} target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.02, boxShadow: "0 0 32px rgba(0,217,163,0.35)" }}
                  whileTap={{ scale: 0.97 }}
                  style={{ background: "var(--accent)", color: "#0C0D10", fontWeight: 700, fontSize: "0.78rem", padding: "12px 28px", borderRadius: "var(--radius-sm)", letterSpacing: "0.08em", textDecoration: "none" }}
                >
                  AGGIUNGI GRATIS →
                </motion.a>
                <motion.a
                  href="#howto"
                  whileHover={{ borderColor: "rgba(0,217,163,0.35)", color: "var(--text)" }}
                  style={{ border: "1px solid var(--border2)", color: "var(--text2)", fontWeight: 400, fontSize: "0.78rem", padding: "12px 28px", borderRadius: "var(--radius-sm)", letterSpacing: "0.06em", textDecoration: "none", transition: "all 0.2s" }}
                >
                  come funziona
                </motion.a>
              </motion.div>

              {/* Stats mini bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                style={{ display: "flex", gap: "32px", alignItems: "center" }}
              >
                {stats.slice(0, 3).map((s) => (
                  <div key={s.label}>
                    <div style={{ color: "var(--accent)", fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.03em" }}>
                      {s.value.toLocaleString()}{s.suffix}
                    </div>
                    <div style={{ color: "var(--text3)", fontSize: "0.65rem", letterSpacing: "0.04em", marginTop: "2px" }}>{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right col — Terminal */}
            <div className="hero-terminal-col">
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease }}
                className="animate-float"
                style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: "var(--radius)", boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,217,163,0.04)", overflow: "hidden" }}
              >
                <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border2)", background: "var(--surface2)", display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--red)", opacity: 0.7 }} />
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#F0A500", opacity: 0.5 }} />
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--accent)", opacity: 0.5 }} />
                  <span style={{ color: "var(--text3)", fontSize: "0.7rem", marginLeft: "8px" }}>bash — discord-architect</span>
                </div>
                <div style={{ padding: "24px 24px 28px" }}>
                  {terminalLines.map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 + i * 0.18 }}
                      style={{ display: "flex", gap: "12px", marginBottom: "8px", fontSize: "0.8rem", lineHeight: 1.6 }}
                    >
                      <span style={{ color: line.prompt ? "var(--accent)" : "transparent", flexShrink: 0 }}>❯</span>
                      <span style={{ color: line.prompt ? "var(--text)" : line.color }}>{line.text}</span>
                    </motion.div>
                  ))}
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1 }} style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "8px" }}>
                    <span style={{ color: "var(--accent)", fontSize: "0.8rem" }}>❯</span>
                    <span className="cursor-blink" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── How it works [02] ── */}
      <section id="howto" style={{ borderTop: "1px solid var(--border2)", padding: "120px 48px" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
          <ScrollReveal>
            <p style={{ color: "var(--text3)", fontSize: "0.68rem", letterSpacing: "0.08em", fontWeight: 300, marginBottom: "20px" }}>[02] // how_it_works</p>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text)", marginBottom: "72px" }}>
              Tre passi per il<br />
              <span style={{ color: "var(--accent)" }}>server perfetto.</span>
            </h2>
          </ScrollReveal>

          {/* Pipeline connector */}
          <ScrollReveal>
            <div style={{ display: "flex", alignItems: "center", gap: "0", marginBottom: "32px", padding: "0 4px" }}>
              {steps.map((s, i) => (
                <div key={s.n} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 10px rgba(0,217,163,0.5)" }} />
                    <span style={{ color: "var(--accent)", fontSize: "0.75rem", fontWeight: 500 }}>{s.cmd}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, var(--accent), rgba(0,217,163,0.2))", margin: "0 16px", opacity: 0.4 }} />
                  )}
                </div>
              ))}
            </div>
          </ScrollReveal>

          <div className="steps-grid" style={{ gap: "12px" }}>
            {steps.map((s, i) => (
              <ScrollReveal key={s.n} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4, borderColor: "rgba(0,217,163,0.25)" }}
                  style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: "var(--radius)", padding: "36px 32px", transition: "border-color 0.25s" }}
                >
                  <div style={{ color: "var(--text3)", fontSize: "0.68rem", letterSpacing: "0.08em", marginBottom: "20px" }}>{s.n} /</div>
                  <h3 style={{ color: "var(--text)", fontSize: "1rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "14px" }}>{s.title}</h3>
                  <p style={{ color: "var(--text2)", fontSize: "0.83rem", lineHeight: 1.8, fontWeight: 300 }}>{s.body}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Metrics [03] ── */}
      <section id="stats" style={{ borderTop: "1px solid var(--border2)" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "80px 48px" }}>
          <p style={{ color: "var(--text3)", fontSize: "0.68rem", letterSpacing: "0.08em", fontWeight: 300, marginBottom: "56px" }}>[03] // metrics</p>
          <div className="stats-grid">
            {stats.map((s, i) => (
              <ScrollReveal key={s.label} delay={i * 0.08}>
                <div style={{ padding: "32px 0", borderRight: i < stats.length - 1 ? "1px solid var(--border2)" : "none", paddingRight: i < stats.length - 1 ? "48px" : "0", paddingLeft: i > 0 ? "48px" : "0" }}>
                  <div style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)", fontWeight: 800, color: "var(--accent)", lineHeight: 1, letterSpacing: "-0.04em", marginBottom: "12px", textShadow: "0 0 30px rgba(0,217,163,0.2)" }}>
                    <AnimatedCounter end={s.value} suffix={s.suffix} />
                  </div>
                  <div style={{ color: "var(--text3)", fontSize: "0.72rem", letterSpacing: "0.04em" }}>{s.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features [04] ── */}
      <section id="feature" style={{ borderTop: "1px solid var(--border2)", padding: "120px 48px" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
          <ScrollReveal>
            <p style={{ color: "var(--text3)", fontSize: "0.68rem", letterSpacing: "0.08em", fontWeight: 300, marginBottom: "20px" }}>[04] // features</p>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text)", marginBottom: "56px" }}>
              Tutto quello che<br />
              <span style={{ color: "var(--accent)" }}>ti serve.</span>
            </h2>
          </ScrollReveal>

          <div className="features-grid">
            {features.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 0.06}>
                <motion.div
                  whileHover={{ y: -3, borderColor: "rgba(0,217,163,0.22)" }}
                  className={f.large ? "feature-span2" : ""}
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border2)",
                    borderRadius: "var(--radius)",
                    padding: f.large ? "44px 40px" : "36px 32px",
                    cursor: "default",
                    transition: "border-color 0.25s, transform 0.25s",
                    height: "100%",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {f.large && (
                    <div style={{ position: "absolute", top: 0, right: 0, width: "200px", height: "200px", pointerEvents: "none", background: "radial-gradient(ellipse at top right, rgba(0,217,163,0.05) 0%, transparent 70%)" }} />
                  )}
                  <div style={{ color: "var(--text3)", fontSize: "0.68rem", letterSpacing: "0.08em", marginBottom: "20px" }}>{f.prefix} /</div>
                  <h3 style={{ color: "var(--text)", fontSize: f.large ? "1.2rem" : "0.95rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "14px" }}>{f.title}</h3>
                  <p style={{ color: "var(--text2)", fontSize: "0.83rem", lineHeight: 1.85, fontWeight: 300 }}>{f.description}</p>
                  {f.large && (
                    <div style={{ marginTop: "28px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {["gaming", "studio", "anime", "community", "business"].map((tag) => (
                        <span key={tag} style={{ fontSize: "0.65rem", padding: "3px 10px", border: "1px solid var(--border)", color: "var(--text3)", borderRadius: "var(--radius-sm)", letterSpacing: "0.05em" }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Commands [05] ── */}
      <section id="comandi" style={{ borderTop: "1px solid var(--border2)", padding: "120px 48px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <ScrollReveal>
            <p style={{ color: "var(--text3)", fontSize: "0.68rem", letterSpacing: "0.08em", fontWeight: 300, marginBottom: "20px" }}>[05] // commands</p>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text)", marginBottom: "56px" }}>
              Slash commands<br />
              <span style={{ color: "var(--accent)" }}>disponibili.</span>
            </h2>
          </ScrollReveal>

          <div style={{ border: "1px solid var(--border2)", borderRadius: "var(--radius)", overflow: "hidden" }}>
            <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border2)", background: "var(--surface2)", display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "9px", height: "9px", borderRadius: "50%", background: "var(--red)", opacity: 0.65 }} />
              <div style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#F0A500", opacity: 0.5 }} />
              <div style={{ width: "9px", height: "9px", borderRadius: "50%", background: "var(--accent)", opacity: 0.5 }} />
              <span style={{ color: "var(--text3)", fontSize: "0.68rem", marginLeft: "8px" }}>discord-architect — /help</span>
            </div>
            {commands.map((c, i) => (
              <ScrollReveal key={c.name} delay={i * 0.04}>
                <motion.div
                  whileHover={{ x: 4, background: "var(--surface2)" }}
                  style={{ display: "flex", alignItems: "center", gap: "20px", padding: "15px 20px", borderBottom: i < commands.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none", background: "var(--surface)", transition: "background 0.15s" }}
                >
                  <span style={{ color: "var(--text3)", fontSize: "0.72rem", flexShrink: 0 }}>❯</span>
                  <code style={{ color: "var(--accent)", fontSize: "0.82rem", fontWeight: 500, minWidth: "160px", flexShrink: 0, fontFamily: "inherit" }}>
                    {c.name}
                  </code>
                  {c.badge && (
                    <span style={{ fontSize: "0.6rem", padding: "2px 7px", border: "1px solid var(--border)", color: "var(--accent)", borderRadius: "4px", letterSpacing: "0.1em", flexShrink: 0, background: "rgba(0,217,163,0.04)" }}>
                      {c.badge}
                    </span>
                  )}
                  <span style={{ color: "var(--text3)", fontSize: "0.8rem", fontWeight: 300 }}>{c.desc}</span>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA [06] ── */}
      <section style={{ borderTop: "1px solid var(--border2)", padding: "160px 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 55% 70% at 50% 100%, rgba(0,217,163,0.055) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(0,217,163,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(0,217,163,0.018) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

        <div style={{ maxWidth: "1140px", margin: "0 auto", position: "relative", zIndex: 10 }}>
          <ScrollReveal>
            <p style={{ color: "var(--text3)", fontSize: "0.68rem", letterSpacing: "0.08em", fontWeight: 300, marginBottom: "24px" }}>[06] // deploy</p>
            <h2 style={{ fontSize: "clamp(2.4rem, 7vw, 5.5rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05, color: "var(--text)", marginBottom: "24px" }}>
              Pronto a costruire<br />
              <span style={{ color: "var(--accent)", textShadow: "0 0 50px rgba(0,217,163,0.4)" }}>il tuo server</span>
              <span className="cursor-blink" style={{ marginLeft: "8px" }} />
            </h2>
            <p style={{ color: "var(--text2)", fontSize: "0.88rem", lineHeight: 1.9, fontWeight: 300, maxWidth: "380px", marginBottom: "52px" }}>
              Gratis. Senza limiti. Zero configurazione.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <motion.a
                href={INVITE_URL} target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.03, boxShadow: "0 0 48px rgba(0,217,163,0.4), 0 0 96px rgba(0,217,163,0.15)" }}
                whileTap={{ scale: 0.97 }}
                style={{ display: "inline-block", background: "var(--accent)", color: "#0C0D10", fontWeight: 700, fontSize: "0.82rem", padding: "15px 40px", borderRadius: "var(--radius-sm)", letterSpacing: "0.1em", textDecoration: "none" }}
              >
                AGGIUNGI AL SERVER →
              </motion.a>
              <motion.a
                href="https://github.com/Leixien/discord-architect" target="_blank" rel="noopener noreferrer"
                whileHover={{ borderColor: "rgba(0,217,163,0.3)", color: "var(--text)" }}
                style={{ display: "inline-block", border: "1px solid var(--border2)", color: "var(--text2)", fontWeight: 400, fontSize: "0.82rem", padding: "15px 32px", borderRadius: "var(--radius-sm)", letterSpacing: "0.06em", textDecoration: "none", transition: "all 0.2s" }}
              >
                GitHub →
              </motion.a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: "1px solid var(--border2)", padding: "24px 48px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: "var(--text3)", fontSize: "0.72rem" }}>discord-architect © 2026</span>
        <span style={{ color: "var(--text3)", fontSize: "0.72rem" }}>built with ⬡</span>
      </footer>
    </main>
  );
}

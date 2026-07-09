import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/effect-coverflow";

import thumb1 from "@/assets/thumb-1.jpg";
import thumb2 from "@/assets/thumb-2.jpg";
import thumb3 from "@/assets/thumb-3.jpg";
import thumb4 from "@/assets/thumb-4.jpg";
import thumb5 from "@/assets/thumb-5.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { property: "og:image", content: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200" },
    ],
  }),
});

type Scene = {
  id: string;
  title: string;
  subtitle: string;
  eyebrow: string;
  thumb: string;
  video: string;
  accent: string; // oklch
};

// Public direct MP4s from Pexels (cinematic, royalty-free).
const SCENES: Scene[] = [
  {
    id: "velocity",
    eyebrow: "Chapter 01 — Velocity",
    title: "Engineered\nin Silence.",
    subtitle: "A study of speed distilled into stillness. Every surface, every shadow — sculpted for one perfect frame.",
    thumb: thumb1,
    video: "https://videos.pexels.com/video-files/2022395/2022395-uhd_3840_2160_24fps.mp4",
    accent: "oklch(0.75 0.18 30)",
  },
  {
    id: "monument",
    eyebrow: "Chapter 02 — Monument",
    title: "Architecture\nof Light.",
    subtitle: "Where structure meets the sun. A monument to precision, cast in glass and golden hour.",
    thumb: thumb2,
    video: "https://videos.pexels.com/video-files/3141210/3141210-uhd_2732_1440_25fps.mp4",
    accent: "oklch(0.85 0.13 85)",
  },
  {
    id: "essence",
    eyebrow: "Chapter 03 — Essence",
    title: "Liquid\nGold.",
    subtitle: "A single drop, an infinite reflection. The material poetry of pure craft.",
    thumb: thumb3,
    video: "https://videos.pexels.com/video-files/2887463/2887463-hd_1920_1080_25fps.mp4",
    accent: "oklch(0.82 0.16 70)",
  },
  {
    id: "couture",
    eyebrow: "Chapter 04 — Couture",
    title: "Silk\nin Motion.",
    subtitle: "Fabric that moves like breath. A silhouette drawn between shadow and skin.",
    thumb: thumb4,
    video: "https://videos.pexels.com/video-files/3209828/3209828-uhd_3840_2160_25fps.mp4",
    accent: "oklch(0.78 0.14 40)",
  },
  {
    id: "horizon",
    eyebrow: "Chapter 05 — Horizon",
    title: "Beyond\nthe Dunes.",
    subtitle: "A voyage into the last violet hour. Where the map ends and the story begins.",
    thumb: thumb5,
    video: "https://videos.pexels.com/video-files/1409899/1409899-hd_1920_1080_25fps.mp4",
    accent: "oklch(0.7 0.2 320)",
  },
];

function Index() {
  const [active, setActive] = useState(0);
  const scene = SCENES[active];
  const reduce = usePrefersReducedMotion();

  return (
    <div className="relative min-h-screen text-foreground" style={{ ["--accent" as never]: scene.accent }}>
      <CustomCursor />
      <ScrollProgress />
      <VideoBackground scenes={SCENES} activeIndex={active} reduce={reduce} />
      <FloatingParticles />

      <Nav />

      <main className="relative z-10">
        <Hero scene={scene} index={active} total={SCENES.length} />
        <SceneCarousel scenes={SCENES} activeIndex={active} onSelect={setActive} />
        <Features />
        <Stats />
        <Testimonials />
        <Portfolio />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}

/* ─────────────────────── Reduced motion hook ─────────────────────── */
function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(m.matches);
    const h = () => setReduce(m.matches);
    m.addEventListener("change", h);
    return () => m.removeEventListener("change", h);
  }, []);
  return reduce;
}

/* ─────────────────────── Video background ─────────────────────── */
function VideoBackground({ scenes, activeIndex, reduce }: { scenes: Scene[]; activeIndex: number; reduce: boolean }) {
  return (
    <div className="fixed inset-0 -z-0 overflow-hidden bg-background">
      {/* base fallback image layer — always visible, guarantees luxe look even if video fails */}
      <AnimatePresence>
        <motion.div
          key={scenes[activeIndex].id + "-img"}
          initial={{ opacity: 0, scale: 1.08, filter: "blur(24px)" }}
          animate={{ opacity: 1, scale: 1.02, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.06, filter: "blur(18px)" }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src={scenes[activeIndex].thumb}
            alt=""
            aria-hidden
            className={`h-full w-full object-cover ${reduce ? "" : "animate-kenburns"}`}
            draggable={false}
          />
        </motion.div>
      </AnimatePresence>

      {/* video layer on top — fades in when playing */}
      {!reduce && (
        <AnimatePresence>
          <motion.video
            key={scenes[activeIndex].id + "-vid"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 h-full w-full object-cover"
            src={scenes[activeIndex].video}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        </AnimatePresence>
      )}

      {/* light sweep */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          key={scenes[activeIndex].id + "-sweep"}
          initial={{ x: "-120%" }}
          animate={{ x: "220%" }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -inset-y-10 w-1/3 skew-x-[-20deg]"
          style={{ background: "linear-gradient(90deg, transparent, oklch(1 0 0 / 0.14), transparent)" }}
        />
      </div>

      {/* gradient overlays for readability */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, oklch(0.05 0 0 / 0.55) 0%, oklch(0.05 0 0 / 0.25) 40%, oklch(0.05 0 0 / 0.85) 100%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(1200px 700px at 20% 30%, var(--accent) / 12%, transparent 60%)" }} />
      {/* noise */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
           style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")" }} />
    </div>
  );
}

/* ─────────────────────── Scroll progress ─────────────────────── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const w = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <motion.div
      style={{ scaleX: w }}
      className="fixed left-0 top-0 z-50 h-[2px] w-full origin-left bg-gradient-gold"
    />
  );
}

/* ─────────────────────── Cursor ─────────────────────── */
function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 350, damping: 28, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 350, damping: 28, mass: 0.3 });
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    document.documentElement.style.cursor = "none";
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHover(!!t.closest("a,button,[data-cursor='hover']"));
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      document.documentElement.style.cursor = "";
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [x, y]);

  return (
    <>
      <motion.div
        aria-hidden
        style={{ translateX: sx, translateY: sy }}
        className="pointer-events-none fixed left-0 top-0 z-[60] -ml-1 -mt-1 hidden h-2 w-2 rounded-full bg-white md:block"
      />
      <motion.div
        aria-hidden
        style={{ translateX: x, translateY: y }}
        animate={{ width: hover ? 56 : 32, height: hover ? 56 : 32, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 20 }}
        className="pointer-events-none fixed left-0 top-0 z-[59] hidden -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/50 backdrop-blur-sm md:block"
      />
    </>
  );
}

/* ─────────────────────── Floating particles ─────────────────────── */
function FloatingParticles() {
  const pts = useMemo(
    () => Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 2 + Math.random() * 3,
      dur: 8 + Math.random() * 10,
      delay: Math.random() * -10,
    })), []);
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {pts.map(p => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-white/40"
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size, filter: "blur(0.5px)", boxShadow: "0 0 8px oklch(1 0 0 / 0.5)" }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────── Nav ─────────────────────── */
function Nav() {
  const links = ["Work", "Studio", "Journal", "Contact"];
  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-40"
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-10">
        <a href="#" className="flex items-center gap-2 font-display text-lg tracking-tight">
          <span className="inline-block h-2 w-2 rounded-full bg-gradient-gold shadow-glow" />
          Lumière<span className="text-muted-foreground">/Studio</span>
        </a>
        <nav className="hidden items-center gap-1 rounded-full glass px-2 py-1.5 md:flex">
          {links.map(l => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="group relative rounded-full px-4 py-1.5 text-sm text-white/80 transition hover:text-white"
            >
              {l}
              <span className="absolute inset-x-4 -bottom-0.5 h-px scale-x-0 bg-gradient-gold transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>
        <a href="#contact" className="hidden md:inline-flex">
          <MagneticButton>Start a project</MagneticButton>
        </a>
      </div>
    </motion.header>
  );
}

/* ─────────────────────── Magnetic button ─────────────────────── */
function MagneticButton({ children, variant = "gold" }: { children: React.ReactNode; variant?: "gold" | "ghost" }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 20 });
  const sy = useSpring(y, { stiffness: 250, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.35);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.96 }}
      className={
        variant === "gold"
          ? "relative overflow-hidden rounded-full bg-gradient-gold px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow"
          : "relative overflow-hidden rounded-full glass px-6 py-3 text-sm font-medium text-white"
      }
    >
      <span className="relative z-10">{children}</span>
      <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
        <span className="absolute -inset-y-6 -left-1/3 w-1/3 skew-x-[-20deg] bg-white/25 opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-100 [button:hover>&]:opacity-100" />
      </span>
    </motion.button>
  );
}

/* ─────────────────────── Hero ─────────────────────── */
function Hero({ scene, index, total }: { scene: Scene; index: number; total: number }) {
  return (
    <section className="relative flex min-h-[100svh] items-end pb-32 pt-40">
      <div className="mx-auto w-full max-w-[1600px] px-6 md:px-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={scene.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
          >
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-white/60" />
              <span className="text-xs uppercase tracking-[0.3em] text-white/70">{scene.eyebrow}</span>
            </div>
            <h1 className="font-display text-[clamp(3rem,9vw,9rem)] leading-[0.92]">
              {scene.title.split("\n").map((line, i) => (
                <SplitLine key={i} text={line} delay={i * 0.15} />
              ))}
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-8 max-w-xl text-lg text-white/75"
            >
              {scene.subtitle}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <MagneticButton>Watch the film</MagneticButton>
              <MagneticButton variant="ghost">View the case study →</MagneticButton>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-16 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/60">
          <span>Scroll to explore</span>
          <span>{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        </div>
      </div>

      {/* scroll cue */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
        <div className="relative h-10 w-6 rounded-full border border-white/30">
          <motion.span
            animate={{ y: [0, 14, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute left-1/2 top-1.5 h-2 w-0.5 -translate-x-1/2 rounded bg-white"
          />
        </div>
      </div>
    </section>
  );
}

function SplitLine({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <span className="block overflow-hidden pb-2">
      <motion.span
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay }}
        className="inline-block"
      >
        {text}
      </motion.span>
    </span>
  );
}

/* ─────────────────────── Scene carousel ─────────────────────── */
function SceneCarousel({ scenes, activeIndex, onSelect }: { scenes: Scene[]; activeIndex: number; onSelect: (i: number) => void }) {
  return (
    <section id="work" className="relative py-24">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="mb-2 text-xs uppercase tracking-[0.3em] text-white/60">The Collection</div>
            <h2 className="font-display text-4xl md:text-5xl">Select a chapter</h2>
          </div>
          <div className="hidden text-sm text-white/60 md:block">Click to reshape the world.</div>
        </div>

        <div className="glass-strong rounded-3xl p-4 shadow-luxe md:p-6">
          <Swiper
            modules={[FreeMode, Autoplay, EffectCoverflow]}
            slidesPerView="auto"
            spaceBetween={20}
            freeMode
            loop
            grabCursor
            className="!overflow-visible"
          >
            {scenes.concat(scenes).map((s, i) => {
              const idx = i % scenes.length;
              const isActive = idx === activeIndex;
              return (
                <SwiperSlide key={i} className="!w-[240px] md:!w-[300px]">
                  <ThumbCard scene={s} isActive={isActive} onClick={() => onSelect(idx)} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

function ThumbCard({ scene, isActive, onClick }: { scene: Scene; isActive: boolean; onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const rx = useMotionValue(0), ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 20 });
  const sry = useSpring(ry, { stiffness: 200, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 14);
    rx.set(-(py - 0.5) * 14);
  };
  const reset = () => { rx.set(0); ry.set(0); };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={reset}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={{ perspective: 1000 }}
      className="group relative block h-[380px] w-full text-left"
    >
      <motion.div
        style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
        className={`relative h-full w-full overflow-hidden rounded-2xl border transition-shadow duration-500 ${
          isActive ? "border-transparent shadow-glow" : "border-white/10 shadow-luxe"
        }`}
      >
        {/* animated border on hover / active */}
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-0 rounded-2xl p-px transition-opacity ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
          style={{ background: "conic-gradient(from 120deg, transparent, oklch(0.9 0.13 85), transparent 40%, oklch(0.75 0.18 30), transparent 80%)" }}
        >
          <span className="block h-full w-full rounded-2xl bg-background/40" />
        </span>

        <img
          src={scene.thumb}
          alt={scene.title}
          loading="lazy"
          width={300}
          height={380}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110 group-hover:brightness-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* light sweep on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
        >
          <span className="absolute -inset-y-10 -left-1/3 h-[200%] w-1/3 skew-x-[-20deg] bg-white/10 opacity-0 blur-sm transition-transform duration-700 group-hover:translate-x-[350%] group-hover:opacity-100" />
        </span>

        <div className="absolute inset-x-5 bottom-5">
          <div className="mb-1 text-[10px] uppercase tracking-[0.3em] text-white/70">{scene.eyebrow}</div>
          <div className="font-display text-2xl leading-tight text-white">
            {scene.title.replace("\n", " ")}
          </div>
          {isActive && (
            <motion.div
              layoutId="active-dot"
              className="mt-3 inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-[10px] uppercase tracking-[0.2em]"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              Now playing
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.button>
  );
}

/* ─────────────────────── Features ─────────────────────── */
const FEATURES = [
  { k: "Craft", t: "Bespoke Motion", d: "Every frame authored by hand. No stock. No shortcuts." },
  { k: "Speed", t: "Sub-second Loads", d: "Adaptive streaming, code splitting and edge delivery — worldwide." },
  { k: "Depth", t: "Cinematic Language", d: "Storyboards, colorists and sound designers on every project." },
  { k: "Access", t: "Radically Inclusive", d: "WCAG AA+, reduced-motion aware, universally responsive." },
];

function Features() {
  return (
    <section id="studio" className="relative py-32">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <Reveal>
          <div className="mb-16 max-w-3xl">
            <div className="mb-3 text-xs uppercase tracking-[0.3em] text-white/60">The Practice</div>
            <h2 className="font-display text-5xl leading-[1] md:text-7xl">
              A studio for the <span className="text-gradient-gold italic">unforgettable</span>.
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <Reveal key={f.t} delay={i * 0.08}>
              <TiltCard>
                <div className="mb-8 text-xs uppercase tracking-[0.3em] text-white/60">{f.k}</div>
                <div className="font-display text-2xl">{f.t}</div>
                <p className="mt-3 text-sm text-white/70">{f.d}</p>
                <div className="mt-10 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/50">
                  <span className="h-px w-6 bg-white/40" /> 0{i + 1}
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0), ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 180, damping: 18 });
  const sry = useSpring(ry, { stiffness: 180, damping: 18 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 8);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
  };
  const reset = () => { rx.set(0); ry.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      whileHover={{ y: -6 }}
      style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
      className="glass relative h-full rounded-2xl p-8 shadow-luxe"
    >
      {/* glass reflection */}
      <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
        <span className="absolute -top-1/2 left-1/2 h-full w-2/3 -translate-x-1/2 rounded-full bg-white/5 blur-2xl" />
      </span>
      {children}
    </motion.div>
  );
}

/* ─────────────────────── Reveal on scroll ─────────────────────── */
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────── Stats ─────────────────────── */
const STATS = [
  { v: 74, s: "+", l: "Awwwards & FWA honors" },
  { v: 12, s: "", l: "Years of practice" },
  { v: 190, s: "M", l: "Impressions delivered" },
  { v: 98, s: "%", l: "Client retention" },
];

function Stats() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="glass-strong rounded-3xl p-10 shadow-luxe md:p-16">
          <div className="grid gap-10 md:grid-cols-4">
            {STATS.map((s, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div>
                  <div className="font-display text-6xl md:text-7xl">
                    <Counter to={s.v} />{s.s}
                  </div>
                  <div className="mt-3 text-sm text-white/60">{s.l}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Counter({ to }: { to: number }) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      const dur = 1600, start = performance.now();
      const step = (t: number) => {
        const p = Math.min(1, (t - start) / dur);
        setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      io.disconnect();
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{v}</span>;
}

/* ─────────────────────── Testimonials ─────────────────────── */
const TESTIMONIALS = [
  { q: "Every pixel felt inevitable. Lumière didn't design our site — they scored it.", a: "Aria Chen", r: "CMO, Meridian" },
  { q: "The launch trended for a week. We've never seen craft translate to conversion this cleanly.", a: "Jonas Weiss", r: "Founder, Halcyon" },
  { q: "It's the digital equivalent of walking into a Prada flagship. Complete world-building.", a: "Priya Rao", r: "Creative Director, Aster" },
  { q: "Their motion team operates like a cinematography crew. Absolute obsession.", a: "Marc Élise", r: "Head of Brand, VOLT" },
];

function Testimonials() {
  return (
    <section id="journal" className="relative py-32">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <Reveal>
          <div className="mb-12 flex items-end justify-between">
            <div>
              <div className="mb-3 text-xs uppercase tracking-[0.3em] text-white/60">In their words</div>
              <h2 className="font-display text-5xl md:text-6xl">Trusted by the discerning.</h2>
            </div>
          </div>
        </Reveal>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={24}
          slidesPerView={1.05}
          centeredSlides
          loop
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{ 768: { slidesPerView: 1.6 }, 1200: { slidesPerView: 2.2 } }}
          className="!overflow-visible"
        >
          {TESTIMONIALS.map((t, i) => (
            <SwiperSlide key={i}>
              <div className="glass-strong h-full rounded-3xl p-10 shadow-luxe md:p-14">
                <div className="mb-6 text-4xl text-gradient-gold">"</div>
                <p className="font-display text-2xl leading-snug md:text-3xl">{t.q}</p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-gold" />
                  <div>
                    <div className="text-sm font-semibold">{t.a}</div>
                    <div className="text-xs text-white/60">{t.r}</div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

/* ─────────────────────── Portfolio ─────────────────────── */
const PORTFOLIO = [
  { t: "Aeon 03", c: "Aeon Motors", y: "2026", img: thumb1 },
  { t: "The Pavilion", c: "Meridian Group", y: "2026", img: thumb2 },
  { t: "Or Pur", c: "Maison Volaré", y: "2025", img: thumb3 },
  { t: "Chiffon FW", c: "Aster Atelier", y: "2025", img: thumb4 },
  { t: "Voyage", c: "Halcyon Travel", y: "2025", img: thumb5 },
  { t: "Nightfall", c: "VOLT Studios", y: "2024", img: thumb1 },
];

function Portfolio() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <Reveal>
          <div className="mb-14 flex items-end justify-between">
            <h2 className="font-display text-5xl md:text-6xl">Selected work</h2>
            <a href="#" className="hidden text-sm uppercase tracking-[0.25em] text-white/70 hover:text-white md:inline">Archive →</a>
          </div>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PORTFOLIO.map((p, i) => (
            <Reveal key={i} delay={(i % 3) * 0.08}>
              <a href="#" className="group relative block overflow-hidden rounded-2xl">
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.t}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute inset-x-6 bottom-6 flex items-end justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-white/70">{p.c}</div>
                    <div className="font-display text-3xl">{p.t}</div>
                  </div>
                  <div className="text-xs text-white/60">{p.y}</div>
                </div>
                <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100"
                     style={{ background: "linear-gradient(120deg, transparent, oklch(0.85 0.13 85 / 0.15), transparent)" }} />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── CTA ─────────────────────── */
function CTA() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0.7, 1], [40, -40]);
  return (
    <section id="contact" className="relative py-40">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <motion.div style={{ y }} className="glass-strong overflow-hidden rounded-3xl p-14 shadow-luxe md:p-24">
          <div className="mb-6 text-xs uppercase tracking-[0.3em] text-white/60">Commission</div>
          <h2 className="font-display text-6xl leading-[0.95] md:text-8xl">
            Let's make something<br /><span className="text-gradient-aurora italic">unforgettable</span>.
          </h2>
          <p className="mt-8 max-w-xl text-lg text-white/70">
            We work with a handful of clients per year. Tell us about the future you're building.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <MagneticButton>Start a project</MagneticButton>
            <MagneticButton variant="ghost">hello@lumiere.studio</MagneticButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────── Footer ─────────────────────── */
function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10">
      <div className="mx-auto max-w-[1600px] px-6 py-14 md:px-10">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-display text-lg">
              <span className="inline-block h-2 w-2 rounded-full bg-gradient-gold" /> Lumière
            </div>
            <p className="mt-4 max-w-xs text-sm text-white/60">
              A boutique digital atelier crafting cinematic brand experiences from Paris & New York.
            </p>
          </div>
          {[
            { h: "Studio", l: ["About", "Team", "Careers", "Press"] },
            { h: "Work", l: ["Case studies", "Recognition", "Archive", "Process"] },
            { h: "Contact", l: ["hello@lumiere.studio", "+33 1 84 88 12 09", "Instagram", "Vimeo"] },
          ].map(col => (
            <div key={col.h}>
              <div className="mb-4 text-xs uppercase tracking-[0.3em] text-white/60">{col.h}</div>
              <ul className="space-y-2 text-sm text-white/80">
                {col.l.map(x => (
                  <li key={x}><a href="#" className="transition hover:text-white">{x}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/50">
          <div>© {new Date().getFullYear()} Lumière Studio. All frames reserved.</div>
          <div>Crafted with obsession · Paris / NYC</div>
        </div>
      </div>
    </footer>
  );
}

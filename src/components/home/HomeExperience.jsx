import { useEffect, useRef, useState } from "react";
import { Box, Button, Stack, Typography, useMediaQuery } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useNavigate } from "react-router-dom";
import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import FeaturedWork from "../FeaturedWork";
import Logo from "../../assets/advantage_new_logo.png";
import {
  campaignMedia,
  dummyCampaigns,
  impactStats,
  processSteps,
  serviceItems,
} from "./homeData";
import "./homeExperience.css";

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

function SectionLabel({ index, children }) {
  return (
    <Box className="home-section-label">
      <span>[ {index} ]</span>
      <span>{children}</span>
    </Box>
  );
}

function RevealLine({ children, delay = 0 }) {
  return (
    <span className="reveal-line">
      <motion.span
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.95, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function NoiseOverlay() {
  return <Box aria-hidden className="noise-overlay" />;
}

function OrbitalRings({ className = "" }) {
  return (
    <motion.svg
      aria-hidden
      className={`orbital-rings ${className}`}
      viewBox="0 0 700 700"
      initial={{ opacity: 0, rotate: -8 }}
      whileInView={{ opacity: 1, rotate: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.4, ease: "easeOut" }}
    >
      <motion.circle
        cx="350"
        cy="350"
        r="250"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        pathLength="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: "easeInOut" }}
      />
      <ellipse cx="350" cy="350" rx="310" ry="150" fill="none" />
      <ellipse cx="350" cy="350" rx="170" ry="310" fill="none" />
      <path d="M72 350H628M350 72V628" fill="none" />
    </motion.svg>
  );
}

function MagneticButton({ children, onClick, variant = "light" }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18 });
  const springY = useSpring(y, { stiffness: 220, damping: 18 });

  const handleMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.18);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.18);
  };

  return (
    <motion.button
      type="button"
      className={`magnetic-button magnetic-button--${variant}`}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ x: springX, y: springY }}
    >
      <span>{children}</span>
      <ArrowOutwardIcon fontSize="small" />
    </motion.button>
  );
}

function HeroSection() {
  const navigate = useNavigate();
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const isTouch = useMediaQuery("(pointer: coarse)");
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const titleX = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const scrollScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const px = useSpring(pointerX, { stiffness: 80, damping: 26 });
  const py = useSpring(pointerY, { stiffness: 80, damping: 26 });
  const nearX = useTransform(px, (v) => v * -1.7);
  const nearY = useTransform(py, (v) => v * -1.7);
  const farTransform = useMotionTemplate`translate3d(${px}px, ${py}px, 0)`;
  const nearTransform = useMotionTemplate`translate3d(${nearX}px, ${nearY}px, 0)`;

  const handlePointerMove = (event) => {
    if (isTouch || shouldReduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    pointerX.set(x * 0.025);
    pointerY.set(y * 0.025);
  };

  return (
    <MotionBox
      ref={ref}
      className="cinematic-hero"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
    >
      <MotionBox
        className="hero-media"
        style={{
          y: shouldReduceMotion ? 0 : imageY,
          scale: shouldReduceMotion ? 1 : scrollScale,
        }}
        initial={{ scale: shouldReduceMotion ? 1 : 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <img src={campaignMedia[0].src} alt="" />
      </MotionBox>
      <Box className="hero-vignette" />
      <motion.div className="hero-grid" style={{ transform: farTransform }} />
      <motion.div className="hero-orbit-plane" style={{ transform: nearTransform }}>
        <OrbitalRings />
      </motion.div>
      <motion.div
        className="hero-plus-field"
        style={{ x: shouldReduceMotion ? 0 : titleX }}
      >
        {Array.from({ length: 28 }).map((_, index) => (
          <span key={index}>+</span>
        ))}
      </motion.div>

      <Box className="hero-content">
        <motion.img
          src={Logo}
          alt="Advantage+"
          className="hero-logo"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7 }}
        />
        <MotionTypography
          component="h1"
          className="hero-title"
          style={{ x: shouldReduceMotion ? 0 : titleX }}
        >
          <RevealLine delay={0.35}>We Create</RevealLine>
          <RevealLine delay={0.48}>Attention.</RevealLine>
        </MotionTypography>
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.8 }}
        >
          <span>Marketing & Production That Converts</span>
          <p>
            We create high-impact advertising campaigns, professional media
            production, and strategic brand communication across TV, digital,
            outdoor, and social platforms.
          </p>
        </motion.div>
        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.24, duration: 0.7 }}
        >
          <MagneticButton onClick={() => navigate("/contact")}>
            Start a Project
          </MagneticButton>
          <button
            type="button"
            className="text-link-button"
            onClick={() => navigate("/#work")}
          >
            View Work <ArrowOutwardIcon fontSize="small" />
          </button>
        </motion.div>
      </Box>

      <motion.div
        className="hero-meta"
        initial={{ opacity: 0, x: 28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.3, duration: 0.7 }}
      >
        <span>ADV+ / 33.3152 N</span>
        <strong>Strategy / Production / Performance</strong>
        <span>Broadcast - Social - Outdoor</span>
      </motion.div>
      <motion.div
        className="scroll-cue"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7, duration: 0.8 }}
      >
        Scroll
      </motion.div>
    </MotionBox>
  );
}

function BrandMarquee() {
  const words = "STRATEGY + PRODUCTION + DIGITAL + OUTDOOR + SOCIAL + BROADCAST + ";
  return (
    <Box className="brand-marquee" aria-label={words}>
      <div className="marquee-row marquee-row--left">
        <span>{words.repeat(2)}</span>
        <span>{words.repeat(2)}</span>
      </div>
      <div className="marquee-row marquee-row--right">
        <span>{words.repeat(2)}</span>
        <span>{words.repeat(2)}</span>
      </div>
    </Box>
  );
}

function BrandStatement() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 45%"],
  });
  const words = ["We", "don't", "just", "make", "ads.", "We", "build", "perception."];

  return (
    <Box ref={ref} className="brand-statement">
      <SectionLabel index="01">Who We Are</SectionLabel>
      <OrbitalRings className="statement-orbits" />
      <Typography component="h2" className="statement-title">
        {words.map((word, index) => (
          <StatementWord
            key={`${word}-${index}`}
            index={index}
            total={words.length}
            progress={scrollYProgress}
            accent={index > 4}
          >
            {word}
          </StatementWord>
        ))}
      </Typography>
      <p>
        Advantage+ turns campaign thinking into public memory: strategy,
        production, media, and performance shaped as one integrated brand
        experience.
      </p>
    </Box>
  );
}

function StatementWord({ children, index, total, progress, accent }) {
  const start = index / total;
  const end = start + 0.28;
  const color = useTransform(progress, [start, end], [
    "rgba(242,242,234,0.2)",
    accent ? "#E3FC7B" : "#F2F2EA",
  ]);

  return <motion.span style={{ color }}>{children}</motion.span>;
}

function ServicesExperience() {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(0);
  const activeService = serviceItems[active];

  return (
    <Box id="services" className="services-experience">
      <SectionLabel index="02">Services</SectionLabel>
      <Box className="services-heading-row">
        <Typography component="h2">Built For Attention Across Every Surface</Typography>
        <p>
          Six core capabilities, re-composed as a single production and
          communication engine.
        </p>
      </Box>
      <Box className="services-stage">
        <Box className="service-list">
          {serviceItems.map((service, index) => {
            const isActive = active === index;
            const isExpanded = expanded === index;
            return (
              <button
                type="button"
                key={service.title}
                className={`service-row ${isActive ? "is-active" : ""}`}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => {
                  setActive(index);
                  setExpanded(isExpanded ? -1 : index);
                }}
                style={{ "--service-accent": service.accent }}
              >
                <span className="service-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="service-title">{service.title}</span>
                <span className="service-arrow">↗</span>
                <span className="service-copy">{service.desc}</span>
              </button>
            );
          })}
        </Box>
        <motion.div
          className="service-preview"
          key={activeService.title}
          initial={{ opacity: 0, scale: 0.96, rotate: -1.5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <img src={activeService.image} alt="" loading="lazy" />
          <span>{activeService.title}</span>
        </motion.div>
      </Box>
    </Box>
  );
}

function CampaignShowcase() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const textX = useTransform(scrollYProgress, [0, 1], ["34%", "-38%"]);
  const yOne = useTransform(scrollYProgress, [0, 1], ["8%", "-14%"]);
  const yTwo = useTransform(scrollYProgress, [0, 1], ["-8%", "10%"]);

  return (
    <Box ref={ref} className="campaign-showcase">
      <motion.div className="horizontal-claim" style={{ x: textX }}>
        We Make Brands Impossible To Ignore
      </motion.div>
      <SectionLabel index="03">Campaign Language</SectionLabel>
      <Box className="gallery-composition">
        {dummyCampaigns.map((campaign, index) => (
          <motion.figure
            key={campaign.title}
            className={`campaign-frame campaign-frame--${index + 1}`}
            style={{ y: index % 2 === 0 ? yOne : yTwo }}
            whileHover={{ scale: 1.025 }}
          >
            <img src={campaign.image} alt={campaign.title} loading="lazy" />
            <figcaption>
              <span>Campaign {String(index + 1).padStart(2, "0")}</span>
              <strong>{campaign.title}</strong>
              <span>
                {campaign.client} / {campaign.year}
              </span>
            </figcaption>
          </motion.figure>
        ))}
        <motion.div className="video-tile" style={{ y: yTwo }}>
          <video
            src="https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/zahra_bn_mem_1.mp4"
            muted
            loop
            playsInline
            preload="metadata"
          />
          <PlayArrowIcon />
          <span>Muted preview / Full playback in work gallery</span>
        </motion.div>
      </Box>
    </Box>
  );
}

function AnimatedCounter({ value, suffix }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (latest) => setDisplay(latest));
    return unsubscribe;
  }, [rounded]);

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  return (
    <span ref={ref}>
      {display}
      {suffix === "deg" ? "deg" : suffix}
    </span>
  );
}

function ImpactNumbers() {
  return (
    <Box className="impact-numbers">
      <SectionLabel index="04">Impact System</SectionLabel>
      <Box className="stats-grid">
        {impactStats.map((stat) => (
          <Box key={stat.label} className="stat-item">
            <Typography component="strong">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </Typography>
            <span>{stat.label}</span>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function CreativeProcess() {
  const [active, setActive] = useState(0);

  return (
    <Box className="creative-process">
      <Box className="process-sticky">
        <SectionLabel index="05">How We Work</SectionLabel>
        <Typography component="h2">
          How
          <br />
          We
          <br />
          Work
        </Typography>
        <Box className="process-line">
          <motion.span
            animate={{ scaleY: (active + 1) / processSteps.length }}
            transition={{ duration: 0.35 }}
          />
        </Box>
      </Box>
      <Box className="process-steps">
        {processSteps.map((step, index) => (
          <ProcessStep
            key={step.title}
            index={index}
            step={step}
            setActive={setActive}
            isActive={active === index}
          />
        ))}
      </Box>
    </Box>
  );
}

function ProcessStep({ index, step, setActive, isActive }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.55 });

  useEffect(() => {
    if (isInView) setActive(index);
  }, [index, isInView, setActive]);

  return (
    <Box ref={ref} className={`process-step ${isActive ? "is-active" : ""}`}>
      <span>{String(index + 1).padStart(2, "0")}</span>
      <Typography component="h3">{step.title}</Typography>
      <p>{step.text}</p>
    </Box>
  );
}

function InteractiveBrandWorld() {
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 90]);
  const words = ["Film", "Strategy", "Design", "Social", "Media", "Digital"];

  return (
    <Box ref={ref} className="brand-world">
      <SectionLabel index="06">Brand World</SectionLabel>
      <motion.div className="world-orbit" style={{ rotate }}>
        {words.map((word, index) => (
          <span
            key={word}
            style={{
              "--angle": `${index * 60}deg`,
            }}
          >
            {word}
          </span>
        ))}
      </motion.div>
      <Box className="image-plus" aria-label="Advantage plus image system">
        {campaignMedia.slice(0, 5).map((item, index) => (
          <img key={item.src} src={item.src} alt="" className={`plus-img plus-img--${index}`} />
        ))}
        <strong>+</strong>
      </Box>
      <Typography component="h2">A campaign is not one asset. It is a world.</Typography>
    </Box>
  );
}

function FeaturedWorkPortal() {
  return (
    <Box id="work" className="featured-portal">
      <SectionLabel index="07">Featured Work</SectionLabel>
      <FeaturedWork />
    </Box>
  );
}

function FinalCTA() {
  const navigate = useNavigate();

  return (
    <Box className="final-cta">
      <OrbitalRings className="final-orbits" />
      <Box className="final-cta-meta final-cta-meta--left">
        <span>ADVANTAGE+</span>
        <span>Marketing / Production / Strategy</span>
      </Box>
      <Typography component="h2">
        Have an idea?
        <br />
        Let's make it
        <br />
        impossible to ignore.
      </Typography>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
        <MagneticButton variant="dark" onClick={() => navigate("/contact")}>
          Start a Project
        </MagneticButton>
        <Button
          variant="text"
          onClick={() => navigate("/#services")}
          endIcon={<ArrowOutwardIcon />}
          sx={{ color: "rgba(242,242,234,0.76)" }}
        >
          Revisit Services
        </Button>
      </Stack>
      <Box className="final-cta-meta final-cta-meta--right">
        <span>Baghdad / Global Campaign Thinking</span>
        <span>Contact route preserved</span>
      </Box>
    </Box>
  );
}

function ScrollProgressLine() {
  const { scrollYProgress } = useScroll();
  return <motion.div className="page-progress" style={{ scaleX: scrollYProgress }} />;
}

export default function HomeExperience() {
  return (
    <Box className="home-experience">
      <ScrollProgressLine />
      <NoiseOverlay />
      <HeroSection />
      <BrandMarquee />
      <BrandStatement />
      <ServicesExperience />
      <CampaignShowcase />
      <ImpactNumbers />
      <CreativeProcess />
      <InteractiveBrandWorld />
      <FeaturedWorkPortal />
      <FinalCTA />
    </Box>
  );
}

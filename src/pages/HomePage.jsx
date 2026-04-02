import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Grid,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import FeaturedWork from "../components/FeaturedWork";
import { useLocation, useNavigate } from "react-router-dom";

const HERO_IMAGES = [
  // "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  // "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
];

const PROJECTS = [
  {
    title: "Luxury Real Estate Campaign",
    img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
  },
  {
    title: "Outdoor Billboard Series",
    img: "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/zahddraa.jpg",
  },
  {
    title: "Social Media Branding",
    img: "https://images.unsplash.com/photo-1547658719-da2b51169166",
  },
  {
    title: "TV Commercial Production",
    img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
  },
];

function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.replace("#", ""));
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100); // slight delay for render
      }
    }
  }, [location]);

  return null;
}

export default function HomePage() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const i = setInterval(() => {
      setIndex((v) => (v + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(i);
  }, []);

  return (
    <Box>
      <ScrollToHash />
      {/* ================= HERO ================= */}
      <Box
        sx={{
          position: "relative",
          height: { xs: "80vh", md: "90vh" },
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          mt: 2,
        }}
      >
        {/* background images */}
        {HERO_IMAGES.map((src, i) => (
          <Box
            key={src}
            component={motion.img}
            src={HERO_IMAGES[0]}
            // initial={{ opacity: 0 }}
            // animate={{ opacity: i === index ? 1 : 0 }}
            // transition={{ duration: 1 }}
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.5)",
            }}
          />
        ))}

        <Container sx={{ position: "relative", zIndex: 2 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={7}>
              <Typography variant="h2" sx={{ fontWeight: 800 }}>
                Advantage+
                <br />
                Marketing That
                <br />
                <Box component="span" sx={{ color: "primary.main" }}>
                  Actually Converts
                </Box>
              </Typography>

              <Typography sx={{ mt: 3, maxWidth: 500 }}>
                Strategic campaigns, cinematic production, and brand systems
                built to scale your business across digital and real-world
                channels.
              </Typography>

              <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => {
                    navigate("/contact");
                  }}
                >
                  Start a Campaign
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate("/#work")}
                >
                  View Work
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>

        {/* floating stats */}
        {/* <Box
          sx={{
            position: "absolute",
            bottom: 40,
            right: 40,
            display: { xs: "none", md: "flex" },
            gap: 2,
          }}
        >
          {["+120 Campaigns", "+3M Reach", "98% Satisfaction"].map((t) => (
            <Paper sx={{ p: 2, backdropFilter: "blur(10px)" }} key={t}>
              <Typography variant="body2">{t}</Typography>
            </Paper>
          ))}
        </Box> */}
      </Box>

      {/* ================= SERVICES ================= */}
      <Container sx={{ py: 10 }} id="services">
        <Typography variant="h4" gutterBottom>
          What We Do
        </Typography>

        <Grid container spacing={4}>
          {[
            {
              title: "TV Commercials & Broadcasting",
              img: "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/TV-Commercials-_-Broadcasting.webp",
              desc: `We produce TV commercials that do more than fill airtime — they shape perception, build authority, and position your brand at scale.

From concept to broadcast, every production is driven by a clear strategic objective, combining storytelling, cinematic execution, and audience insight to create lasting impact.`,
            },
            {
              title: "Social Media Campaigns",
              img: "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/Social-Media-Campaigns.webp",
              desc: `We design and execute social media campaigns built to engage, convert, and grow.

Each campaign is tailored to your audience and platform behavior, combining creative content and data-driven strategy to turn attention into measurable results.`,
            },
            {
              title: "Billboards & Outdoor Advertising",
              img: "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/Billboards-_-Outdoor-Advertising.webp",
              desc: `We create outdoor campaigns that command attention and deliver impact in seconds.

Every billboard is designed with clarity, boldness, and strategic messaging to ensure your brand stands out in high-traffic environments.`,
            },
            {
              title: "Brand Strategy & Identity",
              img: "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/Brand-Strategy-_-Identity.webp",
              desc: `We build brands with purpose, clarity, and positioning — not just visuals.

From deep market understanding to strategic foundations, we craft identities that define how your brand is seen and remembered.`,
            },
            {
              title: "Professional Video Production",
              img: "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/Professional-Video-Production.webp",
              desc: `We produce high-end video content designed to communicate, influence, and elevate your brand.

Every production is built on a strong narrative and executed with precision to deliver real impact.`,
            },
            {
              title: "Digital & Performance Ads",
              img: "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/Digital-_-Performance-Ads.webp",
              desc: `We create and manage performance-driven advertising campaigns focused on results.

From Meta to Google, we build systems that drive growth, conversions, and measurable ROI through continuous optimization.`,
            },
          ].map((service) => (
            <Grid item xs={12} md={4} key={service.title}>
              <Paper
                component={motion.div}
                whileHover={{ y: -8 }}
                sx={{
                  height: "100%",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "0.3s",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* IMAGE */}
                <Box
                  component="img"
                  src={service.img}
                  sx={{
                    width: "100%",
                    height: 160,
                    objectFit: "cover",
                  }}
                />

                {/* CONTENT */}
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    {service.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.7,
                      display: "-webkit-box",
                      WebkitLineClamp: 5,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {service.desc}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ================= PROJECTS (MASONRY STYLE) ================= */}
      <Box id="work">
        <FeaturedWork />
      </Box>

      {/* ================= SPLIT SECTION ================= */}
      <Container sx={{ py: 10 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1492724441997-5dc865305da7"
              sx={{
                width: "100%",
                borderRadius: 2,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              Built for Growth
            </Typography>

            <Typography color="text.secondary">
              We don’t just create ads — we build systems that generate leads,
              conversions, and long-term brand equity.
            </Typography>

            <Stack spacing={2} sx={{ mt: 3 }}>
              {[
                "Data-driven strategy",
                "Creative production",
                "Multi-channel execution",
              ].map((item) => (
                <Paper key={item} sx={{ p: 2 }}>
                  <Typography>{item}</Typography>
                </Paper>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* ================= CTA ================= */}
      <Box
        sx={{
          py: 10,
          background:
            "linear-gradient(135deg, rgba(25,118,210,0.2), rgba(0,0,0,0.9))",
        }}
      >
        <Container>
          <Typography variant="h4" gutterBottom>
            Ready to Scale Your Brand?
          </Typography>

          <Typography sx={{ mb: 4 }}>
            Let’s build something powerful together.
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => {
              navigate("/contact");
            }}
          >
            Get Started
          </Button>
        </Container>
      </Box>
    </Box>
  );
}

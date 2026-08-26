import React, { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";

import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

// ===== MEDIA =====
const MEDIA = [
  "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/JANNAT.jpg",
  "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/HAEDR.jpg",
  "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/zahddraa.jpg",
  "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/5b645212-3410-4437-93a1-8a21450fc9c4.webp",
  "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/KHZ05973_Denoised.webp",
  "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/Bag-1.webp",
  "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/Bag-2.webp",
  "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/Bag-3.webp",
  "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/Bag-4.webp",
  "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/Bag-5.webp",
  "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/Delivery-Backpack.webp",
  "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/Helmet.webp",
  "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/sky.webp",
  "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/janat.webp",
];

const VIDEOS = [
  "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/zahra_bn_mem_1.mp4",
  "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/janat_amer_1.mp4",
];

export default function FeaturedWorkHero() {
  const lightboxRef = useRef(null);

  useEffect(() => {
    let lightbox;

    const init = async () => {
      // 🔥 Load image sizes
      const images = await Promise.all(
        MEDIA.map(
          (src) =>
            new Promise((resolve) => {
              const img = new Image();
              img.onload = () =>
                resolve({
                  src,
                  width: img.naturalWidth,
                  height: img.naturalHeight,
                });
              img.onerror = () =>
                resolve({
                  src,
                  width: 1600,
                  height: 1000,
                });
              img.src = src;
            }),
        ),
      );

      // 🎬 Videos as HTML slides
      const videos = VIDEOS.map((src) => ({
        html: `
          <div style="display:flex;justify-content:center;align-items:center;height:100%;">
            <video src="${src}" controls style="max-width:100%;max-height:80vh;border-radius:12px;" />
          </div>
        `,
      }));

      lightbox = new PhotoSwipeLightbox({
        dataSource: [...images, ...videos],
        pswpModule: () => import("photoswipe"),
      });

      lightbox.init();
      lightboxRef.current = lightbox;
    };

    init();

    return () => {
      if (lightbox) lightbox.destroy();
    };
  }, []);

  return (
    <Box sx={{ py: { xs: 3, md: 5 } }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 2,
          mb: { xs: 2, md: 4 },
        }}
      >
        <Typography
          component="h2"
          sx={{
            fontSize: { xs: "clamp(2.8rem, 17vw, 5rem)", md: "clamp(5rem, 10vw, 11rem)" },
            fontWeight: 950,
            lineHeight: 0.82,
            letterSpacing: "-0.06em",
            textTransform: "uppercase",
          }}
        >
          Featured
          <br />
          Work
        </Typography>
        <Typography
          sx={{
            display: { xs: "none", md: "block" },
            color: "rgba(242,242,234,0.58)",
            fontSize: "0.75rem",
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          2026 / PhotoSwipe Gallery
        </Typography>
      </Box>

      <Box
        component={motion.div}
        whileHover="hover"
        initial="rest"
        animate="rest"
        onClick={() => {
          lightboxRef.current?.loadAndOpen(0); // 🔥 THIS is the fix
        }}
        sx={{
          width: "100%",
          height: { xs: 420, md: "72svh" },
          overflow: "hidden",
          cursor: "pointer",
          position: "relative",
          border: "1px solid rgba(242,242,234,0.18)",
          background: "#050506",
        }}
      >
        <Box
          component={motion.img}
          src={MEDIA[0]}
          variants={{
            rest: { scale: 1 },
            hover: { scale: 1.055 },
          }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "saturate(0.82) contrast(1.05) brightness(0.72)",
          }}
        />

        <Box
          component={motion.div}
          variants={{
            rest: { background: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.72))" },
            hover: { background: "linear-gradient(180deg, rgba(0,0,0,0.18), rgba(0,0,0,0.48))" },
          }}
          sx={{
            position: "absolute",
            inset: 0,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: { xs: 18, md: 32 },
            border: "1px solid rgba(242,242,234,0.18)",
            pointerEvents: "none",
          }}
        />
        <Box
          component={motion.div}
          variants={{
            rest: { x: 0, y: 0 },
            hover: { x: 12, y: -12 },
          }}
          transition={{ duration: 0.35 }}
          sx={{
            position: "absolute",
            right: { xs: 28, md: 60 },
            bottom: { xs: 28, md: 54 },
            display: "grid",
            placeItems: "center",
            width: { xs: 104, md: 150 },
            aspectRatio: "1",
            borderRadius: "50%",
            background: "#E3FC7B",
            color: "#050506",
            fontWeight: 950,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Explore
          <ArrowOutwardIcon />
        </Box>
        <Typography
          sx={{
            position: "absolute",
            left: { xs: 28, md: 60 },
            bottom: { xs: 28, md: 54 },
            maxWidth: 620,
            color: "#F2F2EA",
            fontSize: { xs: "1.4rem", md: "clamp(2rem, 4vw, 5rem)" },
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
            textTransform: "uppercase",
          }}
        >
          Open the campaign archive
        </Typography>
      </Box>
    </Box>
  );
}

import React, { useEffect, useRef } from "react";
import { Box, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";

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
    <Container sx={{ py: 10 }}>
      <Typography variant="h4" gutterBottom>
        Featured Work
      </Typography>

      {/* HERO */}
      <Box
        component={motion.div}
        whileHover={{ scale: 1.01 }}
        onClick={() => {
          lightboxRef.current?.loadAndOpen(0); // 🔥 THIS is the fix
        }}
        sx={{
          width: "100%",
          height: { xs: 300, md: 500 },
          borderRadius: 4,
          overflow: "hidden",
          cursor: "pointer",
          position: "relative",
        }}
      >
        <img
          src={MEDIA[0]}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* OVERLAY */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
            display: "flex",
            alignItems: "flex-end",
            p: 3,
          }}
        >
          {/* <Typography variant="h5">View Full Campaign</Typography> */}
        </Box>
      </Box>
    </Container>
  );
}

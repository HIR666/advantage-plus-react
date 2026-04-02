import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Dialog,
  IconButton,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";

const PROJECTS = [
  {
    title: "Luxury Real Estate Campaign",
    media: [
      {
        type: "image",
        src: "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/JANNAT.jpg",
      },
      {
        type: "image",
        src: "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/HAEDR.jpg",
      },
      {
        type: "image",
        src: "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/zahddraa.jpg",
      },
      //   { type: "video", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
    ],
  },
  {
    title: "Outdoor Billboard Series",
    media: [
      {
        type: "image",
        src: "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/haied.webp",
      },
      {
        type: "image",
        src: "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/zahraa.webp",
      },
    ],
  },
  {
    title: "Social Media Branding",
    media: [
      {
        type: "image",
        src: "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/5b645212-3410-4437-93a1-8a21450fc9c4.webp",
      },
      {
        type: "image",
        src: "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/KHZ05973_Denoised.webp",
      },

      //   { type: "video", src: "https://www.w3schools.com/html/movie.mp4" },
    ],
  },
  {
    title: "Homemade Food Delivery Service",
    media: [
      {
        type: "image",
        src: "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/Bag-1.webp",
      },
      {
        type: "image",
        src: "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/Bag-2.webp",
      },
      {
        type: "image",
        src: "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/Bag-3.webp",
      },
      {
        type: "image",
        src: "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/Bag-4.webp",
      },
      {
        type: "image",
        src: "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/Bag-5.webp",
      },
      {
        type: "image",
        src: "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/Delivery-Backpack.webp",
      },
      {
        type: "image",
        src: "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/Helmet.webp",
      },
      //   { type: "video", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
    ],
  },
];

export default function FeaturedWork() {
  const [open, setOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(PROJECTS[0]);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleOpen = (project) => {
    setActiveProject(project);
    setActiveIndex(0);
    setOpen(true);
  };

  const activeMedia = activeProject?.media?.[activeIndex];

  return (
    <>
      {/* ================= GRID ================= */}
      <Container sx={{ py: 10 }}>
        <Typography variant="h4" gutterBottom>
          Featured Work
        </Typography>

        <Grid container spacing={3}>
          {PROJECTS.map((p, i) => (
            <Grid item xs={12} sm={6} md={3} key={p.title}>
              <Box
                component={motion.div}
                whileHover={{ scale: 1.03 }}
                onClick={() => handleOpen(p)}
                sx={{
                  height: 220, // ✅ uniform height
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 3,
                  cursor: "pointer",
                }}
              >
                {/* COVER IMAGE */}
                <Box
                  component="img"
                  src={
                    p.media?.[0]?.src || "https://via.placeholder.com/800x600"
                  }
                  sx={{
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
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                    display: "flex",
                    alignItems: "flex-end",
                    p: 2,
                  }}
                >
                  {/* <Typography>{p.title}</Typography> */}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ================= MODAL ================= */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullScreen
        PaperProps={{
          sx: {
            background: "#000",
          },
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
          }}
        >
          <Typography variant="h5">{activeProject?.title}</Typography>

          <IconButton onClick={() => setOpen(false)} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* MAIN MEDIA */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            px: 2,
          }}
        >
          {activeMedia?.type === "image" ? (
            <Box
              component="img"
              src={activeMedia.src}
              sx={{
                maxHeight: "80vh",
                maxWidth: "100%",
                borderRadius: 2,
              }}
            />
          ) : (
            <video
              controls
              style={{
                maxHeight: "80vh",
                maxWidth: "100%",
                borderRadius: "12px",
              }}
            >
              <source src={activeMedia.src} />
            </video>
          )}
        </Box>

        {/* THUMBNAILS */}
        <Stack
          direction="row"
          spacing={2}
          sx={{
            p: 2,
            overflowX: "auto",
          }}
        >
          {activeProject?.media.map((m, i) => (
            <Box
              key={i}
              onClick={() => setActiveIndex(i)}
              sx={{
                width: 100,
                height: 60,
                cursor: "pointer",
                opacity: i === activeIndex ? 1 : 0.5,
                borderRadius: 1,
                overflow: "hidden",
                border:
                  i === activeIndex
                    ? "2px solid #90caf9"
                    : "2px solid transparent",
              }}
            >
              {m.type === "image" ? (
                <img
                  src={m.src}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    background: "#111",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                  }}
                >
                  ▶
                </Box>
              )}
            </Box>
          ))}
        </Stack>
      </Dialog>
    </>
  );
}

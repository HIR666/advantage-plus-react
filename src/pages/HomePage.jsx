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

const IMAGES = [
  "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/JANNAT.jpg",
  "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/HAEDR.jpg",
  "https://ratback.tdelta.net/public/uzf/1/cwpgnpy9wdt/zahddraa.jpg",
];

export default function HomePage() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const i = setInterval(() => {
      setIndex((v) => (v + 1) % IMAGES.length);
    }, 3500);
    return () => clearInterval(i);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Grid container spacing={6} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h2" gutterBottom>
            Advantage+
            <br />
            Marketing & Production
            <br />
            <Box component="span" sx={{ color: "primary.main" }}>
              That Converts
            </Box>
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 4 }}>
            We create high-impact advertising campaigns, professional media
            production, and strategic brand communication across TV, digital,
            outdoor, and social platforms.
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button variant="contained" size="large">
              Start a Campaign
            </Button>
            <Button variant="outlined" size="large">
              View Work
            </Button>
          </Stack>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              height: 320,
              overflow: "hidden",
              position: "relative",
              background: "rgba(255,255,255,0.06)",
            }}
          >
            {IMAGES.map((src, i) => (
              <Box
                key={src}
                component={motion.img}
                src={src}
                initial={{ opacity: 0 }}
                animate={{ opacity: i === index ? 1 : 0 }}
                transition={{ duration: 0.8 }}
                sx={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ))}
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={4} sx={{ mt: 10 }}>
        {[
          "TV Commercials & Broadcasting",
          "Social Media Campaigns",
          "Billboards & Outdoor Advertising",
          "Brand Strategy & Identity",
          "Professional Video Production",
          "Digital & Performance Ads",
        ].map((s) => (
          <Grid item xs={12} md={4} key={s}>
            <Paper sx={{ p: 4, height: "100%" }}>
              <Typography variant="h6">{s}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

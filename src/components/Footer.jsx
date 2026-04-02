import {
  Box,
  Container,
  Typography,
  Stack,
  Link,
  Divider,
  IconButton,
} from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import Logo from "../assets/advantage_main_logo.png";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 10,
        pb: 6,
        background:
          "radial-gradient(800px 300px at 50% 100%, rgba(227,252,123,0.08), transparent 60%)",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            p: 4,
            borderRadius: 3,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(16px)",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={4}
            justifyContent="space-between"
          >
            {/* Brand */}
            <Box>
              {/* <Typography variant="h6">Advantage+</Typography> */}
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/")}
              >
                <Box
                  component="img"
                  src={Logo}
                  alt="Advantage+"
                  sx={{
                    height: 25,
                    userSelect: "none",
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ maxWidth: 280, mt: 1 }}
              >
                Full-service marketing & production agency delivering impactful
                campaigns across TV, digital, outdoor, and social media.
              </Typography>

              {/* Social Icons */}
              {/* <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
                <IconButton
                  color="inherit"
                  aria-label="Instagram"
                  href="https://instagram.com"
                  target="_blank"
                  sx={{
                    background: "rgba(255,255,255,0.06)",
                    "&:hover": {
                      background: "rgba(227,252,123,0.2)",
                    },
                  }}
                >
                  <InstagramIcon />
                </IconButton>

                <IconButton
                  color="inherit"
                  aria-label="Facebook"
                  href="https://facebook.com"
                  target="_blank"
                  sx={{
                    background: "rgba(255,255,255,0.06)",
                    "&:hover": {
                      background: "rgba(227,252,123,0.2)",
                    },
                  }}
                >
                  <FacebookIcon />
                </IconButton>

                <IconButton
                  color="inherit"
                  aria-label="X"
                  href="https://x.com"
                  target="_blank"
                  sx={{
                    background: "rgba(255,255,255,0.06)",
                    "&:hover": {
                      background: "rgba(227,252,123,0.2)",
                    },
                  }}
                >
                  <XIcon />
                </IconButton>
              </Stack> */}
            </Box>

            {/* Links */}
            <Stack spacing={1}>
              <Typography variant="subtitle2">Company</Typography>
              <Link underline="none" color="text.secondary" href="#">
                Services
              </Link>
              <Link underline="none" color="text.secondary" href="#">
                Work
              </Link>
              <Link underline="none" color="text.secondary" href="/contact">
                Contact
              </Link>
            </Stack>

            {/* Services */}
            <Stack spacing={1}>
              <Typography variant="subtitle2">Services</Typography>
              <Typography color="text.secondary">
                TV & Digital Commercials
              </Typography>
              <Typography color="text.secondary">
                Social Media Campaigns
              </Typography>
              <Typography color="text.secondary">
                Billboards & Outdoor Ads
              </Typography>
              <Typography color="text.secondary">
                Professional Media Production
              </Typography>
            </Stack>
          </Stack>

          <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.08)" }} />

          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Advantage+ Marketing Agency. All rights
            reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

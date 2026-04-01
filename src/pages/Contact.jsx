import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
} from "@mui/material";

export default function Contact() {
  return (
    <Box sx={{ minHeight: "100vh", pt: 10 }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: 5 }}>
          <Typography variant="h4" gutterBottom>
            Let’s Build Your Campaign
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Tell us about your brand, goals, and audience.
          </Typography>

          <Stack spacing={3}>
            <TextField label="Name" fullWidth />
            <TextField label="Email" fullWidth />
            <TextField label="Campaign Brief" multiline rows={4} fullWidth />
            <Button variant="contained" size="large">
              Send Inquiry
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

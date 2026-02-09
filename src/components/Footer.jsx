import { Box, Container, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box sx={{ py: 4, borderTop: "1px solid", borderColor: "divider" }}>
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Daniel Renard. Built with React + MUI.
        </Typography>
      </Container>
    </Box>
  );
}

import { Box, Container, Typography } from "@mui/material";

export default function Section({ id, title, subtitle, children }) {
  return (
    <Box id={id} component="section" sx={{ py: { xs: 6, md: 8 } }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 1 }}>
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {subtitle}
          </Typography>
        ) : null}
        {children}
      </Container>
    </Box>
  );
}

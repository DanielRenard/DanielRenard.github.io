import { Box, Container, Typography } from "@mui/material";

export default function Section({
  id,
  title,
  subtitle,
  variant = "default",
  children,
}) {
  return (
    <Box
      id={id}
      component="section"
      sx={{
        py: { xs: 6, md: 8 },
        ...(variant === "tintGreen"
          ? {
              background: (theme) =>
                theme.palette.mode === "light"
                  ? `linear-gradient(135deg, ${theme.palette.secondary.main}12, transparent)`
                  : `linear-gradient(135deg, ${theme.palette.secondary.main}22, transparent)`,
              borderTop: "1px solid",
              borderBottom: "1px solid",
              borderColor: "divider",
            }
          : {}),
      }}
    >
      <Container maxWidth="lg">
        {/* ✅ Anchor for comet + navbar scrolling */}
        <Typography
          id={`${id}-title`}
          variant="h4"
          sx={{
            mb: 1,
            // ✅ ensures the title doesn't hide under the sticky AppBar when scrolled to
            scrollMarginTop: { xs: "96px", md: "104px" },
          }}
        >
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

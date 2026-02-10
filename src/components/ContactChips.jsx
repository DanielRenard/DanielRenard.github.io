import { Chip, Stack, useTheme } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";
import YouTubeIcon from "@mui/icons-material/YouTube";

export default function ContactChips({ contact }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const open = (url) => window.open(url, "_blank", "noopener,noreferrer");

  // High-contrast chip styling (especially for dark mode)
  const chipSx = (kind) => {
    // kind: "primary" | "secondary" | "neutral"
    const bg =
      kind === "secondary"
        ? isDark
          ? "rgba(46,125,50,0.55)" // green
          : "rgba(46,125,50,0.10)"
        : kind === "primary"
          ? isDark
            ? "rgba(91,46,145,0.55)" // purple
            : "rgba(91,46,145,0.10)"
          : isDark
            ? "rgba(255,255,255,0.14)"
            : "rgba(0,0,0,0.04)";

    const border =
      kind === "secondary"
        ? isDark
          ? "rgba(46,125,50,0.95)"
          : "rgba(46,125,50,0.45)"
        : kind === "primary"
          ? isDark
            ? "rgba(188,160,255,0.95)"
            : "rgba(91,46,145,0.35)"
          : isDark
            ? "rgba(255,255,255,0.55)"
            : "rgba(0,0,0,0.18)";

    const fg =
      kind === "secondary"
        ? isDark
          ? "#E9F5EC"
          : theme.palette.secondary.main
        : kind === "primary"
          ? isDark
            ? "#F4EEFF"
            : theme.palette.primary.main
          : isDark
            ? "#FFFFFF"
            : theme.palette.text.primary;

    return {
      border: "1.5px solid",
      borderColor: border,
      backgroundColor: bg,
      color: fg,
      fontWeight: 700,
      // Make sure icons are readable too
      "& .MuiChip-icon": {
        color: fg,
        opacity: 0.95,
      },
      // Better hover/active contrast (clickable chips)
      "&:hover": {
        filter: isDark ? "brightness(1.08)" : "brightness(0.98)",
        transform: "translateY(-1px)",
      },
      transition: "transform 160ms ease, filter 160ms ease",
    };
  };

  return (
    <Stack
      direction="row"
      spacing={1}
      useFlexGap
      flexWrap="wrap"
      justifyContent={{ xs: "center", md: "flex-start" }}
    >
      <Chip
        icon={<LinkedInIcon />}
        label="LinkedIn"
        clickable
        onClick={() => open(contact.linkedin)}
        sx={chipSx("secondary")}
      />
      <Chip
        icon={<GitHubIcon />}
        label="GitHub"
        clickable
        onClick={() => open(contact.github)}
        sx={chipSx("primary")}
      />
      <Chip
        icon={<EmailIcon />}
        label="Email"
        clickable
        onClick={() => (window.location.href = `mailto:${contact.email}`)}
        sx={chipSx("secondary")}
      />
      <Chip
        icon={<YouTubeIcon />}
        label="YouTube"
        clickable
        onClick={() => open(contact.youtube)}
        sx={chipSx("primary")}
      />
    </Stack>
  );
}

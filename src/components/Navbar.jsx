import { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import MemoryIcon from "@mui/icons-material/Memory";

function smoothScrollTo(targetY, duration = 1200) {
  const startY = window.scrollY;
  const diff = targetY - startY;
  const startTime = performance.now();

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutCubic(progress);

    window.scrollTo(0, startY + diff * eased);

    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

const themeOptions = [
  { value: "light", label: "Light", icon: <LightModeIcon fontSize="small" /> },
  { value: "dark", label: "Dark", icon: <DarkModeIcon fontSize="small" /> },
  { value: "retro", label: "Retro", icon: <MemoryIcon fontSize="small" /> },
];

export default function Navbar({
  sections,
  themeName,
  onThemeChange,
  onNavigate,
}) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(sections?.[0]?.id ?? "top");

  const items = useMemo(
    () =>
      sections.map((s) => ({
        id: s.id,
        label: s.label,
      })),
    [sections],
  );

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 96;
    smoothScrollTo(y, 1800);
    setOpen(false);
  };

  useEffect(() => {
    const ids = sections.map((s) => s.id);
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0),
          )[0];

        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      {
        threshold: [0.2, 0.35, 0.5, 0.65],
        rootMargin: "-88px 0px -55% 0px",
      },
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [sections]);

  const isRetro = themeName === "retro";
  const isLight = themeName === "light";

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backdropFilter: isRetro ? "none" : "blur(10px)",
          backgroundColor: isRetro
            ? "rgba(0, 12, 4, 0.94)"
            : isLight
            ? "rgba(246, 244, 250, 0.78)"
            : "rgba(15, 11, 20, 0.72)",
          color: "text.primary",
          borderBottom: "1px solid",
          borderColor: "divider",
          boxShadow: isRetro ? "0 0 14px rgba(0,255,102,0.08)" : "none",
        }}
      >
        <Toolbar>
          <Container
            maxWidth="lg"
            sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                flexGrow: 1,
                letterSpacing: isRetro ? 1.4 : 0,
                textTransform: isRetro ? "uppercase" : "none",
              }}
            >
              Resume
            </Typography>

            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 0.5,
                alignItems: "center",
              }}
            >
              {items.map((it) => {
                const isActive = it.id === activeId;

                return (
                  <Button
                    key={it.id}
                    color="inherit"
                    onClick={(e) => {
                      onNavigate?.(it.id, { x: e.clientX, y: e.clientY });
                      scrollTo(it.id);
                    }}
                    sx={{
                      position: "relative",
                      px: 1.2,
                      borderRadius: isRetro ? 0 : 999,
                      transition:
                        "transform 180ms ease, background-color 180ms ease",
                      backgroundColor: isActive
                        ? isRetro
                          ? "rgba(0,255,102,0.10)"
                          : theme =>
                              theme.palette.mode === "light"
                                ? "rgba(46,125,50,0.10)"
                                : "rgba(46,125,50,0.18)"
                        : "transparent",
                      "&:hover": {
                        backgroundColor: isRetro
                          ? "rgba(0,255,102,0.08)"
                          : theme =>
                              theme.palette.mode === "light"
                                ? "rgba(91,46,145,0.08)"
                                : "rgba(188,160,255,0.10)",
                        transform: "translateY(-1px)",
                      },
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        left: 10,
                        right: 10,
                        bottom: 6,
                        height: 3,
                        borderRadius: isRetro ? 0 : 999,
                        background: theme =>
                          isRetro
                            ? "linear-gradient(90deg, rgba(0,255,102,0.2), #00ff66, rgba(0,255,102,0.2))"
                            : `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        transform: isActive ? "scaleX(1)" : "scaleX(0)",
                        transformOrigin: "left",
                        transition: "transform 220ms ease",
                      },
                    }}
                  >
                    {it.label}
                  </Button>
                );
              })}
            </Box>

            <Stack
              direction="row"
              spacing={0.5}
              sx={{
                display: { xs: "none", md: "flex" },
                ml: 1,
                p: 0.5,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: isRetro ? 0 : 999,
                backgroundColor: "background.paper",
              }}
            >
              {themeOptions.map((option) => {
                const selected = option.value === themeName;

                return (
                  <Button
                    key={option.value}
                    size="small"
                    color="inherit"
                    startIcon={option.icon}
                    onClick={() => onThemeChange(option.value)}
                    sx={{
                      minWidth: "auto",
                      px: 1.2,
                      borderRadius: isRetro ? 0 : 999,
                      border: selected ? "1px solid" : "1px solid transparent",
                      borderColor: selected ? "primary.main" : "transparent",
                      backgroundColor: selected
                        ? isRetro
                          ? "rgba(0,255,102,0.12)"
                          : "action.selected"
                        : "transparent",
                      textTransform: isRetro ? "uppercase" : "none",
                      letterSpacing: isRetro ? 0.8 : 0,
                    }}
                  >
                    {option.label}
                  </Button>
                );
              })}
            </Stack>

            <IconButton
              sx={{ display: { xs: "inline-flex", md: "none" } }}
              color="inherit"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon />
            </IconButton>
          </Container>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            width: 300,
            bgcolor: "background.paper",
            color: "text.primary",
            height: "100%",
            p: 1,
          }}
        >
          <Typography sx={{ px: 1, py: 1, fontWeight: 800 }}>
            Theme
          </Typography>

          <Stack direction="column" spacing={1} sx={{ px: 1, pb: 2 }}>
            {themeOptions.map((option) => {
              const selected = option.value === themeName;

              return (
                <Button
                  key={option.value}
                  fullWidth
                  color="inherit"
                  startIcon={option.icon}
                  onClick={() => onThemeChange(option.value)}
                  sx={{
                    justifyContent: "flex-start",
                    borderRadius: isRetro ? 0 : 2,
                    border: "1px solid",
                    borderColor: selected ? "primary.main" : "divider",
                    backgroundColor: selected
                      ? isRetro
                        ? "rgba(0,255,102,0.12)"
                        : "action.selected"
                      : "transparent",
                    textTransform: isRetro ? "uppercase" : "none",
                  }}
                >
                  {option.label}
                </Button>
              );
            })}
          </Stack>

          <List>
            {items.map((it) => (
              <ListItemButton
                key={it.id}
                onClick={() => scrollTo(it.id)}
                selected={it.id === activeId}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor:
                      themeName === "retro"
                        ? "rgba(0,255,102,0.12)"
                        : "rgba(46,125,50,0.12)",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor:
                      themeName === "retro"
                        ? "rgba(0,255,102,0.18)"
                        : "rgba(46,125,50,0.18)",
                  },
                }}
              >
                <ListItemText primary={it.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
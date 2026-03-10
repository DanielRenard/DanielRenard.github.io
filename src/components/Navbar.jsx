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
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import MemoryIcon from "@mui/icons-material/Memory";
import Tooltip from "@mui/material/Tooltip";

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

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

export default function Navbar({ sections, mode, onToggleMode, onNavigate }) {
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

  const toggleTitle =
    mode === "light"
      ? "Switch to dark mode"
      : mode === "dark"
      ? "Switch to retro mode"
      : "Switch to light mode";

  const toggleIcon =
    mode === "light" ? (
      <DarkModeIcon />
    ) : mode === "dark" ? (
      <MemoryIcon />
    ) : (
      <LightModeIcon />
    );

  const isRetro = mode === "retro";
  const isLight = mode === "light";

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backdropFilter: isRetro ? "none" : "blur(10px)",
          backgroundColor: (theme) =>
            isRetro
              ? "rgba(0, 12, 4, 0.94)"
              : isLight
              ? "rgba(246, 244, 250, 0.78)"
              : "rgba(15, 11, 20, 0.72)",
          color: "text.primary",
          borderBottom: isRetro ? "1px solid rgba(0,255,102,0.28)" : undefined,
          boxShadow: isRetro ? "0 0 14px rgba(0,255,102,0.08)" : "none",
        }}
      >
        <Toolbar sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
          <Container
            maxWidth="lg"
            sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                flexGrow: 1,
                letterSpacing: isRetro ? 1.5 : 0,
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
                        ? (theme) =>
                            isRetro
                              ? "rgba(0,255,102,0.10)"
                              : theme.palette.mode === "light"
                              ? "rgba(46,125,50,0.10)"
                              : "rgba(46,125,50,0.18)"
                        : "transparent",
                      "&:hover": {
                        backgroundColor: (theme) =>
                          isRetro
                            ? "rgba(0,255,102,0.08)"
                            : theme.palette.mode === "light"
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
                        background: (theme) =>
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

            <Tooltip title={toggleTitle}>
              <IconButton
                color="inherit"
                onClick={onToggleMode}
                sx={{
                  ml: 0.5,
                  border: "1px solid",
                  borderColor: isRetro ? "primary.main" : "divider",
                  borderRadius: isRetro ? 0 : 999,
                  boxShadow: isRetro
                    ? "0 0 10px rgba(0,255,102,0.08)"
                    : "none",
                }}
                aria-label="Toggle theme"
              >
                {toggleIcon}
              </IconButton>
            </Tooltip>

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
            width: 280,
            bgcolor: "background.paper",
            color: "text.primary",
            height: "100%",
          }}
        >
          <List>
            {items.map((it) => (
              <ListItemButton
                key={it.id}
                onClick={() => scrollTo(it.id)}
                selected={it.id === activeId}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor:
                      mode === "retro"
                        ? "rgba(0,255,102,0.12)"
                        : "rgba(46,125,50,0.12)",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor:
                      mode === "retro"
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
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
import Tooltip from "@mui/material/Tooltip";

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
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  // ✅ Track which section is currently visible
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
        // Adjust for sticky navbar height so "active" feels right
        rootMargin: "-88px 0px -55% 0px",
      },
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [sections]);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backdropFilter: "blur(10px)",
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? "rgba(246, 244, 250, 0.78)"
              : "rgba(15, 11, 20, 0.72)",
          color: "text.primary",
        }}
      >
        <Toolbar sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
          <Container
            maxWidth="lg"
            sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 900, flexGrow: 1 }}>
              Resume
            </Typography>

            {/* Desktop nav */}
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
                      borderRadius: 999,
                      transition:
                        "transform 180ms ease, background-color 180ms ease",
                      backgroundColor: isActive
                        ? (theme) =>
                            theme.palette.mode === "light"
                              ? "rgba(46,125,50,0.10)" // green tint (light)
                              : "rgba(46,125,50,0.18)" // green tint (dark)
                        : "transparent",
                      "&:hover": {
                        backgroundColor: (theme) =>
                          theme.palette.mode === "light"
                            ? "rgba(91,46,145,0.08)" // purple tint hover
                            : "rgba(188,160,255,0.10)",
                        transform: "translateY(-1px)",
                      },
                      // ✅ Animated underline using theme primary→secondary gradient
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        left: 10,
                        right: 10,
                        bottom: 6,
                        height: 3,
                        borderRadius: 999,
                        background: (theme) =>
                          `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
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

            {/* Dark mode toggle */}
            <Tooltip
              title={
                mode === "dark" ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              <IconButton
                color="inherit"
                onClick={onToggleMode}
                sx={{
                  ml: 0.5,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 999,
                }}
                aria-label="Toggle dark mode"
              >
                {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

            {/* Mobile menu button (you were missing this) */}
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

      {/* Mobile drawer */}
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 280 }}>
          <List>
            {items.map((it) => (
              <ListItemButton
                key={it.id}
                onClick={() => scrollTo(it.id)}
                selected={it.id === activeId}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "rgba(46,125,50,0.12)", // green tint
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "rgba(46,125,50,0.18)",
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

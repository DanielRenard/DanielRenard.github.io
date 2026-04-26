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
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

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
  {
    value: "lisaFrank",
    label: "Lisa",
    icon: <AutoAwesomeIcon fontSize="small" />,
  },
  { value: "retro", label: "Retro", icon: <MemoryIcon fontSize="small" /> },
];

const NAV_OFFSET = 96;
const ACTIVE_OFFSET = 120;

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

    const y = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    smoothScrollTo(y, 1800);
    setOpen(false);
  };

  useEffect(() => {
    const getSectionPositions = () =>
      sections
        .map((s) => {
          const el = document.getElementById(s.id);
          if (!el) return null;

          return {
            id: s.id,
            top: el.offsetTop,
          };
        })
        .filter(Boolean);

    let ticking = false;

    const updateActiveSection = () => {
      const sectionPositions = getSectionPositions();

      if (!sectionPositions.length) {
        ticking = false;
        return;
      }

      const scrollPosition = window.scrollY + ACTIVE_OFFSET;

      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 8;

      if (nearBottom) {
        setActiveId(sectionPositions[sectionPositions.length - 1].id);
        ticking = false;
        return;
      }

      let current = sectionPositions[0].id;

      for (const section of sectionPositions) {
        if (scrollPosition >= section.top) {
          current = section.id;
        } else {
          break;
        }
      }

      setActiveId(current);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateActiveSection);
        ticking = true;
      }
    };

    updateActiveSection();
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [sections]);

  const isRetro = themeName === "retro";
  const isLight = themeName === "light";
  const isLisa = themeName === "lisaFrank";

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          color: "primary.contrastText",
        }}
      >
        <Toolbar
          sx={{
            py: 1,
            alignItems: "center",
            flexWrap: "wrap",
            height: "auto",
            minHeight: "unset",
          }}
        >
          <Container
            maxWidth="lg"
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              rowGap: 1,
              columnGap: 1.5,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                flexShrink: 0,
                mr: "auto",
                letterSpacing: isRetro ? 1.4 : 0,
                textTransform: isRetro ? "uppercase" : "none",
              }}
            >
              Renard
            </Typography>

            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                gap: 0.5,
                alignItems: "center",
                justifyContent: "center",
                flexGrow: 1,
                minWidth: "fit-content",
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
                          : (theme) =>
                              theme.palette.mode === "light"
                                ? "rgba(46,125,50,0.10)"
                                : "rgba(46,125,50,0.18)"
                        : "transparent",
                      "&:hover": {
                        backgroundColor: isRetro
                          ? "rgba(0,255,102,0.08)"
                          : (theme) =>
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

            <Stack
              direction="row"
              spacing={0.5}
              flexWrap="wrap"
              justifyContent="center"
              sx={{
                display: { xs: "none", sm: "flex" },
                flexShrink: 0,
                /* desktop position */
                ml: "auto",

                /* center when pills wrap onto new row */
                "@media (max-width:1226px)": {
                  order: 3,
                  flexBasis: "100%",
                  ml: 0,
                  mt: 1,
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                },

                p: 0.5,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: isRetro ? 0 : 999,
                backgroundColor: (theme) =>
                  theme.palette.mode === "light"
                    ? "rgba(91,46,145,0.25)"
                    : "rgba(255,255,255,0.06)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 0 12px rgba(0,0,0,0.15)",
                "@media (max-width:600px)": {
                  transform: "scale(0.9)",
                  gap: 0.25,
                  p: 0.25,
                },
                "@media (max-width:299px)": {
                  width: 220,
                },
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
                    sx={(theme) => ({
                      minWidth: "auto",

                      /* NORMAL SIZE */
                      px: isRetro ? 1.4 : 1.2,
                      py: isRetro ? 0.6 : 0.4,
                      fontSize: isRetro ? "0.85rem" : "0.8rem",

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

                      "& .MuiSvgIcon-root": {
                        fontSize: isRetro ? "1rem" : "0.95rem",
                      },
                      [theme.breakpoints.down("sm")]: {
                        px: 0.7,
                        py: 0.2,
                        fontSize: "0.65rem",
                        letterSpacing: isRetro ? 0.4 : 0,

                        "& .MuiSvgIcon-root": {
                          fontSize: "0.85rem",
                          marginRight: "4px",
                        },
                      },
                    })}
                  >
                    {option.label}
                  </Button>
                );
              })}
            </Stack>

            <IconButton
              sx={{
                display: { xs: "inline-flex", sm: "none" },
              }}
              color="inherit"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon />
            </IconButton>
          </Container>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            pt: { xs: "110px", sm: "64px" },
          },
        }}
      >
        <Box
          sx={{
            width: 300,
            bgcolor: "background.paper",
            color: "text.primary",
            height: "100%",
            p: 1,
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

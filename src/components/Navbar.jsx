import { useMemo, useState } from "react";
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

export default function Navbar({ sections }) {
  const [open, setOpen] = useState(false);

  const items = useMemo(
    () =>
      sections.map((s) => ({
        id: s.id,
        label: s.label,
      })),
    [sections]
  );

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{ backdropFilter: "blur(8px)" }}>
        <Toolbar sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
          <Container
            maxWidth="lg"
            sx={{ display: "flex", alignItems: "center", gap: 2 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 900, flexGrow: 1 }}>
              Resume
            </Typography>

            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
              {items.map((it) => (
                <Button
                  key={it.id}
                  color="inherit"
                  onClick={() => scrollTo(it.id)}
                >
                  {it.label}
                </Button>
              ))}
            </Box>

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
        <Box sx={{ width: 280 }}>
          <List>
            {items.map((it) => (
              <ListItemButton key={it.id} onClick={() => scrollTo(it.id)}>
                <ListItemText primary={it.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}

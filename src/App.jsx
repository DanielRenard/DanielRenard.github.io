import React from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { Grid } from "@mui/material";
import { ThemeProvider, useMediaQuery } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import Navbar from "./components/Navbar";
import Section from "./components/Section";
import Footer from "./components/Footer";
import ContactChips from "./components/ContactChips";
import YoutubeEmbed from "./components/YoutubeEmbed";
import CometLayer from "./components/CometLayer";

import { getTheme } from "./theme";

import * as content from "./content";

const {
  profile = {},
  education = [],
  training = [],
  projects = [],
  experience = [],
  contact = {},
} = content;

export default function App() {
  const sections = [
    { id: "top", label: "Home" },
    { id: "about", label: "About" },
    { id: "education", label: "Education" },
    { id: "projects", label: "Projects" },
    { id: "experience", label: "Experience" },
    { id: "youtube", label: "YouTube" },
    { id: "contact", label: "Contact" },
  ];

  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");

  const [themeName, setThemeName] = React.useState(() => {
    const saved = localStorage.getItem("themeMode");
    return saved ? saved : prefersDark ? "dark" : "light";
  });

  React.useEffect(() => {
    localStorage.setItem("themeMode", themeName);
  }, [themeName]);

  const theme = React.useMemo(() => getTheme(themeName), [themeName]);

  const avatarRef = React.useRef(null);
  const [cometEvent, setCometEvent] = React.useState(null);

  const getCenter = (el) => {
    const r = el?.getBoundingClientRect?.();
    if (!r) return null;
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };

  const handleNavigate = (sectionId, clickPos) => {
    const targetEl = document.getElementById(sectionId);
    if (!targetEl) return;

    const r = targetEl.getBoundingClientRect();

    const end = {
      x: r.left + 24,
      y: r.top + 24,
    };

    const avatarCenter = getCenter(avatarRef.current);

    const start =
      clickPos && window.innerWidth >= 900
        ? clickPos
        : avatarCenter ?? clickPos ?? { x: 24, y: 24 };

    setCometEvent({
      start,
      targetId: sectionId,
      id: `${sectionId}-${Date.now()}`,
    });
  };

  const handleToggleTheme = () => {
    setThemeName((prev) => {
      if (prev === "light") return "dark";
      if (prev === "dark") return "retro";
      return "light";
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
        }}
      >
        <CometLayer event={cometEvent} zIndex={2} />

        <Navbar
          sections={sections}
          mode={themeName}
          onToggleMode={handleToggleTheme}
          onNavigate={handleNavigate}
        />

        {/* HERO */}
        <Box
          id="top"
          sx={{
            py: { xs: 6, md: 9 },
            background: (t) =>
              themeName === "retro"
                ? `linear-gradient(180deg, rgba(0,255,102,0.08), rgba(0,0,0,0.12))`
                : `linear-gradient(135deg, ${t.palette.primary.main}12, ${t.palette.secondary.main}12)`,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid size={{ xs: 12, md: 4 }}>
                <Stack
                  alignItems={{ xs: "center", md: "flex-start" }}
                  spacing={2}
                >
                  <Avatar
                    alt="my photo"
                    src="/images/dan.jpeg"
                    ref={avatarRef}
                    sx={{
                      width: 180,
                      height: 180,
                      border: "3px solid",
                      borderColor:
                        themeName === "retro" ? "primary.main" : "secondary.main",
                      boxShadow:
                        themeName === "retro"
                          ? "0 0 18px rgba(0,255,102,0.22)"
                          : "none",
                      filter: themeName === "retro" ? "grayscale(0.2)" : "none",
                    }}
                  />
                  <ContactChips contact={contact} />
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 8 }}>
                <Stack spacing={1.5} textAlign={{ xs: "center", md: "left" }}>
                  <Typography
                    variant="h2"
                    sx={{ fontSize: { xs: 40, md: 56 } }}
                  >
                    {profile.name}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {profile.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ maxWidth: 720, mx: { xs: "auto", md: 0 } }}
                  >
                    {profile.blurb}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent={{ xs: "center", md: "flex-start" }}
                    useFlexGap
                    flexWrap="wrap"
                    sx={{ pt: 1 }}
                  >
                    <Chip
                      label={profile.location}
                      variant="outlined"
                      color="secondary"
                    />
                    <Chip
                      label="Open to roles"
                      variant="outlined"
                      color="primary"
                    />
                    <Chip
                      label="Remote / Hybrid / Onsite"
                      variant="outlined"
                      color="secondary"
                    />
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </Box>

        <Section
          id="about"
          title="About Me"
          subtitle="What I've Been Up To:"
          variant="tintGreen"
        >
          <Card variant="outlined">
            <CardContent>
              <Divider
                sx={{
                  mb: 2,
                  width: 80,
                  borderBottomWidth: 4,
                  borderColor: "secondary.main",
                  borderRadius: themeName === "retro" ? 0 : 999,
                }}
              />
              <Typography>
                With 7 years of experience in Television Broadcasting, a
                master’s degree in History, and a professional background in
                education and library services, I bring a unique ability to
                engage diverse audiences and communicate complex ideas clearly.
                My academic and library experience have strengthened my
                research, information management, and community engagement
                skills—key to fostering curiosity and lifelong learning. Having
                also transitioned into Software Engineering through a UTS
                industry-accredited Certificate focused on practical,
                project-based learning, I combine technical literacy with strong
                communication and analytical abilities. Whether in the
                classroom, library, or digital learning environment, I strive to
                create inclusive, dynamic spaces that support discovery,
                critical thinking, and personal growth.
              </Typography>
            </CardContent>
          </Card>
        </Section>

        <Section
          id="education"
          title="Education & Training"
          subtitle="Degrees, certifications"
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 800 }}>
                Education
              </Typography>
              <Divider
                sx={{
                  mb: 2,
                  width: 64,
                  borderBottomWidth: 4,
                  borderColor: "secondary.main",
                  borderRadius: themeName === "retro" ? 0 : 999,
                }}
              />
              <Stack spacing={2}>
                {education.map((e, idx) => (
                  <Card key={idx} variant="outlined">
                    <CardContent>
                      <Typography sx={{ fontWeight: 800 }}>
                        {e.credential} — {e.school}
                      </Typography>
                      <Typography color="text.secondary">{e.dates}</Typography>
                      <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
                        {(e.details ?? []).map((d, i) => (
                          <li key={i}>
                            <Typography variant="body2">{d}</Typography>
                          </li>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 800 }}>
                Training
              </Typography>
              <Divider
                sx={{
                  mb: 2,
                  width: 64,
                  borderBottomWidth: 4,
                  borderColor: "secondary.main",
                  borderRadius: themeName === "retro" ? 0 : 999,
                }}
              />
              <Stack spacing={2}>
                {training.map((t, idx) => (
                  <Card key={idx} variant="outlined">
                    <CardContent>
                      <Typography sx={{ fontWeight: 800 }}>
                        {t.program} — {t.org}
                      </Typography>
                      <Typography color="text.secondary">{t.dates}</Typography>
                      <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
                        {(t.details ?? []).map((d, i) => (
                          <li key={i}>
                            <Typography variant="body2">{d}</Typography>
                          </li>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Section>

        <Section
          id="projects"
          title="Projects"
          subtitle="A Few Things I'm Proud Of:"
          variant="tintGreen"
        >
          <Grid container spacing={2}>
            {projects.map((p, idx) => (
              <Grid size={{ xs: 12, md: 6 }} key={idx}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      {p.name}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 1 }}>
                      {p.description}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={1}
                      useFlexGap
                      flexWrap="wrap"
                      sx={{ mb: 2 }}
                    >
                      {(p.tech ?? []).map((t, i) => (
                        <Chip
                          key={`${t}-${i}`}
                          label={t}
                          size="small"
                          variant="outlined"
                          color={i % 3 === 0 ? "secondary" : "primary"}
                        />
                      ))}
                    </Stack>

                    <Stack
                      direction="row"
                      spacing={1}
                      useFlexGap
                      flexWrap="wrap"
                    >
                      {(p.links ?? []).map((l, i) => (
                        <Button
                          key={l.href}
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          endIcon={<OpenInNewIcon />}
                          variant={i === 0 ? "contained" : "outlined"}
                          color={i % 2 === 0 ? "primary" : "secondary"}
                        >
                          {l.label}
                        </Button>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Section>

        <Section
          id="experience"
          title="Work Experience"
          subtitle="Roles + Outcomes:"
        >
          <Stack spacing={2}>
            {experience.map((x, idx) => (
              <Card key={idx} variant="outlined">
                <CardContent>
                  <Typography sx={{ fontWeight: 900 }}>
                    {x.role} — {x.company}
                  </Typography>
                  <Typography color="text.secondary">{x.dates}</Typography>
                  <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
                    {(x.bullets ?? []).map((b, i) => (
                      <li key={i}>
                        <Typography variant="body2">{b}</Typography>
                      </li>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Section>

        <Section
          id="youtube"
          title="YouTube Playlist"
          subtitle="This playlist features some of my production experiences. This includes the 2023 Louisiana Gornernor Debate, interviews shot with a robotic camera setup in a small studio, and short documentaries from my time in film school."
          variant="tintGreen"
        >
          <YoutubeEmbed playlistId={contact.youtubePlaylistId} />
        </Section>

        <Section
          id="contact"
          title="Contact"
          subtitle="Learn More About Me:"
          variant="tintGreen"
        >
          <Stack spacing={2}>
            <ContactChips contact={contact} />
            <Typography color="text.secondary">
              The best way to contact me is through email.
            </Typography>
          </Stack>
        </Section>

        <Footer />
      </Box>
    </ThemeProvider>
  );
}
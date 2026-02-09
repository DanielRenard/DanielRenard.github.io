import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Navbar from "./components/Navbar";
import Section from "./components/Section";
import Footer from "./components/Footer";
import ContactChips from "./components/ContactChips";
import YoutubeEmbed from "./components/YoutubeEmbed";

import {
  profile,
  education,
  training,
  projects,
  experience,
  contact,
} from "./content";

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

  return (
    <>
      <Navbar sections={sections} />

      {/* HERO */}
      <Box id="top" sx={{ py: { xs: 6, md: 9 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={4}>
              <Stack
                alignItems={{ xs: "center", md: "flex-start" }}
                spacing={2}
              >
                <Avatar
                  alt="my photo"
                  src="/images/dan.jpeg"
                  sx={{ width: 180, height: 180 }}
                />
                <ContactChips contact={contact} />
              </Stack>
            </Grid>

            <Grid item xs={12} md={8}>
              <Stack spacing={1.5} textAlign={{ xs: "center", md: "left" }}>
                <Typography variant="h2" sx={{ fontSize: { xs: 40, md: 56 } }}>
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
                  <Chip label={profile.location} variant="outlined" />
                  <Chip label="Open to roles" variant="outlined" />
                  <Chip label="Remote / Hybrid" variant="outlined" />
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ABOUT */}
      <Section id="about" title="About Me" subtitle="What I've Been Up To:">
        <Card variant="outlined">
          <CardContent>
            <Typography>
              With 7 years of experience in Television Broadcasting, a master’s
              degree in History, and a professional background in education and
              library services, I bring a unique ability to engage diverse
              audiences and communicate complex ideas clearly. My academic and
              library experience have strengthened my research, information
              management, and community engagement skills—key to fostering
              curiosity and lifelong learning. Having also transitioned into
              Software Engineering through a UTS industry-accredited Certificate
              focused on practical, project-based learning, I combine technical
              literacy with strong communication and analytical abilities.
              Whether in the classroom, library, or digital learning
              environment, I strive to create inclusive, dynamic spaces that
              support discovery, critical thinking, and personal growth.
            </Typography>
          </CardContent>
        </Card>
      </Section>

      {/* EDUCATION & TRAINING */}
      <Section
        id="education"
        title="Education & Training"
        subtitle="Degrees, certifications"
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 800 }}>
              Education
            </Typography>
            <Stack spacing={2}>
              {education.map((e, idx) => (
                <Card key={idx} variant="outlined">
                  <CardContent>
                    <Typography sx={{ fontWeight: 800 }}>
                      {e.credential} — {e.school}
                    </Typography>
                    <Typography color="text.secondary">{e.dates}</Typography>
                    <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
                      {e.details.map((d, i) => (
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

          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 800 }}>
              Training
            </Typography>
            <Stack spacing={2}>
              {training.map((t, idx) => (
                <Card key={idx} variant="outlined">
                  <CardContent>
                    <Typography sx={{ fontWeight: 800 }}>
                      {t.program} — {t.org}
                    </Typography>
                    <Typography color="text.secondary">{t.dates}</Typography>
                    <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
                      {t.details.map((d, i) => (
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

      {/* PROJECTS */}
      <Section
        id="projects"
        title="Projects"
        subtitle="A Few Things I'm Proud Of:"
      >
        <Grid container spacing={2}>
          {projects.map((p, idx) => (
            <Grid item xs={12} md={6} key={idx}>
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
                    {p.tech.map((t) => (
                      <Chip key={t} label={t} size="small" variant="outlined" />
                    ))}
                  </Stack>

                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    {p.links.map((l) => (
                      <Button
                        key={l.href}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        endIcon={<OpenInNewIcon />}
                        variant="contained"
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

      {/* EXPERIENCE */}
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
                  {x.bullets.map((b, i) => (
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

      {/* YOUTUBE */}
      <Section
        id="youtube"
        title="YouTube Playlist"
        subtitle="This playlist features some of my production experiences. This includes the 2023 Louisiana Gornernor Debate, interviews shot with a robotic camera setup in a small studio, and short documentaries from my time in film school."
      >
        <YoutubeEmbed playlistId={contact.youtubePlaylistId} />
      </Section>

      {/* CONTACT */}
      <Section
        id="contact"
        title="Contact"
        subtitle="Learn More About Me:"
      >
        <Stack spacing={2}>
          <ContactChips contact={contact} />
          <Typography color="text.secondary">
            The best way to contact me is through email.
          </Typography>
        </Stack>
      </Section>

      <Footer />
    </>
  );
}

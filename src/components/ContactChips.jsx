import { Chip, Stack } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";

export default function ContactChips({ contact }) {
  const open = (href) => window.open(href, "_blank", "noopener,noreferrer");

  return (
    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
      <Chip
        icon={<LinkedInIcon />}
        label="LinkedIn"
        clickable
        onClick={() => open(contact.linkedin)}
        variant="outlined"
      />
      <Chip
        icon={<GitHubIcon />}
        label="GitHub"
        clickable
        onClick={() => open(contact.github)}
        variant="outlined"
      />
      <Chip
        icon={<EmailIcon />}
        label="Email"
        clickable
        onClick={() => (window.location.href = `mailto:${contact.email}`)}
        variant="outlined"
      />
      <Chip
        icon={<YouTubeIcon />}
        label="YouTube"
        clickable
        onClick={() => open(contact.youtube)}
        variant="outlined"
      />
    </Stack>
  );
}

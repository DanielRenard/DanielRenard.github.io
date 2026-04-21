// YoutubePlayer.jsx
import { Box } from "@mui/material";

export default function YoutubePlayer({ videoId, onEnd }) {
  return (
    <Box sx={{ position:"relative", pt:"56.25%" }}>
      <Box
        component="iframe"
        src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
        sx={{ position:"absolute", inset:0, width:"100%", height:"100%", border:0 }}
        allow="autoplay"
        allowFullScreen
        id="yt-player"
      />
    </Box>
  );
}
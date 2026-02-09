import { Box } from "@mui/material";

// Playlist embed: https://www.youtube.com/embed/videoseries?list=PLAYLIST_ID
export default function YoutubeEmbed({ playlistId }) {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        pt: "56.25%", // 16:9
      }}
    >
      <Box
        component="iframe"
        title="YouTube Playlist"
        src={`https://www.youtube.com/embed/videoseries?list=${playlistId}`}
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          border: 0,
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </Box>
  );
}

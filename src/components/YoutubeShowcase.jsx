import { useState, useEffect } from "react";
import { videos } from "../content";
import YoutubePlayer from "./YoutubePlayer";
import VideoCarousel from "./VideoCarousel";
import { Box } from "@mui/material";

export default function YoutubeShowcase() {
  const [currentVideo, setCurrentVideo] = useState(videos[0].id);

  const playNext = () => {
    const index = videos.findIndex(v => v.id === currentVideo);
    const next = (index + 1) % videos.length;
    setCurrentVideo(videos[next].id);
  };

  // ✅ keyboard navigation must live INSIDE component
  useEffect(() => {
    const handleKey = (e) => {
      const index = videos.findIndex(v => v.id === currentVideo);

      if (e.key === "ArrowRight") {
        setCurrentVideo(videos[(index + 1) % videos.length].id);
      }

      if (e.key === "ArrowLeft") {
        setCurrentVideo(videos[(index - 1 + videos.length) % videos.length].id);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentVideo]);

  return (
    <Box>
      <YoutubePlayer videoId={currentVideo} onEnd={playNext} />

      <VideoCarousel
        videos={videos}
        current={currentVideo}
        onSelect={setCurrentVideo}
      />
    </Box>
  );
}
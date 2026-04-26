import { Box, Typography, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useRef } from "react";
import { motion } from "framer-motion";

export default function VideoCarousel({ videos, current, onSelect }) {
  const scrollRef = useRef();

  const scroll = (dir) => {
    scrollRef.current.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  const getCarouselScrollbar = (theme) => {
    const neon = theme.palette.primary.main === "#00FF66";
    const dark = theme.palette.mode === "dark";

    return {
      /* Fade scrollbar until interaction */
      opacity: 0.6,
      transition: "opacity .3s",
      "&:hover": {
        opacity: 1,
      },

      /* Firefox */
      scrollbarWidth: "thin",
      scrollbarColor: `${theme.palette.primary.main} transparent`,

      /* WebKit */
      "&::-webkit-scrollbar": {
        height: 10,
      },

      "&::-webkit-scrollbar-track": {
        background: "transparent",
        marginInline: 40, // leaves space near arrows 👌
      },

      "&::-webkit-scrollbar-thumb": {
        borderRadius: 20,
        background: dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.25)",
        border: "2px solid transparent",
        backgroundClip: "padding-box",
        transition: "all .25s ease",
      },

      /* Hover — becomes primary color */
      "&:hover::-webkit-scrollbar-thumb": {
        background: theme.palette.primary.main,
      },

      /* Active dragging */
      "&::-webkit-scrollbar-thumb:active": {
        background: theme.palette.primary.dark,
      },

      /* Neon theme glow */
      ...(neon && {
        "&:hover::-webkit-scrollbar-thumb": {
          background: "#00FF66",
          boxShadow: "0 0 10px rgba(0,255,102,0.7)",
        },
        "&::-webkit-scrollbar-thumb:active": {
          background: "#00e65c",
          boxShadow: "0 0 14px rgba(0,255,102,0.9)",
        },
      }),
    };
  };

  return (
    <Box sx={{ position: "relative", mt: 2 }}>
      {/* LEFT ARROW */}
      <IconButton
        onClick={() => scroll("left")}
        sx={(theme) => ({
          position: "absolute",
          left: -28,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          width: 48,
          height: 48,
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(255,255,255,0.08)",
          border: "1px solid",
          borderColor: "divider",
          boxShadow:
            theme.palette.mode === "light"
              ? "0 6px 18px rgba(0,0,0,0.15)"
              : "0 6px 18px rgba(0,0,0,0.6)",
          "& svg": { fontSize: 28, color: "primary.main" },
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.18)",
            transform: "translateY(-50%) scale(1.1)",
          },
          ...(theme.palette.primary.main === "#00FF66" && {
            boxShadow: "0 0 14px rgba(0,255,102,0.35)",
            backgroundColor: "rgba(0,255,102,0.08)",
            "&:hover": {
              backgroundColor: "rgba(0,255,102,0.18)",
              boxShadow: "0 0 18px rgba(0,255,102,0.55)",
            },
          }),
        })}
      >
        <ChevronLeft />
      </IconButton>

      {/* CAROUSEL STRIP */}
      <Box
        ref={scrollRef}
        sx={(theme) => ({
          display: "flex",
          gap: 2,
          overflowX: "auto",
          py: 2,
          px: 1,
          scrollBehavior: "smooth",

          /* snap makes scroll feel premium */
          scrollSnapType: "x mandatory",

          /* fade edges (super modern) */
          maskImage:
            "linear-gradient(to right, transparent, black 40px, black calc(100% - 40px), transparent)",

          ...getCarouselScrollbar(theme),
        })}
      >
        {videos.map((video) => {
          const active = video.id === current;

          return (
            <motion.div
              key={video.id}
              animate={active ? { scale: [1, 1.04, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              style={{
                minWidth: 220,
                scrollSnapAlign: "start",
              }}
            >
              <Box
                onClick={() => onSelect(video.id)}
                sx={(theme) => ({
                  position: "relative",
                  borderRadius: 2,
                  overflow: "hidden",
                  cursor: "pointer",
                  border: active
                    ? `3px solid ${theme.palette.primary.main}`
                    : "2px solid transparent",
                  boxShadow: active
                    ? `0 0 0 2px rgba(255,255,255,0.15),
                       0 0 18px ${theme.palette.primary.main}55`
                    : "none",
                  ...(theme.palette.primary.main === "#00FF66" &&
                    active && {
                      boxShadow:
                        "0 0 0 1px rgba(0,255,102,0.4), 0 0 20px rgba(0,255,102,0.6)",
                    }),
                })}
              >
                {/* NOW PLAYING BADGE */}
                {active && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ position: "absolute", top: 8, left: 8, zIndex: 2 }}
                  >
                    <Box
                      sx={(theme) => ({
                        px: 1,
                        py: 0.3,
                        fontSize: 11,
                        fontWeight: 700,
                        borderRadius: 1,
                        letterSpacing: 0.6,
                        background: theme.palette.primary.main,
                        color: "#fff",
                        ...(theme.palette.primary.main === "#00FF66" && {
                          color: "#021a07",
                          boxShadow: "0 0 10px rgba(0,255,102,0.7)",
                        }),
                      })}
                    >
                      NOW PLAYING
                    </Box>
                  </motion.div>
                )}

                <img src={video.thumbnail} width="100%" />
                <Typography sx={{ p: 1, fontSize: 14 }}>
                  {video.title}
                </Typography>
              </Box>
            </motion.div>
          );
        })}
      </Box>

      {/* RIGHT ARROW */}
      <IconButton
        onClick={() => scroll("right")}
        sx={(theme) => ({
          position: "absolute",
          right: -28,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          width: 48,
          height: 48,
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(255,255,255,0.08)",
          border: "1px solid",
          borderColor: "divider",
          boxShadow:
            theme.palette.mode === "light"
              ? "0 6px 18px rgba(0,0,0,0.15)"
              : "0 6px 18px rgba(0,0,0,0.6)",
          "& svg": { fontSize: 28, color: "primary.main" },
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.18)",
            transform: "translateY(-50%) scale(1.1)",
          },
          ...(theme.palette.primary.main === "#00FF66" && {
            boxShadow: "0 0 14px rgba(0,255,102,0.35)",
            backgroundColor: "rgba(0,255,102,0.08)",
            "&:hover": {
              backgroundColor: "rgba(0,255,102,0.18)",
              boxShadow: "0 0 18px rgba(0,255,102,0.55)",
            },
          }),
        })}
      >
        <ChevronRight />
      </IconButton>
    </Box>
  );
}

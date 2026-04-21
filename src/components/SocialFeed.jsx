import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardActionArea,
  Dialog,
  DialogContent,
  IconButton,
  Fade,
  Skeleton,
  Chip,
  Tabs,
  Tab,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const TUMBLR_RSS = "https://djrenard.tumblr.com/rss";
const RSS_TO_JSON = `https://api.rss2json.com/v1/api.json?rss_url=${TUMBLR_RSS}`;

const CACHE_KEY = "socialFeedCache_v3";
const CACHE_TIME = 1000 * 60 * 10; // 10 min
const USE_CACHE = false; // turn true after testing

// makes GitHub Pages + local dev both work
const getPublicPath = (path) => {
  const base = process.env.PUBLIC_URL || "";
  return `${base}${path}`;
};

const SocialFeed = () => {
  const [posts, setPosts] = useState([]);
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const extractImageFromContent = (content) => {
    if (!content) return "";
    const match = content.match(/<img[^>]+src=\"([^\">]+)\"/);
    return match ? match[1] : "";
  };

  // -------- TUMBLR --------
  const fetchTumblrPosts = async () => {
    try {
      const res = await fetch(RSS_TO_JSON);
      const data = await res.json();

      return data.items.map((item) => {
        // Tumblr date fix
        const safeDate = item.pubDate
          ? new Date(item.pubDate.replace(" ", "T") + "Z").toISOString()
          : new Date().toISOString();

        return {
          source: "tumblr",
          title: item.title || "Untitled",
          link: item.link,
          date: safeDate,
          image:
            item.thumbnail ||
            item.enclosure?.link ||
            extractImageFromContent(item.content),
        };
      });
    } catch (err) {
      console.error("Tumblr fetch failed:", err);
      return [];
    }
  };

  // -------- INSTAGRAM (LOCAL JSON) --------
  const fetchInstagramPosts = async () => {
    try {
      const res = await fetch(getPublicPath("/data/instagram.json"));

      if (!res.ok) throw new Error("instagram.json not found");

      const data = await res.json();

      const cleaned = data
        .filter((post) => post.image && post.date)
        .map((post) => ({
          source: "instagram",
          title: post.title || "Instagram Post",
          link: post.link || "#",
          date: new Date(post.date).toISOString(),
          image: post.image,
        }));

      console.log("Instagram posts loaded:", cleaned);
      return cleaned;
    } catch (err) {
      console.error("Instagram fetch failed:", err);
      return [];
    }
  };

  // -------- COMBINED FETCH --------
  const fetchPosts = async () => {
    setLoading(true);

    // Cache check
    if (USE_CACHE) {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TIME) {
          console.log("Using cached social feed");
          setPosts(data);
          setLoading(false);
          return;
        }
      }
    }

    const tumblr = await fetchTumblrPosts();
    const instagram = await fetchInstagramPosts();

    console.log("Tumblr count:", tumblr.length);
    console.log("Instagram count:", instagram.length);

    const combined = [...tumblr, ...instagram]
      .filter((post) => !isNaN(new Date(post.date))) // remove bad dates
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    setPosts(combined);

    if (USE_CACHE) {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ data: combined, timestamp: Date.now() }),
      );
    }

    setLoading(false);
  };

  const filtered = posts.filter((p) =>
    tab === "all" ? true : p.source === tab,
  );

  return (
    <Box id="social" sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="All" value="all" />
        <Tab label="Tumblr" value="tumblr" />
        <Tab label="Instagram" value="instagram" />
      </Tabs>

      {loading ? (
        <Box sx={{ columnCount: { xs: 1, sm: 2, md: 3 }, gap: 2 }}>
          {Array.from(new Array(6)).map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={220}
              sx={{ mb: 2, borderRadius: 2 }}
            />
          ))}
        </Box>
      ) : (
        <Box sx={{ columnCount: { xs: 1, sm: 2, md: 3 }, columnGap: "16px" }}>
          {filtered.map((post, i) => (
            <Box key={i} sx={{ breakInside: "avoid", mb: 2 }}>
              <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
                <CardActionArea onClick={() => setActive(post)}>
                  {post.image ? (
                    <CardMedia
                      component="img"
                      image={post.image}
                      alt={post.title}
                    />
                  ) : (
                    <Box sx={{ p: 3 }}>
                      <Typography>{post.title}</Typography>
                    </Box>
                  )}

                  <Fade in timeout={300}>
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        bgcolor: "rgba(0,0,0,0.6)",
                        color: "white",
                        opacity: 0,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        p: 2,
                        transition: "0.3s",
                        "&:hover": { opacity: 1 },
                      }}
                    >
                      <Chip label={post.source} size="small" sx={{ mb: 1 }} />
                      <Typography variant="subtitle2" noWrap>
                        {post.title}
                      </Typography>
                      <Typography variant="caption">
                        {new Date(post.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Fade>
                </CardActionArea>
              </Card>
            </Box>
          ))}
        </Box>
      )}

      <Dialog open={!!active} onClose={() => setActive(null)} maxWidth="md">
        {active && (
          <DialogContent sx={{ p: 0 }}>
            <IconButton
              onClick={() => setActive(null)}
              sx={{ position: "absolute", top: 8, right: 8 }}
            >
              <CloseIcon />
            </IconButton>

            {active.image && (
              <Box component="img" src={active.image} sx={{ width: "100%" }} />
            )}

            <Box sx={{ p: 2 }}>
              <Typography variant="h6">{active.title}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {new Date(active.date).toLocaleDateString()}
              </Typography>
              <Typography component="a" href={active.link} target="_blank">
                View Original Post
              </Typography>
            </Box>
          </DialogContent>
        )}
      </Dialog>
    </Box>
  );
};

export default SocialFeed;

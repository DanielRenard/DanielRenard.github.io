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
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";

const TUMBLR_RSS = "https://djrenard.tumblr.com/rss";
const cacheBust = Math.floor(Date.now() / (1000 * 60 * 60));
const RSS_TO_JSON = `https://api.rss2json.com/v1/api.json?rss_url=${TUMBLR_RSS}&v=${cacheBust}`;

const CACHE_KEY = "socialFeedCache_v3";
const CACHE_TIME = 1000 * 60 * 10; // 10 min
const USE_CACHE = true;

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
  const [refreshing, setRefreshing] = useState(false);
  const [retryAttempted, setRetryAttempted] = useState(false);

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
      const res = await fetch(
        `https://api.rss2json.com/v1/api.json?rss_url=${TUMBLR_RSS}&cache=false&t=${Date.now()}`,
      );
      const data = await res.json();

      const posts = data.items.map((item) => {
        // extract first image from HTML content
        const doc = new DOMParser().parseFromString(item.content, "text/html");
        const img = doc.querySelector("img");
        const image = img ? img.src : null;

        return {
          platform: "tumblr",
          title: item.title,
          link: item.link,
          date: item.pubDate,
          image: image,
          content: item.content,
        };
      });

      return posts;
    } catch (err) {
      console.error("Tumblr fetch failed", err);
      return [];
    }
  };
  // -------- COMBINED FETCH --------
  const fetchPosts = async (forceRefresh = false) => {
    setLoading(true);

    // Cache check (skip if force refresh)
    if (USE_CACHE && !forceRefresh) {
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

    let tumblr = await fetchTumblrPosts();

    // AUTO-RETRY if feed empty (self-healing)
    if (tumblr.length === 0 && !retryAttempted && !forceRefresh) {
      console.log("Feed empty → auto retry in 2s");
      setRetryAttempted(true);

      await new Promise((r) => setTimeout(r, 2000));
      return fetchPosts(true); // force refresh retry
    }

    console.log("Tumblr count:", tumblr.length);

    const combined = [...tumblr]
      .filter((post) => !isNaN(new Date(post.date)))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 9);

    setPosts(combined);
    if (combined.length > 0) setRetryAttempted(false);

    if (USE_CACHE && combined.length > 0) {
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

  const handleRefresh = async () => {
    console.log("Manual refresh triggered");

    setRefreshing(true);
    setRetryAttempted(false);
    localStorage.removeItem(CACHE_KEY); // clear stale cache

    await fetchPosts(true); // force refresh

    setRefreshing(false);
  };

  return (
    console.log("SocialFeed render", Date.now()),
    (
      <Box id="social" sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h4">Fanfare 🎉</Typography>

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading || refreshing}
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </Box>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
          <Tab label="All" value="all" />
          {/* <Tab label="Tumblr" value="tumblr" /> */}
        </Tabs>
        {/* Feed failed fallback */}
        {posts.length === 0 && !loading && (
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography sx={{ mb: 1 }}>Social feed didn’t load.</Typography>

            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
            >
              Retry Feed
            </Button>
          </Box>
        )}

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
                        <Chip
                          label={post.platform}
                          size="small"
                          sx={{ mb: 1 }}
                        />
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
                <Box
                  component="img"
                  src={active.image}
                  sx={{ width: "100%" }}
                />
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
    )
  );
};

export default SocialFeed;

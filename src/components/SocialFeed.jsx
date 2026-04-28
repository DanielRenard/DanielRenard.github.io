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
  TextField,
  Stack,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";

const TUMBLR_RSS = "https://djrenard.tumblr.com/rss";

const CACHE_KEY = "socialFeedCache_v5";
const CACHE_TIME = 1000 * 60 * 10;

const popularTags = [
  "djrenardpulllist",
  "djrenardfavorites",
  "djrenardteam",
  "Conner Kent",
  "Transformers",
  "ASoIaF",
  "DBZ",
  "Absolute Wonder Woman",
  "Tim Drake",
  "Green Lantern",
  "Wally West",
  "Star Wars",
  "Star Trek",
];

const SocialFeed = () => {
  const [posts, setPosts] = useState([]);
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [active, setActive] = useState(null);

  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const parsePosts = (items = []) => {
    return items.map((item) => {
      const doc = new DOMParser().parseFromString(
        item.content,
        "text/html"
      );

      const img = doc.querySelector("img");

      return {
        platform: "tumblr",
        title: item.title,
        link: item.link,
        date: item.pubDate,
        image: img ? img.src : "",
        content: item.content,
        tags: item.categories || [],
      };
    });
  };

  const fetchJSON = async (url) => {
    try {
      const res = await fetch(url);
      const data = await res.json();

      if (!data.items) return [];

      return parsePosts(data.items);
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const fetchPosts = async (force = false) => {
    setLoading(true);

    if (!force) {
      const cached = localStorage.getItem(CACHE_KEY);

      if (cached) {
        const parsed = JSON.parse(cached);

        if (Date.now() - parsed.timestamp < CACHE_TIME) {
          setPosts(parsed.data);
          setLoading(false);
          return;
        }
      }
    }

    const url =
      `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
        TUMBLR_RSS
      )}&cache=false&t=${Date.now()}`;

    const tumblr = await fetchJSON(url);

    const combined = tumblr
      .filter((post) => !isNaN(new Date(post.date)))
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    setPosts(combined);

    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        data: combined,
        timestamp: Date.now(),
      })
    );

    setLoading(false);
  };

  const fetchTaggedPosts = async (term) => {
    if (!term) {
      fetchPosts(true);
      return;
    }

    setLoading(true);

    const taggedRSS = `https://djrenard.tumblr.com/tagged/${encodeURIComponent(
      term
    )}/rss`;

    const url =
      `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
        taggedRSS
      )}&cache=false&t=${Date.now()}`;

    const results = await fetchJSON(url);

    setPosts(results);
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    localStorage.removeItem(CACHE_KEY);
    await fetchPosts(true);
    setRefreshing(false);
  };

  const handleSearchSubmit = async () => {
    const term = search.trim();

    setSelectedTag("");
    await fetchTaggedPosts(term);
  };

  const handleTagClick = async (tag) => {
    setSelectedTag(tag);
    setSearch("");
    await fetchTaggedPosts(tag);
  };

  const filtered = posts.slice(0, 9);

  return (
    <Box id="social" sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h4">Fanfare</Typography>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={loading || refreshing}
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </Box>

      {/* SEARCH */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
        }}
      >
        <TextField
          label="Search Tumblr Posts"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelectedTag("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearchSubmit();
            }
          }}
          size="small"
          sx={{ minWidth: 260 }}
        />

        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={handleSearchSubmit}
        >
          Search
        </Button>
      </Box>

      {/* TAGS */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
        }}
      >
        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
          <Tab
            label="All"
            value="all"
            onClick={() => {
              setSelectedTag("");
              setSearch("");
              fetchPosts(true);
            }}
          />
        </Tabs>

        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          {popularTags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              clickable
              color={selectedTag === tag ? "primary" : "default"}
              variant={
                selectedTag === tag ? "filled" : "outlined"
              }
              onClick={() => handleTagClick(tag)}
              sx={{
                fontWeight: 600,
                borderRadius: "20px",
              }}
            />
          ))}
        </Stack>
      </Box>

      {/* NO RESULTS */}
      {!loading && filtered.length === 0 && (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <Typography variant="h6">
            No results found.
          </Typography>

          <Typography
            variant="body2"
            sx={{ opacity: 0.7 }}
          >
            Try another tag or keyword.
          </Typography>
        </Box>
      )}

      {/* LOADING */}
      {loading ? (
        <Box
          sx={{
            columnCount: { xs: 1, sm: 2, md: 3 },
            gap: 2,
          }}
        >
          {Array.from(new Array(6)).map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={220}
              sx={{
                mb: 2,
                borderRadius: 2,
              }}
            />
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            columnCount: { xs: 1, sm: 2, md: 3 },
            columnGap: "16px",
          }}
        >
          {filtered.map((post, i) => (
            <Box
              key={i}
              sx={{
                breakInside: "avoid",
                mb: 2,
              }}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <CardActionArea
                  onClick={() => setActive(post)}
                >
                  {post.image ? (
                    <CardMedia
                      component="img"
                      image={post.image}
                      alt={post.title}
                    />
                  ) : (
                    <Box sx={{ p: 3 }}>
                      <Typography variant="caption">
                        {post.title}
                      </Typography>
                    </Box>
                  )}

                  <Fade in timeout={300}>
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        bgcolor: "rgba(0,0,0,.6)",
                        color: "white",
                        opacity: 0,
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        transition: ".3s",
                        "&:hover": {
                          opacity: 1,
                        },
                      }}
                    >
                      <Chip
                        label={post.platform}
                        size="small"
                        sx={{ mb: 1 }}
                      />

                      <Typography
                        variant="subtitle2"
                        noWrap
                      >
                        {post.title}
                      </Typography>

                      <Typography variant="caption">
                        {new Date(
                          post.date
                        ).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Fade>
                </CardActionArea>
              </Card>
            </Box>
          ))}
        </Box>
      )}

      {/* MODAL */}
      <Dialog
        open={!!active}
        onClose={() => setActive(null)}
        maxWidth="md"
      >
        {active && (
          <DialogContent sx={{ p: 0 }}>
            <IconButton
              onClick={() => setActive(null)}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
              }}
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
              <Typography variant="h6">
                {active.title}
              </Typography>

              <Typography
                variant="body2"
                sx={{ mb: 1 }}
              >
                {new Date(
                  active.date
                ).toLocaleDateString()}
              </Typography>

              <Typography
                component="a"
                href={active.link}
                target="_blank"
              >
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
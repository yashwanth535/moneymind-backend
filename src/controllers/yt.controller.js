const VideoLink = require("../models/VideoLink");
const { extractYouTubeId, fetchYouTubeMeta } = require("../utils/youtube");
const { google } = require("googleapis");

// 🔥 Setup YouTube client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
});

const youtube = google.youtube({
  version: "v3",
  auth: oauth2Client,
});

// =======================
// GET (DB + YOUTUBE)
// =======================
const getYtLinks = async (_, res) => {
  try {
    console.log("get yt links controller triggered");

    // ✅ ALWAYS fetch DB first
    const dbLinks = await VideoLink.find()
      .sort({ createdAt: -1 })
      .lean();

    let ytLinks = [];

    // ✅ Wrap ALL YouTube logic separately
    try {
      console.log("Trying YouTube fetch...");

      await oauth2Client.getAccessToken();

      const ytRes = await youtube.playlistItems.list({
        part: "snippet",
        playlistId: process.env.YOUTUBE_PLAYLIST_ID,
        maxResults: 50,
      });

      ytLinks = ytRes.data.items.map((item) => {
        const videoId = item.snippet.resourceId.videoId;

        return {
          _id: `yt_${item.id}`,
          url: `https://www.youtube.com/watch?v=${videoId}`,
          videoId,
          title: item.snippet.title,
          thumbnailUrl: item.snippet.thumbnails?.medium?.url,
          section: "youtube",
          isYoutube: true,
          playlistItemId: item.id,
        };
      });

      console.log("✅ YouTube fetch success");

    } catch (ytError) {
      console.error("⚠️ YouTube fetch failed:");
      console.error(ytError.response?.data || ytError.message);

      // 👉 fallback → empty ytLinks
      ytLinks = [];
    }

    // ✅ ALWAYS return something
    return res.json({
      links: [...ytLinks, ...dbLinks],
    });

  } catch (error) {
    console.error("❌ CRITICAL ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch videos.",
      error: String(error),
    });
  }
};

// =======================
// ADD (UNCHANGED)
// =======================
const addYtLink = async (req, res) => {
  try {
    console.log("add yt link controller triggered");
    const rawUrl = req.body?.url;
    const section = req.body?.section || "watch-now";
    const customTitle = (req.body?.title || "").trim();

    if (!rawUrl) {
      return res.status(400).json({ message: "url is required." });
    }

    if (!["watch-now", "watch-later"].includes(section)) {
      return res.status(400).json({ message: "Invalid section." });
    }

    const videoId = extractYouTubeId(rawUrl);
    if (!videoId) {
      return res.status(400).json({ message: "Invalid YouTube URL or video ID." });
    }

    const metadata = await fetchYouTubeMeta(videoId);
    const normalizedUrl = `https://www.youtube.com/watch?v=${videoId}`;

    const link = await VideoLink.create({
      url: normalizedUrl,
      videoId,
      title: customTitle || metadata.title,
      thumbnailUrl: metadata.thumbnailUrl,
      section,
    });

    return res.status(201).json({ link });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({
        message: "This video already exists in the selected section.",
      });
    }
    return res.status(500).json({
      message: "Failed to add video.",
      error: String(error),
    });
  }
};

// =======================
// MOVE (DB ONLY)
// =======================
const moveYtLinkSection = async (req, res) => {
  try {
    const section = req.body?.section;

    if (!["watch-now", "watch-later"].includes(section)) {
      return res.status(400).json({ message: "Invalid section." });
    }

    // ❌ prevent moving YouTube items
    if (req.params.id.startsWith("yt_")) {
      return res.status(400).json({
        message: "Cannot move YouTube playlist videos.",
      });
    }

    const updated = await VideoLink.findByIdAndUpdate(
      req.params.id,
      { section },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Video not found." });
    }

    return res.json({ link: updated });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to move video.",
      error: String(error),
    });
  }
};

// =======================
// DELETE (DB + YOUTUBE)
// =======================
const deleteYtLink = async (req, res) => {
  try {
    const id = req.params.id;

    // 🔥 If YouTube item
    if (id.startsWith("yt_")) {
      const playlistItemId = id.replace("yt_", "");

      await youtube.playlistItems.delete({
        id: playlistItemId,
      });

      return res.json({ ok: true, source: "youtube" });
    }

    // 🔹 Otherwise DB
    const deleted = await VideoLink.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Video not found." });
    }

    return res.json({ ok: true, source: "db" });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to remove video.",
      error: String(error),
    });
  }
};

module.exports = {
  getYtLinks,
  addYtLink,
  moveYtLinkSection,
  deleteYtLink,
};
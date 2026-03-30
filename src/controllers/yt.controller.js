const VideoLink = require("../models/VideoLink");
const { extractYouTubeId, fetchYouTubeMeta } = require("../utils/youtube");

const getYtLinks = async (_, res) => {
  try {
    const links = await VideoLink.find().sort({ createdAt: -1 }).lean();
    return res.json({ links });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch videos.", error: String(error) });
  }
};

const addYtLink = async (req, res) => {
  try {
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
      return res
        .status(409)
        .json({ message: "This video already exists in the selected section." });
    }
    return res
      .status(500)
      .json({ message: "Failed to add video.", error: String(error) });
  }
};

const moveYtLinkSection = async (req, res) => {
  try {
    const section = req.body?.section;
    if (!["watch-now", "watch-later"].includes(section)) {
      return res.status(400).json({ message: "Invalid section." });
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
    if (error?.code === 11000) {
      return res.status(409).json({
        message: "This video already exists in that section.",
      });
    }
    return res
      .status(500)
      .json({ message: "Failed to move video.", error: String(error) });
  }
};

const deleteYtLink = async (req, res) => {
  try {
    const deleted = await VideoLink.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Video not found." });
    }
    return res.json({ ok: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to remove video.", error: String(error) });
  }
};

module.exports = {
  getYtLinks,
  addYtLink,
  moveYtLinkSection,
  deleteYtLink,
};

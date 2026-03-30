const mongoose = require("mongoose");

const videoLinkSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    videoId: {
      type: String,
      required: true,
      trim: true,
      minlength: 11,
      maxlength: 11,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      default: "",
    },
    thumbnailUrl: {
      type: String,
      trim: true,
      default: "",
    },
    section: {
      type: String,
      enum: ["watch-now", "watch-later"],
      default: "watch-now",
      index: true,
    },
  },
  { timestamps: true }
);

videoLinkSchema.index({ videoId: 1, section: 1 }, { unique: true });

module.exports = mongoose.model("VideoLink", videoLinkSchema);

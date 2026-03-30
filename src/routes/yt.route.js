const express = require("express");
const {
  getYtLinks,
  addYtLink,
  moveYtLinkSection,
  deleteYtLink,
} = require("../controllers/yt.controller");

const router = express.Router();

router.get("/", getYtLinks);
router.post("/", addYtLink);
router.patch("/:id/section", moveYtLinkSection);
router.delete("/:id", deleteYtLink);

module.exports = router;

const express = require("express");
const {
  postItem,
  getItems,
  claimItem,
  getClaimedItems
} = require("../controllers/itemController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/post", auth, postItem);
router.get("/all", getItems);
router.post("/claim", auth, claimItem);
router.get("/claimed", auth, getClaimedItems);

module.exports = router;

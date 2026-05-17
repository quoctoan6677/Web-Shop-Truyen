const express = require("express");

const userController = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/profile-stats", protect, userController.getProfileStats);
router.put("/profile", protect, userController.updateProfile);

module.exports = router;

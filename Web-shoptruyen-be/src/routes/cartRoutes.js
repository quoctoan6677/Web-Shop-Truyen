const express = require("express");

const cartController = require("../controllers/cartController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", protect, cartController.getCart);
router.post("/", protect, cartController.addToCart);
router.put("/:cartItemId", protect, cartController.updateCartItem);
router.delete("/:cartItemId", protect, cartController.deleteCartItem);

module.exports = router;

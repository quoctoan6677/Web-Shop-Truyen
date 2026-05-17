const express = require("express");

const orderController = require("../controllers/orderController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, orderController.createOrder);
router.get("/my-orders", protect, orderController.getMyOrders);
router.put("/:id/cancel", protect, orderController.cancelOrder);

module.exports = router;

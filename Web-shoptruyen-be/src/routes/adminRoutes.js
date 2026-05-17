const express = require("express");

const adminController = require("../controllers/adminController");
const orderController = require("../controllers/orderController");
const productController = require("../controllers/productController");
const { adminOnly, protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/dashboard", protect, adminOnly, adminController.getDashboard);
router.get("/orders", protect, adminOnly, orderController.getAdminOrders);
router.put(
  "/orders/:id/status",
  protect,
  adminOnly,
  orderController.updateAdminOrderStatus
);
router.get("/products", protect, adminOnly, productController.getAdminProducts);
router.post("/products", protect, adminOnly, productController.createProduct);
router.put("/products/:id", protect, adminOnly, productController.updateProduct);
router.delete("/products/:id", protect, adminOnly, productController.deleteProduct);

module.exports = router;

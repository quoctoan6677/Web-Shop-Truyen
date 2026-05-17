const CartItem = require("../models/CartItem");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");

const ORDER_STATUS_ORDER = {
  "Chờ xác nhận": 0,
  "Đang giao hàng": 1,
  "Đã giao": 2,
  "Đã hủy": 3,
};

const ALLOWED_ADMIN_STATUS_TRANSITIONS = {
  "Chờ xác nhận": ["Đang giao hàng"],
  "Đang giao hàng": ["Chờ xác nhận", "Đã giao"],
  "Đã giao": ["Đang giao hàng"],
  "Đã hủy": [],
};

function buildOrderResponse(order, items) {
  return {
    _id: order._id,
    code: order.code,
    customerName: order.customerName,
    phone: order.phone,
    address: order.address,
    total: order.total,
    status: order.status,
    orderDate: order.orderDate,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    items: items.map((item) => ({
      _id: item._id,
      product: item.product,
      code: item.code,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    })),
  };
}

async function generateOrderCode() {
  const latestOrder = await Order.findOne().sort({ createdAt: -1, _id: -1 });

  if (!latestOrder?.code) {
    return "DH001";
  }

  const matchedNumber = Number.parseInt(latestOrder.code.replace(/\D/g, ""), 10);
  const nextNumber = Number.isNaN(matchedNumber) ? 1 : matchedNumber + 1;

  return `DH${String(nextNumber).padStart(3, "0")}`;
}

async function buildOrdersPayload(orders) {
  const orderIds = orders.map((order) => order._id);
  const orderItems = await OrderItem.find({
    order: { $in: orderIds },
  }).sort({ createdAt: 1 });

  const orderItemsMap = orderItems.reduce((accumulator, item) => {
    const orderId = item.order.toString();

    if (!accumulator[orderId]) {
      accumulator[orderId] = [];
    }

    accumulator[orderId].push(item);
    return accumulator;
  }, {});

  return orders.map((order) =>
    buildOrderResponse(order, orderItemsMap[order._id.toString()] || [])
  );
}

async function getMyOrders(req, res) {
  const orders = await Order.find({
    user: req.user._id,
  }).sort({ orderDate: -1, createdAt: -1 });

  const payload = await buildOrdersPayload(orders);

  return res.status(200).json({
    message: "Get my orders successfully.",
    count: payload.length,
    orders: payload,
  });
}

async function createOrder(req, res) {
  const { customerInfo, items } = req.body || {};

  if (!customerInfo?.fullName || !customerInfo?.phone || !customerInfo?.address) {
    return res.status(400).json({
      message: "customerInfo.fullName, phone and address are required.",
    });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      message: "items must be a non-empty array.",
    });
  }

  const normalizedItems = [];

  for (const item of items) {
    const quantity = Number(item.quantity);

    if (!item.productId || !Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        message: "Each item must include productId and quantity > 0.",
      });
    }

    const product = await Product.findById(item.productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    normalizedItems.push({
      product,
      quantity,
      cartItemId: item.cartItemId || null,
    });
  }

  const total = normalizedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const order = await Order.create({
    code: await generateOrderCode(),
    user: req.user._id,
    customerName: customerInfo.fullName.trim(),
    phone: customerInfo.phone.trim(),
    address: customerInfo.address.trim(),
    total,
    status: "Chờ xác nhận",
    orderDate: new Date(),
  });

  const createdOrderItems = await OrderItem.insertMany(
    normalizedItems.map((item) => ({
      order: order._id,
      product: item.product._id,
      code: item.product.code,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }))
  );

  const cartItemIdsToDelete = normalizedItems
    .map((item) => item.cartItemId)
    .filter(Boolean);

  if (cartItemIdsToDelete.length > 0) {
    await CartItem.deleteMany({
      _id: { $in: cartItemIdsToDelete },
      user: req.user._id,
    });
  }

  return res.status(201).json({
    message: "Create order successfully.",
    order: buildOrderResponse(order, createdOrderItems),
  });
}

async function cancelOrder(req, res) {
  const { id } = req.params;

  const order = await Order.findOne({
    _id: id,
    user: req.user._id,
  });

  if (!order) {
    return res.status(404).json({
      message: "Order not found.",
    });
  }

  if (order.status !== "Chờ xác nhận") {
    return res.status(400).json({
      message: "Chỉ có thể hủy đơn hàng ở trạng thái Chờ xác nhận.",
    });
  }

  order.status = "Đã hủy";
  await order.save();

  const orderItems = await OrderItem.find({
    order: order._id,
  }).sort({ createdAt: 1 });

  return res.status(200).json({
    message: "Cancel order successfully.",
    order: buildOrderResponse(order, orderItems),
  });
}

async function getAdminOrders(req, res) {
  const orders = await Order.find().sort({ orderDate: -1, createdAt: -1 });
  const payload = await buildOrdersPayload(orders);

  return res.status(200).json({
    message: "Get admin orders successfully.",
    count: payload.length,
    orders: payload,
  });
}

async function updateAdminOrderStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body || {};

  if (!status) {
    return res.status(400).json({
      message: "status is required.",
    });
  }

  const order = await Order.findById(id);

  if (!order) {
    return res.status(404).json({
      message: "Order not found.",
    });
  }

  const allowedStatuses = ALLOWED_ADMIN_STATUS_TRANSITIONS[order.status] || [];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid order status transition.",
    });
  }

  order.status = status;
  await order.save();

  const orderItems = await OrderItem.find({
    order: order._id,
  }).sort({ createdAt: 1 });

  return res.status(200).json({
    message: "Update order status successfully.",
    order: buildOrderResponse(order, orderItems),
  });
}

module.exports = {
  ORDER_STATUS_ORDER,
  getMyOrders,
  createOrder,
  cancelOrder,
  getAdminOrders,
  updateAdminOrderStatus,
};

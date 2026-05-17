const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const User = require("../models/User");

function buildUserResponse(user) {
  return {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function updateProfile(req, res) {
  const { fullName, email, phone, address } = req.body || {};
  const trimmedFullName = fullName?.trim();
  const trimmedEmail = email?.trim();
  const trimmedPhone = phone?.trim();
  const trimmedAddress = address?.trim();

  if (!trimmedFullName || !trimmedEmail || !trimmedPhone || !trimmedAddress) {
    return res.status(400).json({
      message: "fullName, email, phone and address are required.",
    });
  }

  const normalizedEmail = trimmedEmail.toLowerCase();

  const existingUser = await User.findOne({
    email: normalizedEmail,
    _id: { $ne: req.user._id },
  });

  if (existingUser) {
    return res.status(409).json({
      message: "Email already exists.",
    });
  }

  const user = await User.findById(req.user._id);

  if (!user || !user.isActive) {
    return res.status(404).json({
      message: "User not found.",
    });
  }

  user.fullName = trimmedFullName;
  user.email = normalizedEmail;
  user.phone = trimmedPhone;
  user.address = trimmedAddress;

  await user.save();

  return res.status(200).json({
    message: "Profile updated successfully.",
    user: buildUserResponse(user),
  });
}

async function getProfileStats(req, res) {
  const orders = await Order.find({
    user: req.user._id,
  })
    .select("_id status")
    .lean();

  const orderIds = orders.map((order) => order._id);
  const validOrderIds = orders
    .filter((order) => order.status !== "Đã hủy")
    .map((order) => order._id);

  const purchasedItems = validOrderIds.length
    ? await OrderItem.aggregate([
        {
          $match: {
            order: { $in: validOrderIds },
          },
        },
        {
          $group: {
            _id: null,
            totalQuantity: { $sum: "$quantity" },
          },
        },
      ])
    : [];

  return res.status(200).json({
    message: "Get profile stats successfully.",
    stats: {
      totalOrders: orderIds.length,
      totalPurchasedItems: purchasedItems[0]?.totalQuantity || 0,
    },
  });
}

module.exports = {
  updateProfile,
  getProfileStats,
};

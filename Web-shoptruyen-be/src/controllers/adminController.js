const Order = require("../models/Order");
const Product = require("../models/Product");

function getRangeStart(date, unit) {
  const nextDate = new Date(date);

  if (unit === "week") {
    const day = nextDate.getDay();
    const diff = day === 0 ? 6 : day - 1;
    nextDate.setHours(0, 0, 0, 0);
    nextDate.setDate(nextDate.getDate() - diff);
    return nextDate;
  }

  if (unit === "month") {
    return new Date(nextDate.getFullYear(), nextDate.getMonth(), 1);
  }

  return new Date(nextDate.getFullYear(), 0, 1);
}

function formatCurrency(value) {
  return `${Number(value || 0).toLocaleString("vi-VN")} đ`;
}

async function getDashboard(req, res) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const weekStart = getRangeStart(now, "week");
  const monthStart = getRangeStart(now, "month");
  const yearStart = getRangeStart(now, "year");

  const [
    products,
    nonCancelledOrders,
    deliveredOrders,
    todayOrders,
    pendingOrdersCount,
    shippingOrdersCount,
    deliveredOrdersCount,
  ] = await Promise.all([
    Product.find().select("stock").lean(),
    Order.find({ status: { $ne: "Đã hủy" } }).select("total createdAt").lean(),
    Order.find({ status: "Đã giao" }).select("total createdAt").lean(),
    Order.countDocuments({
      createdAt: {
        $gte: todayStart,
        $lt: tomorrowStart,
      },
    }),
    Order.countDocuments({ status: "Chờ xác nhận" }),
    Order.countDocuments({ status: "Đang giao hàng" }),
    Order.countDocuments({ status: "Đã giao" }),
  ]);

  const weeklyDeliveredOrders = deliveredOrders.filter(
    (order) => new Date(order.createdAt) >= weekStart
  );
  const monthlyDeliveredOrders = deliveredOrders.filter(
    (order) => new Date(order.createdAt) >= monthStart
  );
  const yearlyDeliveredOrders = deliveredOrders.filter(
    (order) => new Date(order.createdAt) >= yearStart
  );

  const weeklyRevenue = weeklyDeliveredOrders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );
  const monthlyRevenue = monthlyDeliveredOrders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );
  const yearlyRevenue = yearlyDeliveredOrders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const averageMonthlyOrderValue =
    monthlyDeliveredOrders.length > 0
      ? Math.round(monthlyRevenue / monthlyDeliveredOrders.length)
      : 0;
  const totalProducts = products.length;
  const bestSellingProducts = products.filter(
    (product) => Number(product.stock || 0) > 0
  ).length;

  return res.status(200).json({
    message: "Get dashboard successfully.",
    revenueStats: [
      {
        key: "weeklyRevenue",
        label: "Theo tuần",
        value: weeklyRevenue,
        note: `Doanh thu từ các đơn đã giao kể từ ${weekStart.toLocaleDateString("vi-VN")}.`,
      },
      {
        key: "monthlyRevenue",
        label: "Theo tháng",
        value: monthlyRevenue,
        note: `Đơn đã giao trung bình ${formatCurrency(averageMonthlyOrderValue)}.`,
      },
      {
        key: "yearlyRevenue",
        label: "Theo năm",
        value: yearlyRevenue,
        note: `Doanh thu từ các đơn đã giao trong năm ${now.getFullYear()}.`,
      },
    ],
    overviewStats: [
      {
        key: "products",
        label: "Tổng sản phẩm",
        value: totalProducts,
        note: `${bestSellingProducts} sản phẩm đang còn hàng.`,
      },
      {
        key: "orders",
        label: "Tổng đơn hàng",
        value: nonCancelledOrders.length,
        note: `${todayOrders} đơn mới trong hôm nay.`,
      },
      {
        key: "pendingOrders",
        label: "Đơn chờ xác nhận",
        value: pendingOrdersCount,
        note: "Cần admin xác nhận để chuyển sang giao hàng.",
      },
      {
        key: "shippingOrders",
        label: "Đơn đang giao",
        value: shippingOrdersCount,
        note: "Đang trong quá trình vận chuyển đến khách hàng.",
      },
      {
        key: "deliveredOrders",
        label: "Đơn đã giao",
        value: deliveredOrdersCount,
        note: "Đã hoàn tất giao hàng thành công.",
      },
    ],
  });
}

module.exports = {
  getDashboard,
};

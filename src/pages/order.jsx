import { useMemo, useState } from "react";
import { FiCalendar, FiCreditCard, FiPackage, FiShoppingBag } from "react-icons/fi";
import { userInitialOrders } from "../data/orders";

const statusOrder = {
	"Chờ xác nhận": 0,
	"Đang giao hàng": 1,
	"Đã giao": 2,
	"Đã hủy": 3,
};

function formatCurrency(value) {
	return `${value.toLocaleString("vi-VN")} đ`;
}

function getStatusClass(status) {
	if (status === "Đã giao") {
		return "bg-emerald-50 text-emerald-600";
	}

	if (status === "Đang giao hàng") {
		return "bg-amber-50 text-amber-600";
	}

	if (status === "Đã hủy") {
		return "bg-slate-200 text-slate-600";
	}

	return "bg-red-50 text-red-500";
}

function getTotalQuantity(items) {
	return items.reduce((total, item) => total + item.quantity, 0);
}

function Order() {
	const [orders, setOrders] = useState(userInitialOrders);

	const sortedOrders = useMemo(() => {
		return orders
			.map((order, originalIndex) => ({ ...order, originalIndex }))
			.sort(
				(a, b) =>
					(statusOrder[a.status] ?? Number.MAX_SAFE_INTEGER) -
					(statusOrder[b.status] ?? Number.MAX_SAFE_INTEGER)
			);
	}, [orders]);

	const handleCancelOrder = (originalIndex) => {
		const shouldCancel = window.confirm("Bạn có chắc muốn hủy đơn hàng này?");

		if (!shouldCancel) {
			return;
		}

		setOrders((prev) =>
			prev.map((order, index) =>
				index === originalIndex ? { ...order, status: "Đã hủy" } : order
			)
		);
	};

	return (
		<section className="grid gap-6">
			<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
				<div className="flex items-start gap-4">
					<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
						<FiShoppingBag className="h-7 w-7" />
					</div>
					<div>
						<h1 className="text-3xl font-bold text-slate-900">Đơn hàng của tôi</h1>
						<p className="mt-2 text-sm leading-6 text-slate-600">
							Xem các sản phẩm đã đặt và theo dõi trạng thái xử lý của từng đơn.
						</p>
					</div>
				</div>
			</div>

			<div className="grid gap-4">
				{sortedOrders.map((order) => {
					const canCancel = order.status === "Chờ xác nhận";

					return (
						<article
							key={`${order.date}-${order.originalIndex}`}
							className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
						>
							<div className="flex flex-col gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-start md:justify-between">
								<div>
									<p className="text-lg font-bold text-slate-900">
										Đơn hàng ngày {order.date}
									</p>
									<div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
										<span className="inline-flex items-center gap-2">
											<FiCalendar className="h-4 w-4" />
											{order.date}
										</span>
										<span className="inline-flex items-center gap-2">
											<FiPackage className="h-4 w-4" />
											{getTotalQuantity(order.items)} sản phẩm
										</span>
									</div>
								</div>

								<div className="flex flex-col items-start gap-3 md:items-end">
									<span
										className={`w-fit rounded-full px-3 py-1 text-sm font-semibold ${getStatusClass(
											order.status
										)}`}
									>
										{order.status}
									</span>
									<button
										type="button"
										onClick={() => handleCancelOrder(order.originalIndex)}
										disabled={!canCancel}
										className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 disabled:hover:bg-transparent"
									>
										Hủy đặt hàng
									</button>
								</div>
							</div>

							<div className="mt-5 grid gap-3">
								{order.items.map((item) => (
									<div
										key={item.id}
										className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto]"
									>
										<div className="min-w-0">
											<p className="font-semibold text-slate-900">{item.name}</p>
											<p className="mt-1 text-sm text-slate-500">
												Số lượng: {item.quantity}
											</p>
										</div>
										<div className="text-left sm:text-right">
											<p className="font-semibold text-slate-900">
												{formatCurrency(item.price)}
											</p>
											<p className="mt-1 text-sm text-slate-500">
												Thành tiền: {formatCurrency(item.price * item.quantity)}
											</p>
										</div>
									</div>
								))}
							</div>

							<div className="mt-5 flex flex-col gap-3 rounded-xl bg-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
								<div className="text-sm text-slate-600">
									<p>Tổng mặt hàng: {order.items.length}</p>
									<p className="mt-1">
										Tổng số lượng: {getTotalQuantity(order.items)}
									</p>
								</div>
								<div className="inline-flex items-center gap-2 text-lg font-bold text-slate-900">
									<FiCreditCard className="h-5 w-5 text-slate-400" />
									<span className="text-red-500">{formatCurrency(order.total)}</span>
								</div>
							</div>
						</article>
					);
				})}
			</div>
		</section>
	);
}

export default Order;

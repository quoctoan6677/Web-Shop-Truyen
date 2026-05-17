import { FiMapPin, FiPhone, FiUser, FiX } from "react-icons/fi";

function formatCurrency(value) {
	return `${Number(value || 0).toLocaleString("vi-VN")} đ`;
}

function getStatusClass(status) {
	if (status === "Đã giao") {
		return "bg-emerald-50 text-emerald-600";
	}

	if (status === "Đang giao hàng") {
		return "bg-amber-50 text-amber-600";
	}

	if (status === "Đã hủy") {
		return "bg-slate-100 text-slate-500";
	}

	return "bg-red-50 text-red-500";
}

function getActionConfig(status) {
	if (status === "Chờ xác nhận") {
		return {
			primaryAction: {
				label: "Xác nhận đơn hàng",
				nextStatus: "Đang giao hàng",
				confirmMessage:
					"Xác nhận chuyển đơn hàng này sang trạng thái đang giao hàng?",
			},
		};
	}

	if (status === "Đang giao hàng") {
		return {
			secondaryAction: {
				label: "Chuyển lại chờ xác nhận",
				nextStatus: "Chờ xác nhận",
				confirmMessage:
					"Chuyển đơn hàng này lại trạng thái chờ xác nhận?",
			},
			primaryAction: {
				label: "Hoàn thành",
				nextStatus: "Đã giao",
				confirmMessage: "Xác nhận đơn hàng này đã giao thành công?",
			},
		};
	}

	if (status === "Đã giao") {
		return {
			secondaryAction: {
				label: "Chuyển lại đang giao hàng",
				nextStatus: "Đang giao hàng",
				confirmMessage:
					"Chuyển đơn hàng này lại trạng thái đang giao hàng?",
			},
		};
	}

	return {};
}

function ModalChiTietDonHang({ open, order, onClose, onUpdateStatus }) {
	if (!open || !order) {
		return null;
	}

	const actionConfig = getActionConfig(order.status);

	const handleStatusChange = async (action) => {
		if (!action) {
			return;
		}

		const shouldContinue = window.confirm(action.confirmMessage);

		if (!shouldContinue) {
			return;
		}

		await onUpdateStatus(order._id, action.nextStatus);
	};

	return (
		<div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-4">
			<div className="relative w-full max-w-4xl rounded-2xl bg-white p-6 shadow-xl">
				<button
					type="button"
					onClick={onClose}
					className="absolute right-3 top-3 rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
					aria-label="Đóng chi tiết đơn hàng"
				>
					<FiX className="h-5 w-5" />
				</button>

				<div className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
					<div>
						<h2 className="text-2xl font-bold text-slate-900">
							Chi tiết đơn hàng: {order.code}
						</h2>
						<p className="mt-1 text-sm text-slate-500">
							Ngày đặt: {order.orderDateLabel}
						</p>
					</div>

					<span
						className={`mr-8 inline-flex w-fit rounded-full px-3 py-1 text-sm font-semibold ${getStatusClass(
							order.status
						)}`}
					>
						{order.status}
					</span>
				</div>

				<div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
					<div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
						<h3 className="text-lg font-bold text-slate-900">
							Thông tin nhận hàng
						</h3>

						<div className="mt-5 grid gap-4 text-sm text-slate-600">
							<div className="flex items-start gap-3">
								<FiUser className="mt-0.5 h-4 w-4 text-slate-400" />
								<div>
									<p>Khách hàng</p>
									<p className="font-semibold text-slate-900">
										{order.customerName}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<FiPhone className="mt-0.5 h-4 w-4 text-slate-400" />
								<div>
									<p>Số điện thoại</p>
									<p className="font-semibold text-slate-900">{order.phone}</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<FiMapPin className="mt-0.5 h-4 w-4 text-slate-400" />
								<div>
									<p>Địa chỉ nhận hàng</p>
									<p className="font-semibold text-slate-900">{order.address}</p>
								</div>
							</div>
						</div>
					</div>

					<div className="min-w-0">
						<div className="rounded-2xl border border-slate-200">
							<div className="border-b border-slate-200 px-5 py-4">
								<h3 className="text-lg font-bold text-slate-900">
									Sản phẩm trong đơn
								</h3>
							</div>

							<div className="max-h-72 divide-y divide-slate-200 overflow-y-auto">
								{order.items.map((item) => (
									<div
										key={item._id || item.id}
										className="grid gap-4 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_auto]"
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
						</div>

						<div className="mt-5 rounded-2xl bg-slate-100 px-5 py-4">
							<div className="flex items-center justify-between text-sm text-slate-600">
								<span>Tổng sản phẩm</span>
								<span>{order.items.length}</span>
							</div>
							<div className="mt-3 flex items-center justify-between text-lg font-bold text-slate-900">
								<span>Tổng thanh toán</span>
								<span className="text-red-500">{formatCurrency(order.total)}</span>
							</div>
						</div>

						{actionConfig.primaryAction || actionConfig.secondaryAction ? (
							<div className="mt-5 flex justify-end gap-3">
								{actionConfig.secondaryAction ? (
									<button
										type="button"
										onClick={() =>
											handleStatusChange(actionConfig.secondaryAction)
										}
										className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
									>
										{actionConfig.secondaryAction.label}
									</button>
								) : null}

								{actionConfig.primaryAction ? (
									<button
										type="button"
										onClick={() => handleStatusChange(actionConfig.primaryAction)}
										className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
									>
										{actionConfig.primaryAction.label}
									</button>
								) : null}
							</div>
						) : null}
					</div>
				</div>
			</div>
		</div>
	);
}

export default ModalChiTietDonHang;

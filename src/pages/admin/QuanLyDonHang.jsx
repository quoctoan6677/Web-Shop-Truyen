import { useMemo, useState } from "react";
import Search from "../../components/Search";
import {
	adminInitialOrders,
	adminOrderStatusOptions,
	adminOrderStatusOrder,
} from "../../data/orders";
import ModalChiTietDonHang from "../../modals/ModalChiTietDonHang";

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

	return "bg-red-50 text-red-500";
}

function QuanLyDonHang() {
	const [orders, setOrders] = useState(adminInitialOrders);
	const [searchValue, setSearchValue] = useState("");
	const [selectedStatus, setSelectedStatus] = useState("Tất cả trạng thái");
	const [selectedOrderId, setSelectedOrderId] = useState(null);
	const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

	const filteredOrders = useMemo(() => {
		const normalizedSearch = searchValue.trim().toLowerCase();

		return [...orders]
			.filter((order) => {
				const matchesSearch =
					normalizedSearch.length === 0 ||
					order.id.toLowerCase().includes(normalizedSearch) ||
					order.customerName.toLowerCase().includes(normalizedSearch) ||
					order.phone.toLowerCase().includes(normalizedSearch);

				const matchesStatus =
					selectedStatus === "Tất cả trạng thái" ||
					order.status === selectedStatus;

				return matchesSearch && matchesStatus;
			})
			.sort(
				(a, b) => adminOrderStatusOrder[a.status] - adminOrderStatusOrder[b.status]
			);
	}, [orders, searchValue, selectedStatus]);

	const selectedOrder = useMemo(
		() => orders.find((order) => order.id === selectedOrderId) || null,
		[orders, selectedOrderId]
	);

	const handleOpenOrderModal = (order) => {
		setSelectedOrderId(order.id);
		setIsOrderModalOpen(true);
	};

	const handleCloseOrderModal = () => {
		setSelectedOrderId(null);
		setIsOrderModalOpen(false);
	};

	const handleUpdateOrderStatus = (orderId, nextStatus) => {
		setOrders((prev) =>
			prev.map((order) =>
				order.id === orderId ? { ...order, status: nextStatus } : order
			)
		);
	};

	return (
		<>
			<div className="space-y-6">
				<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
					<div className="flex flex-col gap-5">
						<div>
							<h1 className="text-2xl font-bold text-slate-900">
								Quản lý đơn hàng
							</h1>
						</div>

						<div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_190px]">
							<Search
								value={searchValue}
								onChange={(e) => setSearchValue(e.target.value)}
								onSearch={() => {}}
								placeholder="Tìm theo mã đơn, tên khách hoặc số điện thoại..."
								ariaLabel="Tìm kiếm đơn hàng"
							/>

							<select
								value={selectedStatus}
								onChange={(e) => setSelectedStatus(e.target.value)}
								className="h-11 rounded-full border border-slate-300 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
							>
								{adminOrderStatusOptions.map((option) => (
									<option key={option} value={option}>
										{option}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>

				<div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
					<div className="border-b border-slate-200 px-6 py-4">
						<h2 className="text-lg font-bold text-slate-900">Danh sách đơn hàng</h2>
						<p className="mt-1 text-sm text-slate-500">
							Hiển thị {filteredOrders.length} đơn hàng phù hợp.
						</p>
					</div>

					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-slate-200">
							<thead className="bg-slate-50">
								<tr className="text-left text-sm font-semibold text-slate-600">
									<th className="px-6 py-4">Mã đơn</th>
									<th className="px-6 py-4">Khách hàng</th>
									<th className="px-6 py-4">Số điện thoại</th>
									<th className="px-6 py-4">Địa chỉ</th>
									<th className="px-6 py-4">Ngày đặt</th>
									<th className="px-6 py-4">Tổng tiền</th>
									<th className="px-6 py-4 text-center">Trạng thái</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-200 bg-white">
								{filteredOrders.length > 0 ? (
									filteredOrders.map((order) => (
										<tr
											key={order.id}
											onClick={() => handleOpenOrderModal(order)}
											className="cursor-pointer text-sm text-slate-700 transition hover:bg-slate-50"
										>
											<td className="px-6 py-4 font-medium text-slate-500">
												{order.id}
											</td>
											<td className="px-6 py-4 font-semibold text-slate-900">
												{order.customerName}
											</td>
											<td className="px-6 py-4">{order.phone}</td>
											<td className="px-6 py-4">{order.address}</td>
											<td className="px-6 py-4">{order.orderDate}</td>
											<td className="px-6 py-4 font-semibold text-slate-900">
												{formatCurrency(order.total)}
											</td>
											<td className="px-6 py-4 text-center">
												<span
													className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
														order.status
													)}`}
												>
													{order.status}
												</span>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td
											colSpan="7"
											className="px-6 py-10 text-center text-sm text-slate-500"
										>
											Không có đơn hàng nào phù hợp với bộ lọc hiện tại.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<ModalChiTietDonHang
				open={isOrderModalOpen}
				order={selectedOrder}
				onClose={handleCloseOrderModal}
				onUpdateStatus={handleUpdateOrderStatus}
			/>
		</>
	);
}

export default QuanLyDonHang;

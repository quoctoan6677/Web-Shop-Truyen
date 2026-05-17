import { useEffect, useMemo, useRef, useState } from "react";
import Search from "../../components/Search";
import ModalChiTietDonHang from "../../modals/ModalChiTietDonHang";
import { getAdminOrders, updateAdminOrderStatus } from "../../services/adminService";
import { getAuthToken, signOut } from "../../utils/auth";

const adminOrderStatusOptions = [
	"Tất cả trạng thái",
	"Chờ xác nhận",
	"Đang giao hàng",
	"Đã giao",
	"Đã hủy",
];

const adminOrderStatusOrder = {
	"Chờ xác nhận": 0,
	"Đang giao hàng": 1,
	"Đã giao": 2,
	"Đã hủy": 3,
};

function formatCurrency(value) {
	return `${Number(value || 0).toLocaleString("vi-VN")} đ`;
}

function formatOrderDate(value) {
	return new Date(value).toLocaleDateString("vi-VN");
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

function normalizeOrder(order) {
	return {
		...order,
		id: order.code,
		orderDateLabel: formatOrderDate(order.orderDate),
		items: (order.items || []).map((item) => ({
			...item,
			id: item.code,
		})),
	};
}

function QuanLyDonHang() {
	const [orders, setOrders] = useState([]);
	const [searchValue, setSearchValue] = useState("");
	const [selectedStatus, setSelectedStatus] = useState("Tất cả trạng thái");
	const [selectedOrderId, setSelectedOrderId] = useState(null);
	const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const hasFetchedOrdersRef = useRef(false);

	useEffect(() => {
		if (hasFetchedOrdersRef.current) {
			return;
		}

		hasFetchedOrdersRef.current = true;

		const fetchOrders = async () => {
			const token = getAuthToken();

			if (!token) {
				setErrorMessage("Phiên đăng nhập đã hết hạn.");
				return;
			}

			try {
				const response = await getAdminOrders(token);
				setOrders((response.orders || []).map(normalizeOrder));
				setErrorMessage("");
			} catch (error) {
				if (error.message === "Unauthorized. Invalid token.") {
					await signOut();
				}

				setErrorMessage(error.message || "Không thể tải danh sách đơn hàng.");
			}
		};

		fetchOrders();
	}, []);

	const filteredOrders = useMemo(() => {
		const normalizedSearch = searchValue.trim().toLowerCase();

		return [...orders]
			.filter((order) => {
				const matchesSearch =
					normalizedSearch.length === 0 ||
					order.code.toLowerCase().includes(normalizedSearch) ||
					order.customerName.toLowerCase().includes(normalizedSearch) ||
					order.phone.toLowerCase().includes(normalizedSearch);

				const matchesStatus =
					selectedStatus === "Tất cả trạng thái" || order.status === selectedStatus;

				return matchesSearch && matchesStatus;
			})
			.sort(
				(a, b) =>
					(adminOrderStatusOrder[a.status] ?? 999) -
					(adminOrderStatusOrder[b.status] ?? 999)
			);
	}, [orders, searchValue, selectedStatus]);

	const selectedOrder = useMemo(
		() => orders.find((order) => order._id === selectedOrderId) || null,
		[orders, selectedOrderId]
	);

	const handleOpenOrderModal = (order) => {
		setSelectedOrderId(order._id);
		setIsOrderModalOpen(true);
	};

	const handleCloseOrderModal = () => {
		setSelectedOrderId(null);
		setIsOrderModalOpen(false);
	};

	const handleUpdateOrderStatus = async (orderId, nextStatus) => {
		const token = getAuthToken();

		if (!token) {
			setErrorMessage("Phiên đăng nhập đã hết hạn.");
			return false;
		}

		try {
			const response = await updateAdminOrderStatus(token, orderId, nextStatus);
			const normalizedOrder = normalizeOrder(response.order);

			setOrders((prev) =>
				prev.map((order) =>
					order._id === normalizedOrder._id ? normalizedOrder : order
				)
			);
			setErrorMessage("");
			return true;
		} catch (error) {
			setErrorMessage(error.message || "Cập nhật trạng thái đơn hàng thất bại.");
			return false;
		}
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

				{errorMessage && (
					<div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
						{errorMessage}
					</div>
				)}

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
											key={order._id}
											onClick={() => handleOpenOrderModal(order)}
											className="cursor-pointer text-sm text-slate-700 transition hover:bg-slate-50"
										>
											<td className="px-6 py-4 font-medium text-slate-500">
												{order.code}
											</td>
											<td className="px-6 py-4 font-semibold text-slate-900">
												{order.customerName}
											</td>
											<td className="px-6 py-4">{order.phone}</td>
											<td className="px-6 py-4">{order.address}</td>
											<td className="px-6 py-4">{order.orderDateLabel}</td>
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

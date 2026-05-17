import { useEffect, useMemo, useState } from "react";
import { FiMinus, FiPlus, FiX } from "react-icons/fi";
import { getStoredUserProfile } from "../utils/userProfile";

function ModalMuaNgay({ product, products = [], open, onClose, onConfirmOrder }) {
	const [quantity, setQuantity] = useState(1);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [customerInfo, setCustomerInfo] = useState({
		fullName: "",
		phone: "",
		address: "",
		note: "",
	});

	const orderItems = useMemo(() => {
		if (products.length > 0) {
			return products;
		}

		if (product) {
			return [product];
		}

		return [];
	}, [product, products]);

	const isSingleProduct = orderItems.length === 1;

	useEffect(() => {
		if (!open) {
			return;
		}

		const userProfile = getStoredUserProfile();

		setQuantity(product?.quantity || 1);
		setErrorMessage("");
		setIsSubmitting(false);
		setCustomerInfo({
			fullName: userProfile.fullName,
			phone: userProfile.phone,
			address: userProfile.address,
			note: "",
		});
	}, [open, product]);

	const total = useMemo(() => {
		if (!isSingleProduct) {
			return orderItems.reduce(
				(sum, item) => sum + item.price * (item.quantity || 1),
				0
			);
		}

		return (orderItems[0]?.price || 0) * quantity;
	}, [isSingleProduct, orderItems, quantity]);

	if (!open || orderItems.length === 0) return null;

	const handleChange = (field, value) => {
		setCustomerInfo((prev) => ({
			...prev,
			[field]: value,
		}));
		setErrorMessage("");
	};

	const handleConfirmOrder = async () => {
		if (!customerInfo.fullName.trim() || !customerInfo.phone.trim() || !customerInfo.address.trim()) {
			setErrorMessage("Vui lòng nhập đầy đủ họ tên, số điện thoại và địa chỉ.");
			return;
		}

		if (!onConfirmOrder) {
			onClose();
			return;
		}

		setIsSubmitting(true);
		setErrorMessage("");

		try {
			const isSuccess = await onConfirmOrder({
				items: isSingleProduct
					? [{ ...singleItem, quantity }]
					: orderItems,
				customerInfo,
			});

			if (isSuccess) {
				onClose();
			}
		} catch (error) {
			setErrorMessage(error.message || "Tạo đơn hàng thất bại.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const singleItem = orderItems[0];

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
			<div className="relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
				<button
					type="button"
					onClick={onClose}
					className="absolute right-4 top-4 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 cursor-pointer"
					aria-label="Đóng popup đặt hàng"
				>
					<FiX className="h-5 w-5" />
				</button>

				<div className="grid gap-6 md:grid-cols-[280px_minmax(0,1fr)]">
					<div className="min-w-0">
						{isSingleProduct ? (
							<>
								<div className="overflow-hidden rounded-2xl border border-slate-200">
									<img
										src={singleItem.image}
										alt={singleItem.name}
										className="h-80 w-full object-cover"
									/>
								</div>

								<h2 className="mt-4 break-all text-2xl font-bold text-slate-900">
									{singleItem.name}
								</h2>
								<p className="mt-2 text-xl font-bold text-red-500">
									{singleItem.price.toLocaleString()} đ
								</p>

								<div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
									<span className="text-sm font-medium text-slate-600">
										Số lượng
									</span>
									<div className="flex items-center rounded-lg border border-slate-300 bg-white">
										<button
											type="button"
											onClick={() =>
												setQuantity((prev) => (prev > 1 ? prev - 1 : prev))
											}
											className="px-3 py-2 cursor-pointer hover:bg-slate-50"
										>
											<FiMinus className="h-4 w-4" />
										</button>
										<span className="min-w-10 text-center text-sm font-semibold text-slate-900">
											{quantity}
										</span>
										<button
											type="button"
											onClick={() => setQuantity((prev) => prev + 1)}
											className="px-3 py-2 cursor-pointer hover:bg-slate-50"
										>
											<FiPlus className="h-4 w-4" />
										</button>
									</div>
								</div>
							</>
						) : (
							<div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
								<div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
									<div>
										<p className="text-sm font-medium text-blue-600">
											Sản phẩm đã chọn
										</p>
										<h3 className="mt-1 text-lg font-bold text-slate-900">
											{orderItems.length} sản phẩm
										</h3>
									</div>
									<span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
										Đơn hàng từ giỏ
									</span>
								</div>

								<div className="mt-4 grid max-h-[430px] gap-3 overflow-y-auto pr-1">
									{orderItems.map((item) => (
										<div
											key={item.id}
											className="grid grid-cols-[64px_minmax(0,1fr)] gap-3 rounded-xl bg-white p-3"
										>
											<img
												src={item.image}
												alt={item.name}
												className="h-16 w-16 rounded-lg object-cover"
											/>
											<div className="min-w-0">
												<p className="break-all text-sm font-semibold text-slate-900">
													{item.name}
												</p>
												<div className="mt-2 flex items-center justify-between gap-3 text-sm text-slate-500">
													<span>SL: {item.quantity || 1}</span>
													<span className="font-semibold text-red-500">
														{(item.price * (item.quantity || 1)).toLocaleString()} đ
													</span>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>

					<div className="flex min-w-0 flex-col">
						<div>
							<p className="text-sm font-medium text-blue-600">Đặt hàng</p>
							<h3 className="mt-1 text-2xl font-bold text-slate-900">
								Thông tin nhận hàng
							</h3>
							<p className="mt-2 text-sm text-slate-500">
								Nhập nhanh thông tin để hoàn tất đơn đặt hàng cho sản phẩm này.
							</p>
						</div>

						<div className="mt-6 grid gap-4">
							<input
								type="text"
								value={customerInfo.fullName}
								onChange={(e) => handleChange("fullName", e.target.value)}
								placeholder="Họ và tên"
								className="h-11 rounded-lg border border-slate-300 px-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
							/>
							<input
								type="text"
								value={customerInfo.phone}
								onChange={(e) => handleChange("phone", e.target.value)}
								placeholder="Số điện thoại"
								className="h-11 rounded-lg border border-slate-300 px-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
							/>
							<input
								type="text"
								value={customerInfo.address}
								onChange={(e) => handleChange("address", e.target.value)}
								placeholder="Địa chỉ nhận hàng"
								className="h-11 rounded-lg border border-slate-300 px-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
							/>
							<textarea
								rows="4"
								value={customerInfo.note}
								onChange={(e) => handleChange("note", e.target.value)}
								placeholder="Ghi chú đơn hàng"
								className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
							/>
						</div>

						{errorMessage && (
							<div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
								{errorMessage}
							</div>
						)}

						<div className="mt-6 rounded-xl bg-slate-50 px-4 py-3">
							<div className="flex items-center justify-between text-sm text-slate-600">
								<span>Tạm tính</span>
								<span>{total.toLocaleString()} đ</span>
							</div>
							<div className="mt-3 flex items-center justify-between text-lg font-bold text-slate-900">
								<span>Tổng cộng</span>
								<span className="text-red-500">{total.toLocaleString()} đ</span>
							</div>
						</div>

						<div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-4">
							<button
								type="button"
								onClick={onClose}
								className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 cursor-pointer"
							>
								Hủy
							</button>
							<button
								type="button"
								onClick={handleConfirmOrder}
								disabled={isSubmitting}
								className="rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600 cursor-pointer disabled:cursor-not-allowed disabled:bg-slate-300"
							>
								{isSubmitting ? "Đang tạo đơn..." : "Xác nhận đặt hàng"}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ModalMuaNgay;

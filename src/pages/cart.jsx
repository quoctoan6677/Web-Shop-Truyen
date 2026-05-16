import { useMemo, useState } from "react";
import CartCard from "../components/CartCard";
import ModalMuaNgay from "../modals/ModalMuaNgay";

function Cart() {
	const [cart, setCart] = useState([
		{
			id: 1,
			name: "Doraemon tập 1",
			price: 24000,
			image:
				"https://product.hstatic.net/1000376556/product/xhljijuw_9de22abba6a2407d87e202d773acda07_1024x1024.png",
			quantity: 1,
			selected: false,
		},
		{
			id: 2,
			name: "Quần jean 1",
			price: 350000,
			image: "https://cdn-media.sforum.vn/storage/app/media/anh-dep-82.jpg",
			quantity: 1,
			selected: false,
		},
		{
			id: 3,
			name: "Quần jean 1",
			price: 350000,
			image: "https://cdn-media.sforum.vn/storage/app/media/anh-dep-82.jpg",
			quantity: 1,
			selected: false,
		},
		{
			id: 4,
			name: "Quần jean 1",
			price: 350000,
			image: "https://cdn-media.sforum.vn/storage/app/media/anh-dep-82.jpg",
			quantity: 1,
			selected: false,
		},
		{
			id: 5,
			name: "Quần jean 1",
			price: 350000,
			image: "https://cdn-media.sforum.vn/storage/app/media/anh-dep-82.jpg",
			quantity: 1,
			selected: false,
		},
		{
			id: 6,
			name: "Quần jean 1",
			price: 350000,
			image: "https://cdn-media.sforum.vn/storage/app/media/anh-dep-82.jpg",
			quantity: 1,
			selected: false,
		},
		{
			id: 7,
			name: "Quần jean 1",
			price: 350000,
			image: "https://cdn-media.sforum.vn/storage/app/media/anh-dep-82.jpg",
			quantity: 1,
			selected: false,
		},
		{
			id: 8,
			name: "Quần jean 1",
			price: 350000,
			image: "https://cdn-media.sforum.vn/storage/app/media/anh-dep-82.jpg",
			quantity: 1,
			selected: false,
		},
		{
			id: 9,
			name: "Quần jean 1",
			price: 350000,
			image: "https://cdn-media.sforum.vn/storage/app/media/anh-dep-82.jpg",
			quantity: 1,
			selected: false,
		},
		{
			id: 10,
			name: "Quần jean 1",
			price: 350000,
			image: "https://cdn-media.sforum.vn/storage/app/media/anh-dep-82.jpg",
			quantity: 1,
			selected: false,
		},
	]);
	const [openBuyNowModal, setOpenBuyNowModal] = useState(false);

	const allSelected = cart.length > 0 && cart.every((item) => item.selected);
	const selectedItems = useMemo(
		() => cart.filter((item) => item.selected),
		[cart]
	);

	const selectedSummary = useMemo(() => {
		return cart.reduce(
			(summary, item) => {
				if (!item.selected) {
					return summary;
				}

				summary.count += 1;
				summary.total += item.price * item.quantity;
				return summary;
			},
			{ count: 0, total: 0 }
		);
	}, [cart]);

	const handleRemoveFromCart = (id) => {
		setCart((prev) => prev.filter((item) => item.id !== id));
	};

	const handleToggleSelect = (id) => {
		setCart((prev) =>
			prev.map((item) =>
				item.id === id ? { ...item, selected: !item.selected } : item
			)
		);
	};

	const handleToggleSelectAll = () => {
		const nextSelectedState = !allSelected;
		setCart((prev) =>
			prev.map((item) => ({
				...item,
				selected: nextSelectedState,
			}))
		);
	};

	const handleUpdateQuantity = (id, quantity) => {
		setCart((prev) =>
			prev.map((item) => (item.id === id ? { ...item, quantity } : item))
		);
	};

	const handleBuySelectedItems = () => {
		if (selectedItems.length === 0) {
			return;
		}

		setOpenBuyNowModal(true);
	};

	const handleCloseBuyNowModal = () => {
		setOpenBuyNowModal(false);
	};

	const handleConfirmOrder = () => {
		const selectedIds = new Set(selectedItems.map((item) => item.id));

		setCart((prev) =>
			prev
				.filter((item) => !selectedIds.has(item.id))
				.map((item) => ({
					...item,
					selected: false,
				}))
		);
	};

	return (
		<section>
			<div className="grid grid-cols-[40px_1fr_160px_160px_160px_80px] gap-4 rounded-lg bg-gray-200 p-3 font-medium text-gray-500">
				<div className="flex items-center justify-center">
					<input
						type="checkbox"
						checked={allSelected}
						onChange={handleToggleSelectAll}
						className="h-4 w-4 cursor-pointer"
					/>
				</div>
				<div className="ml-3">Sản phẩm</div>
				<div className="text-center">Đơn giá</div>
				<div className="text-center">Số lượng</div>
				<div className="text-center">Thành tiền</div>
				<div className="text-center">Xóa</div>
			</div>

			<div>
				{cart.length === 0 ? (
					<p className="mt-10 text-center text-gray-500">
						Giỏ hàng của bạn đang trống.
					</p>
				) : (
					cart.map((item) => (
						<CartCard
							key={item.id}
							item={item}
							onRemove={handleRemoveFromCart}
							onToggleSelect={handleToggleSelect}
							onUpdateQuantity={handleUpdateQuantity}
						/>
					))
				)}
			</div>

			<div className="sticky bottom-0 z-10 mt-6 grid h-20 grid-cols-[40px_1fr_400px_200px] items-center gap-4 rounded-lg bg-white px-8 p-3 font-medium shadow-md">
				<div className="flex justify-center">
					<input
						type="checkbox"
						checked={allSelected}
						onChange={handleToggleSelectAll}
						className="h-4 w-4 cursor-pointer"
					/>
				</div>
				<div>Chọn tất cả ({selectedSummary.count})</div>
				<div>
					Tổng cộng:{" "}
					<span className="font-bold text-red-500">
						{selectedSummary.total.toLocaleString()} đ
					</span>
				</div>
				<button
					type="button"
					onClick={handleBuySelectedItems}
					disabled={selectedItems.length === 0}
					className="flex items-center justify-center rounded-lg border bg-blue-500 text-white transition hover:bg-blue-600 cursor-pointer disabled:cursor-not-allowed disabled:bg-slate-300"
				>
					<div className="p-2">Mua hàng</div>
				</button>
			</div>

			<ModalMuaNgay
				products={selectedItems}
				open={openBuyNowModal}
				onClose={handleCloseBuyNowModal}
				onConfirmOrder={handleConfirmOrder}
			/>
		</section>
	);
}

export default Cart;

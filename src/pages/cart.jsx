import { useEffect, useMemo, useRef, useState } from "react";
import CartCard from "../components/CartCard";
import ModalMuaNgay from "../modals/ModalMuaNgay";
import {
	deleteCartItem,
	getCart,
	updateCartItem,
} from "../services/cartService";
import { createOrder } from "../services/orderService";
import { getAuthToken } from "../utils/auth";

function mapCartItem(item) {
	return {
		id: item._id,
		productId: item.productInfo?._id || item.product,
		name: item.productInfo?.name || "",
		price: item.productInfo?.price || 0,
		image: item.productInfo?.image || "",
		quantity: item.quantity,
		selected: item.selected,
	};
}

function Cart() {
	const [cart, setCart] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isUpdating, setIsUpdating] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [openBuyNowModal, setOpenBuyNowModal] = useState(false);
	const hasFetchedCartRef = useRef(false);

	useEffect(() => {
		if (hasFetchedCartRef.current) {
			return;
		}

		hasFetchedCartRef.current = true;

		const fetchCart = async () => {
			const token = getAuthToken();

			if (!token) {
				setErrorMessage("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
				setIsLoading(false);
				return;
			}

			setIsLoading(true);
			setErrorMessage("");

			try {
				const response = await getCart(token);
				setCart((response.cartItems || []).map(mapCartItem));
			} catch (error) {
				setErrorMessage(error.message || "Không thể tải giỏ hàng.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchCart();
	}, []);

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

	const updateLocalCartItem = (updatedItem) => {
		setCart((prev) =>
			prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
		);
	};

	const submitCartUpdate = async (cartItemId, payload) => {
		const token = getAuthToken();

		if (!token) {
			setErrorMessage("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
			return null;
		}

		setIsUpdating(true);
		setErrorMessage("");

		try {
			const response = await updateCartItem(token, cartItemId, payload);
			const mappedItem = mapCartItem(response.cartItem);
			updateLocalCartItem(mappedItem);
			return mappedItem;
		} catch (error) {
			setErrorMessage(error.message || "Cập nhật giỏ hàng thất bại.");
			return null;
		} finally {
			setIsUpdating(false);
		}
	};

	const handleRemoveFromCart = async (id) => {
		const token = getAuthToken();

		if (!token) {
			setErrorMessage("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
			return;
		}

		setIsUpdating(true);
		setErrorMessage("");

		try {
			await deleteCartItem(token, id);
			setCart((prev) => prev.filter((item) => item.id !== id));
		} catch (error) {
			setErrorMessage(error.message || "Xóa sản phẩm khỏi giỏ hàng thất bại.");
		} finally {
			setIsUpdating(false);
		}
	};

	const handleToggleSelect = async (id) => {
		const item = cart.find((cartItem) => cartItem.id === id);

		if (!item) {
			return;
		}

		await submitCartUpdate(id, {
			selected: !item.selected,
		});
	};

	const handleToggleSelectAll = async () => {
		const nextSelectedState = !allSelected;
		await Promise.all(
			cart.map((item) =>
				submitCartUpdate(item.id, {
					selected: nextSelectedState,
				})
			)
		);
	};

	const handleUpdateQuantity = async (id, quantity) => {
		await submitCartUpdate(id, { quantity });
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

	const handleConfirmOrder = async ({ items, customerInfo }) => {
		const token = getAuthToken();

		if (!token) {
			throw new Error("Phiên đăng nhập đã hết hạn.");
		}

		await createOrder(token, {
			customerInfo,
			items: items.map((item) => ({
				productId: item.productId,
				quantity: item.quantity || 1,
				cartItemId: item.id,
			})),
		});

		const selectedIds = new Set(items.map((item) => item.id));
		setCart((prev) => prev.filter((item) => !selectedIds.has(item.id)));
		return true;
	};

	return (
		<section>
			<div className="grid grid-cols-[40px_1fr_160px_160px_160px_80px] gap-4 rounded-lg bg-gray-200 p-3 font-medium text-gray-500">
				<div className="flex items-center justify-center">
					<input
						type="checkbox"
						checked={allSelected}
						onChange={handleToggleSelectAll}
						disabled={isLoading || isUpdating || cart.length === 0}
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
				{errorMessage ? (
					<div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
						{errorMessage}
					</div>
				) : cart.length === 0 ? (
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
						disabled={isLoading || isUpdating || cart.length === 0}
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
					disabled={selectedItems.length === 0 || isUpdating}
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

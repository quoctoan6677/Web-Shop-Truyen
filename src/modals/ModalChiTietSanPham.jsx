import { useEffect, useState } from "react";
import { FiShoppingCart, FiX } from "react-icons/fi";
import { getProductById } from "../services/productService";

function ModalChiTietSanPham({
	product,
	open,
	onClose,
	onAddToCart,
	onBuyNow,
}) {
	const [quantity, setQuantity] = useState(1);
	const [productDetail, setProductDetail] = useState(product);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		if (!open || !product?._id) {
			return;
		}

		setQuantity(1);
		setProductDetail(product);
		setIsLoading(true);
		setErrorMessage("");

		const fetchProductDetail = async () => {
			try {
				const response = await getProductById(product._id);
				setProductDetail(response.product);
			} catch (error) {
				setErrorMessage(error.message || "Khong the tai chi tiet san pham.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchProductDetail();
	}, [open, product]);

	const increase = () => setQuantity((prev) => prev + 1);
	const decrease = () => {
		if (quantity > 1) {
			setQuantity((prev) => prev - 1);
		}
	};

	if (!open || !product) return null;

	const currentProduct = productDetail || product;
	const total = currentProduct.price * quantity;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
			<div className="relative h-[600px] w-full max-w-[800px] overflow-hidden rounded-2xl bg-white p-6 shadow-xl md:p-8">
				<button
					onClick={onClose}
					className="absolute right-4 top-4 rounded-full p-2 text-gray-500 transition hover:bg-gray-100 cursor-pointer"
				>
					<FiX className="h-5 w-5" />
				</button>

				<div className="grid h-full min-h-0 gap-6 md:grid-cols-[minmax(260px,320px)_minmax(0,1fr)]">
					<div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200">
						<img
							src={currentProduct.image}
							alt={currentProduct.name}
							className="h-full max-h-full w-full object-cover"
						/>
					</div>

					<div className="flex h-full min-h-0 min-w-0 flex-col justify-between overflow-hidden">
						<div className="min-h-0 min-w-0 overflow-hidden">
							<h2 className="break-words pr-10 text-2xl font-bold text-slate-900 md:text-3xl">
								{currentProduct.name}
							</h2>

							<p className="mt-2 text-sm text-slate-500">
								Ma san pham: {currentProduct.code || "Dang cap nhat"}
							</p>

							<p className="mt-3 text-sm font-medium text-slate-700">
								Tom tat noi dung:
							</p>

							<div className="mt-2 max-h-[220px] min-h-0 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4">
								{isLoading ? (
									<p className="text-sm leading-7 text-slate-600">
										Dang tai chi tiet san pham...
									</p>
								) : errorMessage ? (
									<p className="text-sm leading-7 text-red-600">{errorMessage}</p>
								) : (
									<p className="break-words text-sm leading-7 text-slate-600">
										{currentProduct.description || "Chua co mo ta san pham."}
									</p>
								)}
							</div>

							<div className="mt-6 flex max-w-full items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3">
								<div className="flex max-w-full items-center justify-center rounded-lg border border-slate-300 bg-white">
									<button
										onClick={decrease}
										className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
									>
										-
									</button>
									<span className="px-4">{quantity}</span>
									<button
										onClick={increase}
										className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
									>
										+
									</button>
								</div>
								<p className="max-w-[180px] whitespace-nowrap text-right text-2xl font-bold text-red-500">
									{total.toLocaleString()} d
								</p>
							</div>
						</div>

						<div className="mt-6 flex shrink-0 gap-2 border-t border-slate-200 pt-4">
							<button
								onClick={() => onAddToCart({ ...currentProduct, quantity })}
								className="flex min-w-0 flex-1 items-center justify-center rounded-xl border border-gray-300 px-6 cursor-pointer transition hover:bg-gray-200"
							>
								<FiShoppingCart className="h-6 w-6" />
							</button>

							<button
								onClick={() => onBuyNow({ ...currentProduct, quantity })}
								className="flex min-w-0 flex-1 items-center justify-center rounded-xl bg-blue-500 px-4 py-3 text-center font-semibold text-white transition hover:bg-blue-600 cursor-pointer"
							>
								Mua ngay
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ModalChiTietSanPham;

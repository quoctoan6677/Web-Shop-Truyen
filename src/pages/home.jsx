import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiX } from "react-icons/fi";
import ProductCard from "../components/ProductCard";
import { storefrontProducts } from "../data/products";
import ModalChiTietSanPham from "../modals/ModalChiTietSanPham";
import ModalMuaNgay from "../modals/ModalMuaNgay";

function normalizeSearchText(value) {
	return (value || "")
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/đ/g, "d")
		.replace(/Đ/g, "D")
		.toLowerCase()
		.trim();
}

function isLooseSubsequenceMatch(query, target) {
	let queryIndex = 0;

	for (let i = 0; i < target.length && queryIndex < query.length; i += 1) {
		if (target[i] === query[queryIndex]) {
			queryIndex += 1;
		}
	}

	return queryIndex === query.length;
}

function getSearchScore(product, normalizedQuery) {
	const normalizedName = normalizeSearchText(product.name);
	const normalizedDescription = normalizeSearchText(product.description);
	const searchableText = `${normalizedName} ${normalizedDescription}`;
	const compactQuery = normalizedQuery.replace(/\s+/g, "");
	const compactText = searchableText.replace(/\s+/g, "");
	const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);

	if (!normalizedQuery) {
		return 1;
	}

	if (normalizedName.includes(normalizedQuery)) {
		return 5;
	}

	if (searchableText.includes(normalizedQuery)) {
		return 4;
	}

	if (
		queryTokens.length > 0 &&
		queryTokens.every(
			(token) =>
				normalizedName.includes(token) || normalizedDescription.includes(token)
		)
	) {
		return 3;
	}

	if (isLooseSubsequenceMatch(compactQuery, normalizedName.replace(/\s+/g, ""))) {
		return 2;
	}

	if (isLooseSubsequenceMatch(compactQuery, compactText)) {
		return 1;
	}

	return 0;
}

function Home() {
	const [cart, setCart] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [openDetailModal, setOpenDetailModal] = useState(false);
	const [buyNowProduct, setBuyNowProduct] = useState(null);
	const [openBuyNowModal, setOpenBuyNowModal] = useState(false);
	const [showToast, setShowToast] = useState(false);
	const hideToastTimeoutRef = useRef(null);
	const [searchParams] = useSearchParams();

	const itemsPerPage = 10;
	const rawSearchQuery = searchParams.get("q")?.trim() || "";
	const normalizedSearchQuery = normalizeSearchText(rawSearchQuery);
	const activeCategory = searchParams.get("category") || "Tất cả";

	useEffect(() => {
		return () => {
			if (hideToastTimeoutRef.current) {
				clearTimeout(hideToastTimeoutRef.current);
			}
		};
	}, []);

	useEffect(() => {
		setCurrentPage(1);
	}, [normalizedSearchQuery, activeCategory]);

	const handleCloseToast = () => {
		setShowToast(false);

		if (hideToastTimeoutRef.current) {
			clearTimeout(hideToastTimeoutRef.current);
			hideToastTimeoutRef.current = null;
		}
	};

	const filteredProducts = useMemo(() => {
		const categoryMatchedProducts =
			activeCategory === "Tất cả"
				? storefrontProducts
				: storefrontProducts.filter(
						(product) => product.category === activeCategory
					);

		if (!normalizedSearchQuery) {
			return categoryMatchedProducts;
		}

		return categoryMatchedProducts
			.map((product) => ({
				product,
				score: getSearchScore(product, normalizedSearchQuery),
			}))
			.filter((item) => item.score > 0)
			.sort((a, b) => b.score - a.score)
			.map((item) => item.product);
	}, [activeCategory, normalizedSearchQuery]);

	const startIndex = (currentPage - 1) * itemsPerPage;
	const currentProducts = filteredProducts.slice(
		startIndex,
		startIndex + itemsPerPage
	);
	const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));

	const handleAddToCart = (product) => {
		const nextCart = [...cart, product];
		setCart(nextCart);
		console.log("Cart:", nextCart);
		setShowToast(true);

		if (hideToastTimeoutRef.current) {
			clearTimeout(hideToastTimeoutRef.current);
		}

		hideToastTimeoutRef.current = setTimeout(() => {
			handleCloseToast();
		}, 2000);
	};

	const handleViewDetail = (product) => {
		setSelectedProduct(product);
		setOpenDetailModal(true);
	};

	const handleCloseDetailModal = () => {
		setOpenDetailModal(false);
	};

	const handleBuyNow = (product) => {
		setBuyNowProduct(product);
		setOpenDetailModal(false);
		setOpenBuyNowModal(true);
	};

	const handleCloseBuyNowModal = () => {
		setOpenBuyNowModal(false);
	};

	const changePage = (page) => {
		if (page < 1 || page > totalPages) {
			return;
		}

		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
			{showToast && (
				<div className="fixed right-4 top-4 z-50 flex items-center gap-3 rounded-xl bg-green-500 px-4 py-3 text-sm font-medium text-white shadow-lg">
					<span>Sản phẩm đã được thêm vào giỏ</span>
					<button
						type="button"
						onClick={handleCloseToast}
						className="cursor-pointer rounded-full p-1 text-white/90 transition hover:bg-white/15 hover:text-white"
						aria-label="Đóng thông báo"
					>
						<FiX className="h-4 w-4" />
					</button>
				</div>
			)}

			{(rawSearchQuery || activeCategory !== "Tất cả") && (
				<div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
					{rawSearchQuery && (
						<p>
							Kết quả tìm kiếm cho:{" "}
							<span className="font-semibold text-slate-900">{rawSearchQuery}</span>
						</p>
					)}
					{activeCategory !== "Tất cả" && (
						<p>
							Thể loại đang chọn:{" "}
							<span className="font-semibold text-slate-900">{activeCategory}</span>
						</p>
					)}
				</div>
			)}

			<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
				{currentProducts.map((product, index) => (
					<ProductCard
						key={startIndex + index}
						product={product}
						onAddToCart={handleAddToCart}
						onViewDetail={handleViewDetail}
					/>
				))}
			</div>

			{filteredProducts.length === 0 && (
				<p className="mt-10 text-center text-slate-500">
					Không tìm thấy sản phẩm phù hợp.
				</p>
			)}

			{filteredProducts.length > 0 && (
				<div className="mt-6 flex items-center justify-center gap-2">
					<button
						onClick={() => changePage(currentPage - 1)}
						disabled={currentPage === 1}
						className="cursor-pointer rounded border px-3 py-1 disabled:opacity-30 hover:bg-gray-100"
					>
						Trước
					</button>

					{Array.from({ length: totalPages }, (_, i) => (
						<button
							key={i}
							onClick={() => changePage(i + 1)}
							className={`cursor-pointer rounded border px-3 py-1 ${
								currentPage === i + 1
									? "bg-blue-500 text-white"
									: "hover:bg-gray-100"
							}`}
						>
							{i + 1}
						</button>
					))}

					<button
						onClick={() => changePage(currentPage + 1)}
						disabled={currentPage === totalPages}
						className="cursor-pointer rounded border px-3 py-1 disabled:opacity-30 hover:bg-gray-100"
					>
						Sau
					</button>
				</div>
			)}

			<ModalChiTietSanPham
				product={selectedProduct}
				open={openDetailModal}
				onClose={handleCloseDetailModal}
				onAddToCart={handleAddToCart}
				onBuyNow={handleBuyNow}
			/>

			<ModalMuaNgay
				product={buyNowProduct}
				open={openBuyNowModal}
				onClose={handleCloseBuyNowModal}
			/>
		</section>
	);
}

export default Home;

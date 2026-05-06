import { useState } from "react";
import ProductCard from "../components/ProductCard";

const products = [
	{
		id: 1,
		name: "Doraemon tập 1",
		price: 24000,
		image:
			"https://product.hstatic.net/1000376556/product/xhljijuw_9de22abba6a2407d87e202d773acda07_1024x1024.png",
	},
	...Array.from({ length: 15 }, (_, i) => ({
		id: i + 2,
		name: "Quần jean 1 " + (i + 1),
		price: 350000,
		image:
			"https://cdn-media.sforum.vn/storage/app/media/anh-dep-82.jpg",
	})),
];

function Home() {
	const [cart, setCart] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);

	const itemsPerPage = 10;

	// Tính toán phân trang
	const startIndex = (currentPage - 1) * itemsPerPage;
	const currentProducts = products.slice(
		startIndex,
		startIndex + itemsPerPage
	);
	const totalPages = Math.ceil(products.length / itemsPerPage);

	const handleAddToCart = (product) => {
		setCart([...cart, product]);
		console.log("Cart:", [...cart, product]);
	};

	const handleViewDetail = (product) => {
		console.log("View:", product);
	};

	// Chuyển trang + scroll lên đầu
	const changePage = (page) => {
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
			{/* PRODUCT LIST */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
				{currentProducts.map((product, index) => (
					<ProductCard
						key={startIndex + index}
						product={product}
						onAddToCart={handleAddToCart}
						onViewDetail={handleViewDetail}
					/>
				))}
			</div>

			{/* PAGINATION */}
			<div className="flex justify-center items-center gap-2 mt-6">
				{/* Prev */}
				<button
					onClick={() => changePage(currentPage - 1)}
					disabled={currentPage === 1}
					className="px-3 py-1 border rounded cursor-pointer disabled:opacity-30 hover:bg-gray-100"
				>
					Prev
				</button>

				{/* Page numbers */}
				{Array.from({ length: totalPages }, (_, i) => (
					<button
						key={i}
						onClick={() => changePage(i + 1)}
						className={`px-3 py-1 border rounded cursor-pointer ${
							currentPage === i + 1
								? "bg-blue-500 text-white"
								: "hover:bg-gray-100"
						}`}
					>
						{i + 1}
					</button>
				))}

				{/* Next */}
				<button
					onClick={() => changePage(currentPage + 1)}
					disabled={currentPage === totalPages}
					className="px-3 py-1 border rounded cursor-pointer disabled:opacity-30 hover:bg-gray-100"
				>
					Next
				</button>
			</div>
		</section>
	);
}

export default Home;
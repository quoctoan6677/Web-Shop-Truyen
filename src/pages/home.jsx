import { useState } from "react";
import ProductCard from "../components/ProductCard";
import ModalChiTietSanPham from "../modals/ModalChiTietSanPham";

const products = [
	{
		id: 1,
		name: "Doraemon tập 1",
		price: 24000,
		image:
			"https://cdn2.fptshop.com.vn/unsafe/Uploads/images/tin-tuc/157765/Originals/15(1).jpg",
	},
	...Array.from({ length: 15 }, (_, i) => ({
		id: i + 2,
		name: "Quần jean 11233333322222222222222222222222222 " + (i + 1),
		price: 350000,
		image:
			"https://i.pinimg.com/736x/b7/86/ff/b786ffa545f7c01196c5ba83aa092e8f.jpg",
	})),
];

function Home() {
	const [cart, setCart] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [openModal, setOpenModal] = useState(false); 

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
		setSelectedProduct(product);
		setOpenModal(true);
	};
	const handleCloseModal = () => {
		setOpenModal(false);
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
					Trước
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
					Sau
				</button>
			</div>
			<ModalChiTietSanPham
				product={selectedProduct}
				open={openModal}
				onClose={handleCloseModal}
				onAddToCart={handleAddToCart}
			/>
		</section>
	);
}

export default Home;
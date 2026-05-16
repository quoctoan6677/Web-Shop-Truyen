import { useMemo, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import Search from "../../components/Search";
import ModalCapNhatSanPham from "../../modals/ModalCapNhatSanPham";
import ModalThemSanPham from "../../modals/ModalThemSanPham";

function syncProductStatus(product) {
	const stock = Number(product.stock) || 0;

	return {
		...product,
		stock,
		status: stock === 0 ? "Hết hàng" : "Còn hàng",
	};
}

function generateNextProductId(products) {
	const maxId = products.reduce((currentMax, product) => {
		const numericId = Number(product.id.replace("SP", "")) || 0;
		return Math.max(currentMax, numericId);
	}, 0);

	return `SP${String(maxId + 1).padStart(3, "0")}`;
}

const initialProducts = [
	{
		id: "SP001",
		name: "Doraemon tập 1",
		category: "Truyện tranh",
		price: 24000,
		stock: 18,
		status: "Còn hàng",
		description: "Tập mở đầu của bộ truyện Doraemon quen thuộc.",
		image: "https://picsum.photos/seed/doraemon/400/500",
	},
	{
		id: "SP002",
		name: "Thám tử lừng danh Conan tập 12",
		category: "Truyện tranh",
		price: 28000,
		stock: 12,
		status: "Còn hàng",
		description: "Một vụ án mới cùng những manh mối đầy bất ngờ.",
		image: "https://picsum.photos/seed/conan/400/500",
	},
	{
		id: "SP003",
		name: "Combo Harry Potter 7 tập",
		category: "Combo",
		price: 890000,
		stock: 4,
		status: "Còn hàng",
		description: "Trọn bộ tiểu thuyết kinh điển dành cho người yêu phép thuật.",
		image: "https://picsum.photos/seed/harrypotter/400/500",
	},
	{
		id: "SP004",
		name: "Nhà giả kim",
		category: "Truyện chữ",
		price: 86000,
		stock: 0,
		status: "Hết hàng",
		description: "Tác phẩm nổi tiếng của Paulo Coelho.",
		image: "https://picsum.photos/seed/nhagiakim/400/500",
	},
	{
		id: "SP005",
		name: "Tuổi trẻ đáng giá bao nhiêu",
		category: "Truyện chữ",
		price: 78000,
		stock: 0,
		status: "Hết hàng",
		description: "Cuốn sách truyền cảm hứng cho người trẻ.",
		image: "https://picsum.photos/seed/tuoitre/400/500",
	},
	{
		id: "SP006",
		name: "Combo Sherlock Holmes",
		category: "Combo",
		price: 420000,
		stock: 7,
		status: "Còn hàng",
		description: "Bộ sưu tập các vụ án kinh điển của Sherlock Holmes.",
		image: "https://picsum.photos/seed/sherlock/400/500",
	},
].map(syncProductStatus);

const categoryOptions = ["Tất cả thể loại", "Truyện chữ", "Truyện tranh", "Combo"];
const statusOptions = ["Tất cả trạng thái", "Còn hàng", "Hết hàng"];

function formatCurrency(value) {
	return `${value.toLocaleString("vi-VN")} đ`;
}

function QuanLySanPham() {
	const [products, setProducts] = useState(initialProducts);
	const [searchValue, setSearchValue] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("Tất cả thể loại");
	const [selectedStatus, setSelectedStatus] = useState("Tất cả trạng thái");
	const [editingProduct, setEditingProduct] = useState(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

	const filteredProducts = useMemo(() => {
		const normalizedSearch = searchValue.trim().toLowerCase();

		return products.filter((product) => {
			const matchesSearch =
				normalizedSearch.length === 0 ||
				product.name.toLowerCase().includes(normalizedSearch) ||
				product.id.toLowerCase().includes(normalizedSearch) ||
				product.category.toLowerCase().includes(normalizedSearch);

			const matchesCategory =
				selectedCategory === "Tất cả thể loại" ||
				product.category === selectedCategory;

			const matchesStatus =
				selectedStatus === "Tất cả trạng thái" ||
				product.status === selectedStatus;

			return matchesSearch && matchesCategory && matchesStatus;
		});
	}, [products, searchValue, selectedCategory, selectedStatus]);

	const handleOpenEditModal = (product) => {
		setEditingProduct(product);
		setIsEditModalOpen(true);
	};

	const handleCloseEditModal = () => {
		setEditingProduct(null);
		setIsEditModalOpen(false);
	};

	const handleSaveProduct = (updatedProduct) => {
		const normalizedProduct = syncProductStatus(updatedProduct);

		setProducts((prev) =>
			prev.map((product) =>
				product.id === normalizedProduct.id ? normalizedProduct : product
			)
		);
		handleCloseEditModal();
	};

	const handleOpenCreateModal = () => {
		setIsCreateModalOpen(true);
	};

	const handleCloseCreateModal = () => {
		setIsCreateModalOpen(false);
	};

	const handleCreateProduct = (newProduct) => {
		const normalizedProduct = syncProductStatus({
			...newProduct,
			id: generateNextProductId(products),
		});

		setProducts((prev) => [normalizedProduct, ...prev]);
		handleCloseCreateModal();
	};

	const handleDeleteProduct = (productToDelete) => {
		const shouldDelete = window.confirm(
			`Bạn có chắc muốn xóa sản phẩm "${productToDelete.name}" không?`
		);

		if (!shouldDelete) {
			return;
		}

		setProducts((prev) =>
			prev.filter((product) => product.id !== productToDelete.id)
		);
	};

	return (
		<>
			<div className="space-y-6">
				<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
					<div className="flex flex-col gap-5">
						<div>
							<h1 className="text-2xl font-bold text-slate-900">
								Quản lý sản phẩm
							</h1>
						</div>

						<div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px_220px_220px]">
							<Search
								value={searchValue}
								onChange={(e) => setSearchValue(e.target.value)}
								onSearch={() => {}}
								placeholder="Tìm theo tên, mã hoặc thể loại..."
								ariaLabel="Tìm kiếm sản phẩm"
							/>

							<select
								value={selectedCategory}
								onChange={(e) => setSelectedCategory(e.target.value)}
								className="h-11 rounded-full border border-slate-300 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
							>
								{categoryOptions.map((option) => (
									<option key={option} value={option}>
										{option}
									</option>
								))}
							</select>

							<select
								value={selectedStatus}
								onChange={(e) => setSelectedStatus(e.target.value)}
								className="h-11 rounded-full border border-slate-300 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
							>
								{statusOptions.map((option) => (
									<option key={option} value={option}>
										{option}
									</option>
								))}
							</select>

							<button
								type="button"
								onClick={handleOpenCreateModal}
								className="flex h-11 items-center justify-center gap-2 rounded-full bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 cursor-pointer"
							>
								<FiPlus className="h-4 w-4" />
								<span>Thêm sản phẩm mới</span>
							</button>
						</div>
					</div>
				</div>

				<div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
					<div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
						<div>
							<h2 className="text-lg font-bold text-slate-900">
								Danh sách sản phẩm
							</h2>
							<p className="mt-1 text-sm text-slate-500">
								Hiển thị {filteredProducts.length} sản phẩm phù hợp.
							</p>
						</div>
					</div>

					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-slate-200">
							<thead className="bg-slate-50">
								<tr className="text-left text-sm font-semibold text-slate-600">
									<th className="px-6 py-4">Mã SP</th>
									<th className="px-6 py-4">Tên sản phẩm</th>
									<th className="px-6 py-4">Thể loại</th>
									<th className="px-6 py-4">Đơn giá</th>
									<th className="px-6 py-4 text-center">Tồn kho</th>
									<th className="px-6 py-4 text-center">Trạng thái</th>
									<th className="px-6 py-4 text-center">Thao tác</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-200 bg-white">
								{filteredProducts.length > 0 ? (
									filteredProducts.map((product) => (
										<tr key={product.id} className="text-sm text-slate-700">
											<td className="px-6 py-4 font-medium text-slate-500">
												{product.id}
											</td>
											<td className="px-6 py-4 font-semibold text-slate-900">
												{product.name}
											</td>
											<td className="px-6 py-4">{product.category}</td>
											<td className="px-6 py-4">
												{formatCurrency(product.price)}
											</td>
											<td className="px-6 py-4 text-center">{product.stock}</td>
											<td className="px-6 py-4 text-center">
												<span
													className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
														product.status === "Còn hàng"
															? "bg-emerald-50 text-emerald-600"
															: "bg-red-50 text-red-500"
													}`}
												>
													{product.status}
												</span>
											</td>
											<td className="px-6 py-4">
												<div className="flex flex-wrap justify-center gap-2">
													<button
														type="button"
														onClick={() => handleOpenEditModal(product)}
														className="flex h-7 w-7 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-600 transition hover:bg-blue-100 cursor-pointer"
														aria-label={`Cập nhật sản phẩm ${product.name}`}
													>
														<FiEdit2 className="h-4 w-4" />
													</button>
													<button
														type="button"
														onClick={() => handleDeleteProduct(product)}
														className="flex h-7 w-7 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-500 transition hover:bg-red-100 cursor-pointer"
														aria-label={`Xóa sản phẩm ${product.name}`}
													>
														<FiTrash2 className="h-4 w-4" />
													</button>
												</div>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td
											colSpan="7"
											className="px-6 py-10 text-center text-sm text-slate-500"
										>
											Không có sản phẩm nào phù hợp với bộ lọc hiện tại.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<ModalCapNhatSanPham
				open={isEditModalOpen}
				product={editingProduct}
				onClose={handleCloseEditModal}
				onSave={handleSaveProduct}
			/>
			<ModalThemSanPham
				open={isCreateModalOpen}
				onClose={handleCloseCreateModal}
				onSave={handleCreateProduct}
			/>
		</>
	);
}

export default QuanLySanPham;

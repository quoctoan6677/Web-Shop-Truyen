import { useEffect, useMemo, useRef, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import Search from "../../components/Search";
import ModalCapNhatSanPham from "../../modals/ModalCapNhatSanPham";
import ModalThemSanPham from "../../modals/ModalThemSanPham";
import {
	createAdminProduct,
	deleteAdminProduct,
	getAdminProducts,
	updateAdminProduct,
} from "../../services/adminService";
import { getAuthToken, signOut } from "../../utils/auth";

const productCategoryOptions = ["Tất cả thể loại", "Truyện chữ", "Truyện tranh", "Combo"];
const productStatusOptions = ["Tất cả trạng thái", "Còn hàng", "Hết hàng"];

function formatCurrency(value) {
	return `${Number(value || 0).toLocaleString("vi-VN")} đ`;
}

function normalizeProduct(product) {
	return {
		...product,
		id: product.code,
		price: Number(product.price || 0),
		stock: Number(product.stock || 0),
	};
}

function QuanLySanPham() {
	const [products, setProducts] = useState([]);
	const [searchValue, setSearchValue] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("Tất cả thể loại");
	const [selectedStatus, setSelectedStatus] = useState("Tất cả trạng thái");
	const [editingProduct, setEditingProduct] = useState(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const hasFetchedProductsRef = useRef(false);

	useEffect(() => {
		if (hasFetchedProductsRef.current) {
			return;
		}

		hasFetchedProductsRef.current = true;

		const fetchProducts = async () => {
			const token = getAuthToken();

			if (!token) {
				setErrorMessage("Phiên đăng nhập đã hết hạn.");
				return;
			}

			try {
				const response = await getAdminProducts(token);
				setProducts((response.products || []).map(normalizeProduct));
				setErrorMessage("");
			} catch (error) {
				if (error.message === "Unauthorized. Invalid token.") {
					await signOut();
				}

				setErrorMessage(error.message || "Không thể tải danh sách sản phẩm.");
			}
		};

		fetchProducts();
	}, []);

	const filteredProducts = useMemo(() => {
		const normalizedSearch = searchValue.trim().toLowerCase();

		return products.filter((product) => {
			const matchesSearch =
				normalizedSearch.length === 0 ||
				product.name.toLowerCase().includes(normalizedSearch) ||
				product.code.toLowerCase().includes(normalizedSearch) ||
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

	const handleSaveProduct = async (updatedProduct) => {
		const token = getAuthToken();

		if (!token) {
			setErrorMessage("Phiên đăng nhập đã hết hạn.");
			return false;
		}

		try {
			const response = await updateAdminProduct(token, updatedProduct._id, {
				name: updatedProduct.name,
				category: updatedProduct.category,
				price: updatedProduct.price,
				stock: updatedProduct.stock,
				image: updatedProduct.image,
				description: updatedProduct.description,
			});

			const normalizedProduct = normalizeProduct(response.product);

			setProducts((prev) =>
				prev.map((product) =>
					product._id === normalizedProduct._id ? normalizedProduct : product
				)
			);
			setErrorMessage("");
			handleCloseEditModal();
			return true;
		} catch (error) {
			setErrorMessage(error.message || "Cập nhật sản phẩm thất bại.");
			return false;
		}
	};

	const handleOpenCreateModal = () => {
		setIsCreateModalOpen(true);
	};

	const handleCloseCreateModal = () => {
		setIsCreateModalOpen(false);
	};

	const handleCreateProduct = async (newProduct) => {
		const token = getAuthToken();

		if (!token) {
			setErrorMessage("Phiên đăng nhập đã hết hạn.");
			return false;
		}

		try {
			const response = await createAdminProduct(token, newProduct);
			const normalizedProduct = normalizeProduct(response.product);
			setProducts((prev) => [normalizedProduct, ...prev]);
			setErrorMessage("");
			handleCloseCreateModal();
			return true;
		} catch (error) {
			setErrorMessage(error.message || "Thêm sản phẩm thất bại.");
			return false;
		}
	};

	const handleDeleteProduct = async (productToDelete) => {
		const shouldDelete = window.confirm(
			`Bạn có chắc muốn xóa sản phẩm "${productToDelete.name}" không?`
		);

		if (!shouldDelete) {
			return;
		}

		const token = getAuthToken();

		if (!token) {
			setErrorMessage("Phiên đăng nhập đã hết hạn.");
			return;
		}

		try {
			await deleteAdminProduct(token, productToDelete._id);
			setProducts((prev) =>
				prev.filter((product) => product._id !== productToDelete._id)
			);
			setErrorMessage("");
		} catch (error) {
			setErrorMessage(error.message || "Xóa sản phẩm thất bại.");
		}
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
								{productCategoryOptions.map((option) => (
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
								{productStatusOptions.map((option) => (
									<option key={option} value={option}>
										{option}
									</option>
								))}
							</select>

							<button
								type="button"
								onClick={handleOpenCreateModal}
								className="flex h-11 items-center justify-center gap-2 rounded-full bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
							>
								<FiPlus className="h-4 w-4" />
								<span>Thêm sản phẩm mới</span>
							</button>
						</div>
					</div>
				</div>

				{errorMessage && (
					<div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
						{errorMessage}
					</div>
				)}

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
										<tr key={product._id} className="text-sm text-slate-700">
											<td className="px-6 py-4 font-medium text-slate-500">
												{product.code}
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
														className="flex h-7 w-7 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-600 transition hover:bg-blue-100"
														aria-label={`Cập nhật sản phẩm ${product.name}`}
													>
														<FiEdit2 className="h-4 w-4" />
													</button>
													<button
														type="button"
														onClick={() => handleDeleteProduct(product)}
														className="flex h-7 w-7 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-500 transition hover:bg-red-100"
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

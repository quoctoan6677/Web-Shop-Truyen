import { useEffect, useState } from "react";
import { FiChevronDown, FiX } from "react-icons/fi";

const emptyForm = {
	id: "",
	name: "",
	category: "Truyện tranh",
	price: "",
	stock: "",
	description: "",
	image: "",
};

function SelectField({ label, value, onChange, options }) {
	const [isFocused, setIsFocused] = useState(false);

	return (
		<div className="grid gap-2">
			<label className="text-sm font-semibold text-slate-700">{label}</label>
			<div
				className={`relative transition duration-200 ${
					isFocused ? "-translate-y-0.5" : "translate-y-0"
				}`}
			>
				<select
					value={value}
					onChange={onChange}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					className="h-11 w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 pr-11 text-slate-700 outline-none transition duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
				>
					{options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
				<FiChevronDown
					className={`pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition duration-200 ${
						isFocused ? "rotate-180 text-blue-600" : "rotate-0"
					}`}
				/>
			</div>
		</div>
	);
}

function ModalCapNhatSanPham({ open, product, onClose, onSave }) {
	const [formData, setFormData] = useState(emptyForm);

	useEffect(() => {
		if (!open || !product) {
			return;
		}

		setFormData({
			id: product.id,
			name: product.name,
			category: product.category,
			price: product.price,
			stock: product.stock,
			description: product.description || "",
			image: product.image || "",
		});
	}, [open, product]);

	if (!open || !product) {
		return null;
	}

	const handleChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		onSave({
			...product,
			...formData,
			price: Number(formData.price) || 0,
			stock: Number(formData.stock) || 0,
		});
	};

	return (
		<div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-4">
			<div className="relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
				<button
					type="button"
					onClick={onClose}
					className="absolute right-4 top-4 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 cursor-pointer"
					aria-label="Đóng popup cập nhật sản phẩm"
				>
					<FiX className="h-5 w-5" />
				</button>

				<div className="mb-6">
					{/* <p className="text-sm font-medium text-blue-600">Quản lý sản phẩm</p> */}
					<h2 className="mt-1 text-2xl font-bold text-slate-900">
						Cập nhật sản phẩm
					</h2>
					{/* <p className="mt-2 text-sm text-slate-500">
						Chỉnh sửa thông tin hiển thị, tồn kho và trạng thái của sản phẩm.
					</p> */}
				</div>

				<form onSubmit={handleSubmit} className="grid gap-6">
					<div className="grid gap-4 md:grid-cols-2">
						<div className="grid gap-2">
							<label className="text-sm font-semibold text-slate-700">
								Mã sản phẩm
							</label>
							<input
								type="text"
								value={formData.id}
								readOnly
								className="h-11 rounded-xl border border-slate-300 bg-slate-50 px-4 text-slate-500 outline-none"
							/>
						</div>

						<div className="grid gap-2">
							<label className="text-sm font-semibold text-slate-700">
								Tên sản phẩm
							</label>
							<input
								type="text"
								value={formData.name}
								onChange={(e) => handleChange("name", e.target.value)}
								className="h-11 rounded-xl border border-slate-300 px-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
							/>
						</div>

						<SelectField
							label="Thể loại"
							value={formData.category}
							onChange={(e) => handleChange("category", e.target.value)}
							options={[
								{ value: "Truyện chữ", label: "Truyện chữ" },
								{ value: "Truyện tranh", label: "Truyện tranh" },
								{ value: "Combo", label: "Combo" },
							]}
						/>

						<div className="grid gap-2">
							<label className="text-sm font-semibold text-slate-700">
								Đơn giá
							</label>
							<input
								type="number"
								min="0"
								value={formData.price}
								onChange={(e) => handleChange("price", e.target.value)}
								className="h-11 rounded-xl border border-slate-300 px-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
							/>
						</div>

						<div className="grid gap-2">
							<label className="text-sm font-semibold text-slate-700">
								Tồn kho
							</label>
							<input
								type="number"
								min="0"
								value={formData.stock}
								onChange={(e) => handleChange("stock", e.target.value)}
								className="h-11 rounded-xl border border-slate-300 px-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
							/>
						</div>

						<div className="grid gap-2 md:col-span-2">
							<label className="text-sm font-semibold text-slate-700">
								Ảnh sản phẩm
							</label>
							<input
								type="text"
								value={formData.image}
								onChange={(e) => handleChange("image", e.target.value)}
								placeholder="Dán URL ảnh sản phẩm"
								className="h-11 rounded-xl border border-slate-300 px-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
							/>
						</div>

						<div className="grid gap-2 md:col-span-2">
							<label className="text-sm font-semibold text-slate-700">
								Mô tả ngắn
							</label>
							<textarea
								rows="4"
								value={formData.description}
								onChange={(e) => handleChange("description", e.target.value)}
								className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
							/>
						</div>
					</div>

					<div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
						<button
							type="button"
							onClick={onClose}
							className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 cursor-pointer"
						>
							Hủy
						</button>
						<button
							type="submit"
							className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 cursor-pointer"
						>
							Lưu thay đổi
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default ModalCapNhatSanPham;

import { FiX, FiShoppingCart } from 'react-icons/fi'
import { useState } from 'react'

function ModalChiTietSanPham({ product, open, onClose, onAddToCart }) {
	const [quantity, setQuantity] = useState(1);

	const increase = () => setQuantity(quantity + 1);
	const decrease = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    }
	if (!open || !product) return null
    
    const total = product.price * quantity;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			<div className="relative w-[800px] h-[600px] rounded-2xl bg-white p-8">
				{/* Close button */}
				<button
					onClick={onClose}
					className="absolute right-4 top-4 rounded-full p-2 text-gray-500 hover:bg-gray-100 cursor-pointer"
				>
					<FiX className="h-5 w-5" />
				</button>

				<div className="grid h-full min-h-0 gap-6 md:grid-cols-2">
					{/* Image */}
					<div className="overflow-hidden rounded-2xl">
						<img
							src={product.image}
							alt={product.name}
							className="h-full w-full object-cover"
						/>
					</div>

					{/* Info */}
					<div className="flex h-full min-w-0 flex-col justify-between">
                        {/* Content */}
                        <div >
                            <h2 className="break-all text-3xl font-bold text-slate-900">
                                {product.name}
                            </h2>

                            {/* Description */}
                            <div className="mt-6 h-[260px] overflow-y-auto pr-2">
                                <p className="break-all text-slate-600 leading-7">
                                    {product.description ||
                                        'Chưa có mô tả sản phẩm. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'}
                                </p>
                            </div>

                            <div className="mt-6 mx-4 flex items-center justify-between">
                                <div className="flex justify-center items-center border border-slate-300 rounded-lg w-fit ">
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
                                <p className="text-2xl font-bold text-red-500">
                                    {total.toLocaleString()} đ
                                </p>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="mt-6 flex gap-2 border-t pt-4">
                            <button
                                onClick={() => onAddToCart({ ...product, quantity })}
                                className="flex flex-1 items-center justify-center rounded-xl border border-gray-300 cursor-pointer hover:bg-gray-200 px-6"
                            >
                                <FiShoppingCart className="h-6 w-6" />
                            </button>

                            <button
                                onClick={onClose}
                                className="flex-2 rounded-xl bg-blue-500 py-3 font-semibold text-white hover:bg-blue-600 cursor-pointer"
                            >
                                Mua ngay
                            </button>
                        </div>
                    </div>
				</div>
			</div>
		</div>
	)
}

export default ModalChiTietSanPham
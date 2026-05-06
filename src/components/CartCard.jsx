import { useState } from "react";
import {FiTrash2} from "react-icons/fi"

function CartCard({ item, onRemove }) {
	const [quantity, setQuantity] = useState(1);

	const increase = () => setQuantity(quantity + 1);
	const decrease = () => {
		if (quantity > 1) setQuantity(quantity - 1);
	};

	const total = item.price * quantity;

	return (
		<div className="grid grid-cols-[40px_1fr_160px_160px_160px_80px] items-center gap-4 p-3 border-b border-slate-400 mt-4">
			{/* checkbox */}
			<div className="flex justify-center">
				<input type="checkbox" className="w-4 h-4 cursor-pointer" />
			</div>

			{/* sản phẩm */}
			<div className="flex gap-4 items-center">
				<img
					src={item.image}
					alt={item.name}
					className="w-20 h-20 object-cover rounded"
				/>
				<div>
					<h3 className="font-medium line-clamp-2">
						{item.name}
					</h3>
				</div>
			</div>

			{/* đơn giá */}
			<div className="text-center">
				{item.price.toLocaleString()} đ
			</div>

			{/* số lượng */}
			<div className="flex justify-center items-center border border-slate-300 rounded w-fit mx-auto">
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

			{/* thành tiền */}
			<div className="text-center text-red-500 font-medium">
				{total.toLocaleString()} đ
			</div>

			{/* thao tác */}
			<div className="text-center">
				<button
					onClick={() => onRemove(item.id)}
					className="text-gray-500 hover:text-red-500 cursor-pointer"
				>
					<FiTrash2 />
				</button>
			</div>
		</div>
	);
}

export default CartCard;
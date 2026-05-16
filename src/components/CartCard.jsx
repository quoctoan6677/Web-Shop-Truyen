import { FiTrash2 } from "react-icons/fi";

function CartCard({ item, onRemove, onToggleSelect, onUpdateQuantity }) {
	const decrease = () => {
		if (item.quantity > 1) {
			onUpdateQuantity(item.id, item.quantity - 1);
		}
	};

	const increase = () => {
		onUpdateQuantity(item.id, item.quantity + 1);
	};

	const total = item.price * item.quantity;

	return (
		<div className="grid grid-cols-[40px_1fr_160px_160px_160px_80px] items-center gap-4 p-3 border-b border-slate-400 mt-4">
			<div className="flex justify-center">
				<input
					type="checkbox"
					checked={item.selected}
					onChange={() => onToggleSelect(item.id)}
					className="w-4 h-4 cursor-pointer"
				/>
			</div>

			<div className="flex gap-4 items-center">
				<img
					src={item.image}
					alt={item.name}
					className="w-20 h-20 object-cover rounded"
				/>
				<div>
					<h3 className="font-medium line-clamp-2">{item.name}</h3>
				</div>
			</div>

			<div className="text-center">{item.price.toLocaleString()} đ</div>

			<div className="flex justify-center items-center border border-slate-300 rounded-lg w-fit mx-auto">
				<button
					onClick={decrease}
					className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
				>
					-
				</button>
				<span className="px-4">{item.quantity}</span>
				<button
					onClick={increase}
					className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
				>
					+
				</button>
			</div>

			<div className="text-center text-red-500 font-medium">
				{total.toLocaleString()} đ
			</div>

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

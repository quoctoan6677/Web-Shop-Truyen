import { useState } from "react";

function ProductCard({ product, onAddToCart, onViewDetail }) {
	return (
		<div className="bg-white rounded-2xl shadow-md hover:shadow-lg cursor-pointer transition p-4">
			{/* Image */}
			<div className="w-full aspect-2/3 overflow-hidden rounded-xl mb-4 cursor-pointer">
				<img
					src={product.image}
					alt={product.name}
					className="w-full h-full object-cover hover:scale-105 transition"
				/>
			</div>

			{/* Name */}
			<h3 className="text-lg font-semibold line-clamp-1">
				{product.name}
			</h3>

			{/* Price */}
			<p className="text-red-500 font-bold mt-2">
				{product.price.toLocaleString()} đ
			</p>

			{/* Actions */}
			<div className="flex gap-2 mt-4">
				<button
					onClick={() => onViewDetail(product)}
					className="flex-1 border border-gray-300 cursor-pointer rounded-lg py-2 hover:bg-gray-100"
				>
					Xem
				</button>

				<button
					onClick={() => onAddToCart(product)}
					className="flex-1 bg-blue-500 text-white cursor-pointer rounded-lg py-2 hover:bg-blue-600"
				>
					Thêm vào giỏ
				</button>
			</div>
		</div>
	);
}

export default ProductCard;
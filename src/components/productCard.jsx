import { useState } from "react";
import { FiShoppingCart } from "react-icons/fi";

function ProductCard({ product, onAddToCart, onViewDetail }) {
	return (
		<div className="bg-white rounded-2xl shadow-md hover:shadow-lg cursor-pointer transition p-4"
			onClick={() => onViewDetail(product)}
		>
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
					onClick={(e) => {
						e.stopPropagation();
						onAddToCart(product);
					}}
					className="flex-1 border border-gray-300 text-gray cursor-pointer rounded-lg py-2 hover:bg-gray-200 justify-center flex items-center"
				>
					<FiShoppingCart className="w-6 h-6 mr-1"/>
				</button>
				<button
					onClick={(e) => {
						e.stopPropagation();
						// onAddToCart(product);
					}}
					className="flex-1 bg-blue-500 cursor-pointer rounded-lg py-2 hover:bg-blue-600 text-white justify-center flex items-center"
				>
					Mua ngay
				</button>


			</div>
		</div>
	);
}

export default ProductCard;
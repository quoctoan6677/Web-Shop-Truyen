import CartCard from "../components/CartCard"
import { useState } from "react"

function Cart() {
	const [cart, setCart] = useState([
		{
			id: 1,
			name: "Doraemon tập 1",
			price: 24000,
			image:
				"https://product.hstatic.net/1000376556/product/xhljijuw_9de22abba6a2407d87e202d773acda07_1024x1024.png",
		},
		{
			id: 2,
			name: "Quần jean 1",
			price: 350000,
			image:
				"https://cdn-media.sforum.vn/storage/app/media/anh-dep-82.jpg",
		},
		{
			id: 3,
			name: "Quần jean 1",
			price: 350000,
			image:
				"https://cdn-media.sforum.vn/storage/app/media/anh-dep-82.jpg",
		},
		{
			id: 4,
			name: "Quần jean 1",
			price: 350000,
			image:
				"https://cdn-media.sforum.vn/storage/app/media/anh-dep-82.jpg",
		},
		{
			id: 5,
			name: "Quần jean 1",
			price: 350000,
			image:
				"https://cdn-media.sforum.vn/storage/app/media/anh-dep-82.jpg",
		},
		{
			id: 6,
			name: "Quần jean 1",
			price: 350000,
			image:
				"https://cdn-media.sforum.vn/storage/app/media/anh-dep-82.jpg",
		},
		{
			id: 7,
			name: "Quần jean 1",
			price: 350000,
			image:
				"https://cdn-media.sforum.vn/storage/app/media/anh-dep-82.jpg",
		},
		{
			id: 8,
			name: "Quần jean 1",
			price: 350000,
			image:
				"https://cdn-media.sforum.vn/storage/app/media/anh-dep-82.jpg",
		},
		{
			id: 9,
			name: "Quần jean 1",
			price: 350000,
			image:
				"https://cdn-media.sforum.vn/storage/app/media/anh-dep-82.jpg",
		},
		{
			id: 10,
			name: "Quần jean 1",
			price: 350000,
			image:
				"https://cdn-media.sforum.vn/storage/app/media/anh-dep-82.jpg",
		},
	]);
	const handleRemoveFromCart = (id) => {
		setCart(cart.filter((item) => item.id !== id));
	};


	return (
		<section>
			<div className="grid grid-cols-[40px_1fr_160px_160px_160px_80px] gap-4 font-medium text-gray-500 bg-gray-200 p-3 rounded-lg">
				<div className="flex justify-center items-center">
					<input type="checkbox" className="w-4 h-4 cursor-pointer"/>
				</div>
				<div className="ml-3">Sản phẩm</div>
				<div className="text-center">Đơn giá</div>
				<div className="text-center">Số lượng</div>
				<div className="text-center">Thành tiền</div>
				<div className="text-center">Xóa</div>
			</div>
			<div>
				{cart.length === 0 ? (
					<p className="text-center text-gray-500 mt-10">Giỏ hàng của bạn đang trống.</p>
				) : (
					cart.map((item) => (
						<CartCard key={item.id} item={item} onRemove={() => handleRemoveFromCart(item.id)} />
					))
				)}
			</div>
			<div className="sticky bottom-0 z-10 items-center grid grid-cols-[40px_1fr_400px_200px] font-medium gap-4 p-3 h-20 bg-white rounded-lg mt-6 px-8 shadow-md">
				<div className="flex justify-center">
					<input type="checkbox" className="w-4 h-4"/>
				</div>
				<div>Chọn tất cả</div>
				<div>Tổng tiền:</div>
				<div className="border rounded-lg cursor-pointer bg-blue-500 text-white hover:bg-blue-600 transition flex justify-center items-center">
					<div className="p-2">Mua hàng</div>
				</div>
			</div>
		</section>
	)
}

export default Cart

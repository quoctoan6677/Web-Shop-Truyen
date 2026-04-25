import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSearch, FiShoppingCart, FiBookOpen } from 'react-icons/fi'
import Navbar from './navbar'

function Header() {
	const [activeItem, setActiveItem] = useState('Tất cả')
	const navigate = useNavigate()

	return (
		<header className="grid w-full grid-cols-[1fr_minmax(0,44rem)_1fr] items-start gap-3 border-b border-slate-200 bg-white px-2 py-3 md:px-8 max-md:grid-cols-1">
			<button
				type="button"
				onClick={() => navigate('/')}
				className="flex items-center gap-2 self-center justify-self-start text-2xl font-bold text-slate-900"
				aria-label="Ve trang chu"
			>
				<FiBookOpen className="h-6 w-6 text-blue-600" aria-hidden="true" />
				<span>Shop Truyen</span>
			</button>

			<div className="grid min-w-0 gap-2">
				<div className="flex justify-center">
					<div className="relative w-full max-w-2xl">
                        <input
							type="search"
							className="w-full h-11 rounded-full border border-slate-300 pl-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
							placeholder="Tìm truyện..."
							aria-label="Tìm kiếm truyện"
						/>
						<button
							type="button"
							className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100"
							aria-label="Tìm kiếm"
						>
							<FiSearch className="h-4 w-4" aria-hidden="true" />
						</button>
					</div>
			        <button
				        type="button"
        				className="ml-4 flex h-11 w-11 self-start items-center justify-center rounded-full border border-slate-300 bg-white text-slate-800 transition hover:bg-slate-50 max-md:mr-0 max-md:justify-self-end max-md:[grid-area:cart]"
				        onClick={() => navigate('/cart')}
				        aria-label="Giỏ hàng"
			        >
				    <FiShoppingCart className="h-5 w-5" aria-hidden="true" />
			        </button>
				</div>
				<Navbar activeItem={activeItem} onSelect={setActiveItem} />
			</div>


			<button
				type="button"
				className="h-11 w-11 self-center justify-self-end rounded-full border border-slate-300 bg-slate-900 font-semibold text-white transition hover:bg-slate-700"
				onClick={() => navigate('/profile')}
				aria-label="Hồ sơ"
			>
				D
			</button>
		</header>
	)
}

export default Header

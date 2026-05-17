import { FiBookOpen, FiMail, FiMapPin, FiPhone } from 'react-icons/fi'

function Footer() {
	return (
		<footer className="mt-8 border-t border-slate-200 bg-white">
			<div className="mx-auto grid max-w-5xl gap-10 px-4 py-6 md:grid-cols-3 md:px-6">
				<section>
					<div className="flex items-center gap-2 text-lg font-bold text-slate-900">
						<FiBookOpen className="h-5 w-5 text-blue-600" aria-hidden="true" />
						<span>ShopTruyen</span>
					</div>
					<p className="mt-3 text-sm leading-6 text-slate-600">
						Nơi mua sắm truyện chữ, truyện tranh và combo ưu đãi.
					</p>
				</section>

				<section>
					<h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Liên kết nhanh</h3>
					<ul className="mt-3 space-y-2 text-sm text-slate-600">
						<li>
							<a className="transition hover:text-blue-600" href="/">
								Trang chủ
							</a>
						</li>
						<li>
							<a className="transition hover:text-blue-600" href="/cart">
								Giỏ hàng    
							</a>
						</li>
						<li>
							<a className="transition hover:text-blue-600" href="/profile">
								Tài khoản
							</a>
						</li>
					</ul>
				</section>

				<section>
					<h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Liên hệ</h3>
					<ul className="mt-3 space-y-2 text-sm text-slate-600">
						<li className="flex items-center gap-2">
							<FiMapPin className="h-4 w-4 text-slate-500" aria-hidden="true" />
							<span>TP. Hà Nội, Việt Nam</span>
						</li>
						<li className="flex items-center gap-2">
							<FiPhone className="h-4 w-4 text-slate-500" aria-hidden="true" />
							<span>032 832 2623</span>
						</li>
						<li className="flex items-center gap-2">
							<FiMail className="h-4 w-4 text-slate-500" aria-hidden="true" />
							<span>quoctoan20031104@gmail.com</span>
						</li>
					</ul>
				</section>
			</div>

			<div className="border-t border-slate-200 px-4 py-4 text-center text-xs text-slate-500 md:px-6">
				© {new Date().getFullYear()} Shop Truyen. All rights reserved.
			</div>
		</footer>
	)
}

export default Footer

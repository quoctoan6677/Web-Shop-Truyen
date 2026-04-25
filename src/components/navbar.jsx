const MENU_ITEMS = ['Tất cả', 'Truyện chữ', 'Truyện tranh', 'Combo']

function Navbar({ activeItem, onSelect }) {
	return (
		<nav className="flex flex-wrap justify-center gap-3" aria-label="Danh muc truyen">
			{MENU_ITEMS.map((item) => (
				<button
					key={item}
					type="button"
					className={`rounded-full border px-2 py-1 text-xs transition ${
						activeItem === item
							? 'border-blue-600 bg-blue-600 text-white'
							: 'border-slate-300 bg-slate-50 text-slate-900 hover:bg-slate-100'
					}`}
					onClick={() => onSelect?.(item)}
				>
					{item}
				</button>
			))}
		</nav>
	)
}

export default Navbar

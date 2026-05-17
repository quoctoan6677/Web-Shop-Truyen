import { navigationCategories } from "../data/products";

function Navbar({ activeItem, onSelect }) {
	return (
		<nav className="flex flex-wrap justify-center gap-2" aria-label="Danh muc truyen">
			{navigationCategories.map((item) => (
				<button
					key={item}
					type="button"
					className={`rounded-full border px-2 py-1 text-xs cursor-pointer transition ${
						activeItem === item
							? "border-blue-600 bg-blue-600 text-white"
							: "border-slate-300 bg-slate-50 text-slate-900 hover:bg-slate-100"
					}`}
					onClick={() => onSelect?.(item)}
				>
					{item}
				</button>
			))}
		</nav>
	);
}

export default Navbar;

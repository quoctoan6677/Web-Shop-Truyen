import { FiSearch } from "react-icons/fi";

function Search({
	value,
	onChange,
	onSearch,
	onKeyDown,
	placeholder = "Tìm truyện...",
	ariaLabel = "Tìm kiếm",
	className = "",
}) {
	return (
		<div className={`relative w-full ${className}`.trim()}>
			<input
				type="search"
				value={value}
				onChange={onChange}
				onKeyDown={onKeyDown}
				className="h-11 w-full rounded-full border border-slate-300 pl-4 pr-12 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
				placeholder={placeholder}
				aria-label={ariaLabel}
			/>
			<button
				type="button"
				onClick={onSearch}
				className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100"
				aria-label={ariaLabel}
			>
				<FiSearch className="h-4 w-4 cursor-pointer" aria-hidden="true" />
			</button>
		</div>
	);
}

export default Search;

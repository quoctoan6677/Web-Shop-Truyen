import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
	FiBookOpen,
	FiLogOut,
	FiShoppingBag,
	FiShoppingCart,
	FiUser,
} from "react-icons/fi";
import Navbar from "./navbar";
import Search from "./Search";
import { isAuthenticated, signOut } from "../utils/auth";
import { getStoredUserProfile } from "../utils/userProfile";

function Header() {
	const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [userProfile, setUserProfile] = useState(() => getStoredUserProfile());
	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams] = useSearchParams();
	const profileMenuRef = useRef(null);
	const isLoggedIn = isAuthenticated();
	const activeItem = searchParams.get("category") || "Tat ca";
	const avatarLabel =
		userProfile.fullName?.trim()?.split(/\s+/)?.at(-1)?.charAt(0)?.toUpperCase() || "T";

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (!profileMenuRef.current?.contains(event.target)) {
				setIsProfileMenuOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		setSearchValue(searchParams.get("q") || "");
	}, [searchParams]);

	useEffect(() => {
		const syncProfile = () => {
			setUserProfile(getStoredUserProfile());
		};

		window.addEventListener("user-profile-updated", syncProfile);
		window.addEventListener("storage", syncProfile);

		return () => {
			window.removeEventListener("user-profile-updated", syncProfile);
			window.removeEventListener("storage", syncProfile);
		};
	}, []);

	const handleNavigate = (path) => {
		setIsProfileMenuOpen(false);
		navigate(path);
	};

	const handleLogout = () => {
		signOut();
		setIsProfileMenuOpen(false);
		navigate("/login");
	};

	const updateHomeSearchParams = (updater) => {
		const nextSearchParams = new URLSearchParams(location.search);
		updater(nextSearchParams);

		navigate({
			pathname: "/",
			search: nextSearchParams.toString()
				? `?${nextSearchParams.toString()}`
				: "",
		});
	};

	const handleSearch = () => {
		const normalizedQuery = searchValue.trim();

		updateHomeSearchParams((nextSearchParams) => {
			if (normalizedQuery) {
				nextSearchParams.set("q", normalizedQuery);
			} else {
				nextSearchParams.delete("q");
			}
		});
	};

	const handleSearchKeyDown = (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			handleSearch();
		}
	};

	const handleCategorySelect = (category) => {
		updateHomeSearchParams((nextSearchParams) => {
			if (category === "Tat ca") {
				nextSearchParams.delete("category");
			} else {
				nextSearchParams.set("category", category);
			}
		});
	};

	return (
		<header className="grid w-full grid-cols-[1fr_minmax(0,44rem)_1fr] items-start gap-3 border-b border-slate-200 bg-white px-2 py-3 md:px-8 max-md:grid-cols-1">
			<button
				type="button"
				onClick={() => {
					setSearchValue("");
					navigate("/");
				}}
				className="flex items-center gap-2 self-center justify-self-start text-2xl font-bold text-slate-900 cursor-pointer"
				aria-label="Ve trang chu"
			>
				<FiBookOpen className="h-6 w-6 text-blue-600" aria-hidden="true" />
				<span>ShopTruyen</span>
			</button>

			<div className="grid min-w-0 gap-2">
				<div className="flex justify-center">
					<Search
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
						onKeyDown={handleSearchKeyDown}
						onSearch={handleSearch}
						placeholder="Tìm truyện..."
						ariaLabel="Tìm kiếm truyện"
						className="max-w-2xl"
					/>
					<button
						type="button"
						className="ml-4 flex h-11 w-11 self-start items-center cursor-pointer justify-center rounded-full border border-slate-300 bg-white text-slate-800 transition hover:bg-slate-50 max-md:mr-0 max-md:justify-self-end max-md:[grid-area:cart]"
						onClick={() => navigate("/cart")}
						aria-label="Giỏ hàng"
					>
						<FiShoppingCart className="h-5 w-5" aria-hidden="true" />
					</button>
				</div>
				<Navbar activeItem={activeItem} onSelect={handleCategorySelect} />
			</div>

			<div ref={profileMenuRef} className="relative self-center justify-self-end">
				{isLoggedIn ? (
					<>
						<button
							type="button"
							className="flex h-13 items-center gap-2 rounded-full border border-slate-300 bg-blue-900 px-3 font-semibold text-white transition hover:bg-blue-700 cursor-pointer"
							onClick={() => setIsProfileMenuOpen((prev) => !prev)}
							aria-label="Hồ sơ"
						>
							<span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-sm">
								{avatarLabel}
							</span>
						</button>

						{isProfileMenuOpen && (
							<div className="absolute right-0 top-14 z-50 min-w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
								<button
									type="button"
									onClick={() => handleNavigate("/profile")}
									className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 cursor-pointer"
								>
									<FiUser className="h-4 w-4 text-slate-500" />
									<span>Trang cá nhân</span>
								</button>
								<button
									type="button"
									onClick={() => handleNavigate("/cart")}
									className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 cursor-pointer"
								>
									<FiShoppingCart className="h-4 w-4 text-slate-500" />
									<span>Giỏ hàng</span>
								</button>
								<button
									type="button"
									onClick={() => handleNavigate("/order")}
									className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 cursor-pointer"
								>
									<FiShoppingBag className="h-4 w-4 text-slate-500" />
									<span>Đơn hàng</span>
								</button>
								<button
									type="button"
									onClick={handleLogout}
									className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-500 transition hover:bg-red-50 cursor-pointer"
								>
									<FiLogOut className="h-4 w-4" />
									<span>Đăng xuất</span>
								</button>
							</div>
						)}
					</>
				) : (
					<button
						type="button"
						onClick={() => navigate("/login")}
						className="rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 cursor-pointer"
					>
						Đăng nhập
					</button>
				)}
			</div>
		</header>
	);
}

export default Header;

import { FiLogOut } from "react-icons/fi";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { signOut } from "../utils/auth";

function AdminLayout() {
	const navigate = useNavigate();

	const handleLogout = () => {
		signOut();
		navigate("/login");
	};

	return (
		<div className="grid min-h-screen grid-cols-1 bg-slate-100 md:grid-cols-[240px_1fr]">
			<aside className="flex min-h-screen flex-col border-b border-slate-200 bg-white p-5 md:border-b-0 md:border-r">
				<div>
					<h2 className="mb-4 text-center text-lg font-semibold">Admin</h2>
					<nav className="grid gap-2">
						<NavLink
							to="/admin"
							end
							className={({ isActive }) =>
								`rounded-lg px-3 py-2 text-sm transition ${
									isActive
										? "bg-blue-800 text-white"
										: "bg-slate-100 hover:bg-slate-200"
								}`
							}
						>
							Dashboard
						</NavLink>
						<NavLink
							to="/admin/san-pham"
							className={({ isActive }) =>
								`rounded-lg px-3 py-2 text-sm transition ${
									isActive
										? "bg-blue-800 text-white"
										: "bg-slate-100 hover:bg-slate-200"
								}`
							}
						>
							Sản phẩm
						</NavLink>
						<NavLink
							to="/admin/don-hang"
							className={({ isActive }) =>
								`rounded-lg px-3 py-2 text-sm transition ${
									isActive
										? "bg-blue-800 text-white"
										: "bg-slate-100 hover:bg-slate-200"
								}`
							}
						>
							Đơn hàng
						</NavLink>
					</nav>
				</div>

				<button
					type="button"
					onClick={handleLogout}
					className="mt-auto flex items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 cursor-pointer"
				>
					<FiLogOut className="h-4 w-4" />
					<span>Đăng xuất</span>
				</button>
			</aside>
			<main className="p-4 md:p-6">
				<Outlet />
			</main>
		</div>
	);
}

export default AdminLayout;

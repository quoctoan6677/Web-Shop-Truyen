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
		<div className="min-h-screen bg-slate-100">
			<aside className="fixed inset-x-0 top-0 z-40 flex h-auto flex-col border-b border-slate-200 bg-white p-5 md:inset-x-auto md:inset-y-0 md:left-0 md:h-screen md:w-[240px] md:border-b-0 md:border-r">
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
					className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 md:fixed md:bottom-5 md:left-5 md:w-[200px]"
				>
					<FiLogOut className="h-4 w-4" />
					<span>Đăng xuất</span>
				</button>
			</aside>

			<main className="px-4 pb-4 pt-[180px] md:ml-[240px] md:p-6">
				<Outlet />
			</main>
		</div>
	);
}

export default AdminLayout;

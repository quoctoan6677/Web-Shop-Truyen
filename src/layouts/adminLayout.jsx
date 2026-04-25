import { NavLink, Outlet } from 'react-router-dom'

function AdminLayout() {
	return (
		<div className="grid min-h-screen grid-cols-1 bg-slate-100 md:grid-cols-[240px_1fr]">
			<aside className="border-b border-slate-200 bg-white p-5 md:border-b-0 md:border-r">
				<h2 className="mb-4 text-lg font-semibold">Admin</h2>
				<nav className="grid gap-2">
					<NavLink
						to="/admin"
						className={({ isActive }) =>
							`rounded-lg px-3 py-2 text-sm transition ${isActive ? 'bg-slate-900 text-white' : 'bg-slate-100 hover:bg-slate-200'}`
						}
					>
						Dashboard
					</NavLink>
					<NavLink
						to="/admin/san-pham"
						className={({ isActive }) =>
							`rounded-lg px-3 py-2 text-sm transition ${isActive ? 'bg-slate-900 text-white' : 'bg-slate-100 hover:bg-slate-200'}`
						}
					>
						San pham
					</NavLink>
					<NavLink
						to="/admin/nguoi-dung"
						className={({ isActive }) =>
							`rounded-lg px-3 py-2 text-sm transition ${isActive ? 'bg-slate-900 text-white' : 'bg-slate-100 hover:bg-slate-200'}`
						}
					>
						Nguoi dung
					</NavLink>
					<NavLink
						to="/admin/don-hang"
						className={({ isActive }) =>
							`rounded-lg px-3 py-2 text-sm transition ${isActive ? 'bg-slate-900 text-white' : 'bg-slate-100 hover:bg-slate-200'}`
						}
					>
						Don hang
					</NavLink>
				</nav>
			</aside>
			<main className="p-4 md:p-6">
				<Outlet />
			</main>
		</div>
	)
}

export default AdminLayout

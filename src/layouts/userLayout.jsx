import { Outlet } from 'react-router-dom'

function UserLayout() {
	return (
		<main className="pt-6 px-24 pb-2">
			<Outlet />
		</main>
	)
}

export default UserLayout

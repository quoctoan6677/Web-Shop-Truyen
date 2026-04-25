import { Navigate, Route, Routes } from 'react-router-dom'
import Header from './components/header'
import Footer from './components/Footer'
import UserLayout from './layouts/userLayout'
import AdminLayout from './layouts/adminLayout'
import Home from './pages/home'
import Cart from './pages/cart'
import Profile from './pages/profile'
import Login from './pages/auth/login'
import Register from './pages/auth/register'
import Dashboard from './pages/admin/Dashboard'
import QuanLySanPham from './pages/admin/QuanLySanPham'
import QuanLyNguoiDung from './pages/admin/QuanLyNguoiDung'
import QuanLyDonHang from './pages/admin/QuanLyDonHang'

function App() {
	return (
		<div className="flex min-h-screen flex-col bg-slate-100 text-slate-800">
			<Header />

			<main className="flex-1">
				<Routes>
					<Route element={<UserLayout />}>
						<Route index element={<Home />} />
						<Route path="cart" element={<Cart />} />
						<Route path="profile" element={<Profile />} />
					</Route>

					<Route path="login" element={<Login />} />
					<Route path="register" element={<Register />} />

					<Route path="admin" element={<AdminLayout />}>
						<Route index element={<Dashboard />} />
						<Route path="san-pham" element={<QuanLySanPham />} />
						<Route path="nguoi-dung" element={<QuanLyNguoiDung />} />
						<Route path="don-hang" element={<QuanLyDonHang />} />
					</Route>

					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</main>

			<Footer />
		</div>
	)
}

export default App

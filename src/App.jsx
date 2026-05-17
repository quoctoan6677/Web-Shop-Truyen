import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/Footer";
import UserLayout from "./layouts/userLayout";
import AdminLayout from "./layouts/adminLayout";
import Home from "./pages/home";
import Cart from "./pages/cart";
import Order from "./pages/order";
import Profile from "./pages/profile";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import Dashboard from "./pages/admin/Dashboard";
import QuanLySanPham from "./pages/admin/QuanLySanPham";
import QuanLyDonHang from "./pages/admin/QuanLyDonHang";
import { getCurrentUserRole, isAuthenticated } from "./utils/auth";

function ProtectedRoute({ children, allowedRole }) {
	if (!isAuthenticated()) {
		return <Navigate to="/login" replace />;
	}

	const currentRole = getCurrentUserRole();

	if (allowedRole && currentRole !== allowedRole) {
		return <Navigate to={currentRole === "admin" ? "/admin" : "/"} replace />;
	}

	return children;
}

function App() {
	const location = useLocation();
	const isAuthPage =
		location.pathname === "/login" || location.pathname === "/register";
	const isAdminPage = location.pathname.startsWith("/admin");

	return (
		<div className="flex min-h-screen flex-col bg-slate-100 text-slate-800">
			{!isAuthPage && !isAdminPage && <Header />}

			<main className="flex-1">
				<Routes>
					<Route
						element={
							<ProtectedRoute allowedRole="user">
								<UserLayout />
							</ProtectedRoute>
						}
					>
						<Route index element={<Home />} />
						<Route path="cart" element={<Cart />} />
						<Route path="order" element={<Order />} />
						<Route path="profile" element={<Profile />} />
					</Route>

					<Route path="login" element={<Login />} />
					<Route path="register" element={<Register />} />

					<Route
						path="admin"
						element={
							<ProtectedRoute allowedRole="admin">
								<AdminLayout />
							</ProtectedRoute>
						}
					>
						<Route index element={<Dashboard />} />
						<Route path="san-pham" element={<QuanLySanPham />} />
						<Route path="don-hang" element={<QuanLyDonHang />} />
					</Route>

					<Route
						path="*"
						element={
							<Navigate
								to={getCurrentUserRole() === "admin" ? "/admin" : "/"}
								replace
							/>
						}
					/>
				</Routes>
			</main>

			{!isAuthPage && !isAdminPage && <Footer />}
		</div>
	);
}

export default App;

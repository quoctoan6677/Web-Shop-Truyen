import { useEffect, useMemo, useRef, useState } from "react";
import {
	FiBarChart2,
	FiBookOpen,
	FiCheckCircle,
	FiClock,
	FiShoppingBag,
	FiTruck,
} from "react-icons/fi";
import { getDashboard } from "../../services/adminService";
import { getAuthToken, signOut } from "../../utils/auth";

const overviewIcons = {
	products: FiBookOpen,
	orders: FiShoppingBag,
	pendingOrders: FiClock,
	shippingOrders: FiTruck,
	deliveredOrders: FiCheckCircle,
};

const orderStatusCardStyles = {
	pendingOrders: {
		card: "border-amber-200 bg-amber-50",
		label: "text-amber-700",
		value: "text-amber-900",
		note: "text-amber-800/80",
		iconWrapper: "bg-amber-100 text-amber-700",
	},
	shippingOrders: {
		card: "border-sky-200 bg-sky-50",
		label: "text-sky-700",
		value: "text-sky-900",
		note: "text-sky-800/80",
		iconWrapper: "bg-sky-100 text-sky-700",
	},
	deliveredOrders: {
		card: "border-emerald-200 bg-emerald-50",
		label: "text-emerald-700",
		value: "text-emerald-900",
		note: "text-emerald-800/80",
		iconWrapper: "bg-emerald-100 text-emerald-700",
	},
};

function Dashboard() {
	const [revenueStats, setRevenueStats] = useState([]);
	const [overviewStats, setOverviewStats] = useState([]);
	const [errorMessage, setErrorMessage] = useState("");
	const hasFetchedDashboardRef = useRef(false);

	useEffect(() => {
		if (hasFetchedDashboardRef.current) {
			return;
		}

		hasFetchedDashboardRef.current = true;

		const fetchDashboard = async () => {
			const token = getAuthToken();

			if (!token) {
				setErrorMessage("Phiên đăng nhập đã hết hạn.");
				return;
			}

			try {
				const response = await getDashboard(token);
				setRevenueStats(response.revenueStats || []);
				setOverviewStats(response.overviewStats || []);
				setErrorMessage("");
			} catch (error) {
				if (error.message === "Unauthorized. Invalid token.") {
					await signOut();
				}

				setErrorMessage(error.message || "Không thể tải dữ liệu dashboard.");
			}
		};

		fetchDashboard();
	}, []);

	const primaryOverviewStats = useMemo(
		() => overviewStats.slice(0, 2),
		[overviewStats]
	);
	const orderStatusStats = useMemo(
		() => overviewStats.slice(2),
		[overviewStats]
	);

	return (
		<section className="grid gap-6">
			<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
					<div>
						<h1 className="mt-2 text-3xl font-bold text-slate-900">
							Tổng quan hoạt động cửa hàng
						</h1>
						<p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
							Theo dõi nhanh doanh thu, sản phẩm và đơn hàng để nắm được tình
							hình vận hành hiện tại.
						</p>
					</div>
				</div>
			</div>

			{errorMessage && (
				<div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
					{errorMessage}
				</div>
			)}

			<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
				<div className="flex items-center gap-3">
					<div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
						<FiBarChart2 className="h-6 w-6" />
					</div>
					<div>
						<h2 className="text-xl font-bold text-slate-900">Doanh thu</h2>
						<p className="mt-1 text-sm text-slate-500">
							Theo dõi hiệu suất bán hàng.
						</p>
					</div>
				</div>

				<div className="mt-6 grid gap-4 md:grid-cols-3">
					{revenueStats.map((item) => (
						<div
							key={item.key || item.label}
							className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
						>
							<p className="text-sm font-medium text-slate-500">{item.label}</p>
							<p className="mt-3 text-2xl font-bold text-slate-900">
								{Number(item.value || 0).toLocaleString("vi-VN")} đ
							</p>
							<p className="mt-2 text-sm text-slate-500">{item.note}</p>
						</div>
					))}
				</div>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				{primaryOverviewStats.map((item) => {
					const Icon = overviewIcons[item.key] || FiBarChart2;

					return (
						<div
							key={item.key || item.label}
							className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
						>
							<div className="flex items-center justify-between gap-4">
								<div>
									<p className="text-sm font-medium text-slate-500">
										{item.label}
									</p>
									<p className="mt-3 text-3xl font-bold text-slate-900">
										{Number(item.value || 0).toLocaleString("vi-VN")}
									</p>
									<p className="mt-2 text-sm text-slate-500">{item.note}</p>
								</div>

								<div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
									<Icon className="h-6 w-6" />
								</div>
							</div>
						</div>
					);
				})}
			</div>

			<div className="grid gap-6 md:grid-cols-3">
				{orderStatusStats.map((item) => {
					const Icon = overviewIcons[item.key] || FiBarChart2;
					const styles = orderStatusCardStyles[item.key] || {
						card: "border-slate-200 bg-white",
						label: "text-slate-500",
						value: "text-slate-900",
						note: "text-slate-500",
						iconWrapper: "bg-blue-50 text-blue-700",
					};

					return (
						<div
							key={item.key || item.label}
							className={`rounded-2xl border p-6 shadow-sm ${styles.card}`}
						>
							<div className="flex items-center justify-between gap-4">
								<div>
									<p className={`text-sm font-medium ${styles.label}`}>
										{item.label}
									</p>
									<p className={`mt-3 text-3xl font-bold ${styles.value}`}>
										{Number(item.value || 0).toLocaleString("vi-VN")}
									</p>
									<p className={`mt-2 text-sm ${styles.note}`}>{item.note}</p>
								</div>

								<div className={`rounded-2xl p-3 ${styles.iconWrapper}`}>
									<Icon className="h-6 w-6" />
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}

export default Dashboard;

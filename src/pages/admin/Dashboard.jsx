import { FiBarChart2, FiBookOpen, FiCalendar, FiShoppingBag } from "react-icons/fi";

const revenueStats = [
	{
		label: "Theo tuần",
		value: 18450000,
		note: "Tăng 12% so với tuần trước",
	},
	{
		label: "Theo tháng",
		value: 72600000,
		note: "Đơn trung bình 320.000 đ",
	},
	{
		label: "Theo năm",
		value: 912400000,
		note: "Đạt 68% mục tiêu năm",
	},
];

const overviewStats = [
	{
		label: "Tổng sản phẩm",
		value: 128,
		icon: FiBookOpen,
		note: "24 sản phẩm đang bán tốt",
	},
	{
		label: "Tổng đơn hàng",
		value: 1456,
		icon: FiShoppingBag,
		note: "36 đơn mới trong hôm nay",
	},
];

function Dashboard() {
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
							key={item.label}
							className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
						>
							<p className="text-sm font-medium text-slate-500">{item.label}</p>
							<p className="mt-3 text-2xl font-bold text-slate-900">
								{item.value.toLocaleString()} đ
							</p>
							<p className="mt-2 text-sm text-slate-500">{item.note}</p>
						</div>
					))}
				</div>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				{overviewStats.map((item) => {
					const Icon = item.icon;

					return (
						<div
							key={item.label}
							className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
						>
							<div className="flex items-center justify-between gap-4">
								<div>
									<p className="text-sm font-medium text-slate-500">
										{item.label}
									</p>
									<p className="mt-3 text-3xl font-bold text-slate-900">
										{item.value.toLocaleString()}
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
		</section>
	);
}

export default Dashboard;

import { useEffect, useRef, useState } from "react";
import {
	FiBookOpen,
	FiEdit2,
	FiMail,
	FiMapPin,
	FiPhone,
	FiSave,
	FiShoppingBag,
	FiUser,
} from "react-icons/fi";
import { getProfileStats, updateProfile } from "../services/userService";
import { getAuthToken, updateStoredAuthUser } from "../utils/auth";
import { getStoredUserProfile } from "../utils/userProfile";

function Profile() {
	const [isEditing, setIsEditing] = useState(false);
	const [isSaved, setIsSaved] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [profile, setProfile] = useState(() => getStoredUserProfile());
	const [stats, setStats] = useState({
		totalOrders: 0,
		totalPurchasedItems: 0,
	});
	const hasFetchedStatsRef = useRef(false);

	useEffect(() => {
		if (hasFetchedStatsRef.current) {
			return;
		}

		hasFetchedStatsRef.current = true;

		const fetchProfileStats = async () => {
			const token = getAuthToken();

			if (!token) {
				return;
			}

			try {
				const response = await getProfileStats(token);
				setStats(response.stats || { totalOrders: 0, totalPurchasedItems: 0 });
			} catch {
				// Keep fallback 0 values if stats request fails.
			}
		};

		fetchProfileStats();
	}, []);

	const handleChange = (field, value) => {
		setProfile((prev) => ({
			...prev,
			[field]: value,
		}));
		setIsSaved(false);
		setErrorMessage("");
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (
			!profile.fullName.trim() ||
			!profile.email.trim() ||
			!profile.phone.trim() ||
			!profile.address.trim()
		) {
			setErrorMessage("Vui lòng nhập đầy đủ họ tên, email, số điện thoại và địa chỉ.");
			return;
		}

		const token = getAuthToken();

		if (!token) {
			setErrorMessage("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await updateProfile(token, {
				fullName: profile.fullName.trim(),
				email: profile.email.trim(),
				phone: profile.phone.trim(),
				address: profile.address.trim(),
			});

			setProfile(response.user);
			updateStoredAuthUser(response.user);
			setIsEditing(false);
			setIsSaved(true);
		} catch (error) {
			setErrorMessage(error.message || "Cập nhật thông tin thất bại.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section className="grid gap-6">
			<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
				<div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
					<div className="flex items-start gap-4">
						<div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-900 text-2xl font-bold text-white">
							{profile.fullName?.trim()?.split(/\s+/)?.at(-1)?.charAt(0)?.toUpperCase() || "T"}
						</div>
						<div>
							<p className="text-sm font-medium text-blue-600">Tài khoản của tôi</p>
							<h1 className="mt-1 text-3xl font-bold text-slate-900">
								{profile.fullName || "Người dùng"}
							</h1>
							<p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
								Quản lý thông tin cá nhân và cập nhật chi tiết liên hệ để việc mua
								truyện thuận tiện hơn.
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						<div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
							<div className="flex items-center gap-2 text-sm text-slate-500">
								<FiShoppingBag className="h-4 w-4" />
								<span>Đơn hàng</span>
							</div>
							<p className="mt-3 text-2xl font-bold text-slate-900">
								{stats.totalOrders}
							</p>
						</div>
						<div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
							<div className="flex items-center gap-2 text-sm text-slate-500">
								<FiBookOpen className="h-4 w-4" />
								<span>Đã mua</span>
							</div>
							<p className="mt-3 text-2xl font-bold text-slate-900">
								{stats.totalPurchasedItems}
							</p>
						</div>
					</div>
				</div>
			</div>

			<form
				onSubmit={handleSubmit}
				className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
			>
				<div className="flex items-center justify-between gap-3">
					<div>
						<h2 className="text-xl font-bold text-slate-900">Thông tin cá nhân</h2>
						<p className="mt-1 text-sm text-slate-500">
							Cập nhật hồ sơ cơ bản của tài khoản.
						</p>
					</div>
					<button
						type="button"
						onClick={() => {
							setIsEditing((prev) => !prev);
							setIsSaved(false);
							setErrorMessage("");
						}}
						className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
					>
						<FiEdit2 className="h-4 w-4" />
						{isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa"}
					</button>
				</div>

				<div className="mt-6 grid gap-4 md:grid-cols-2">
					<label className="grid gap-2 text-sm font-medium text-slate-700">
						Họ và tên
						<div className="relative">
							<FiUser className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
							<input
								type="text"
								value={profile.fullName}
								onChange={(e) => handleChange("fullName", e.target.value)}
								disabled={!isEditing}
								className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-500"
							/>
						</div>
					</label>

					<label className="grid gap-2 text-sm font-medium text-slate-700">
						Email
						<div className="relative">
							<FiMail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
							<input
								type="email"
								value={profile.email}
								onChange={(e) => handleChange("email", e.target.value)}
								disabled={!isEditing}
								className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-500"
							/>
						</div>
					</label>

					<label className="grid gap-2 text-sm font-medium text-slate-700">
						Số điện thoại
						<div className="relative">
							<FiPhone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
							<input
								type="text"
								value={profile.phone}
								onChange={(e) => handleChange("phone", e.target.value)}
								disabled={!isEditing}
								className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-500"
							/>
						</div>
					</label>

					<label className="grid gap-2 text-sm font-medium text-slate-700">
						Địa chỉ
						<div className="relative">
							<FiMapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
							<input
								type="text"
								value={profile.address}
								onChange={(e) => handleChange("address", e.target.value)}
								disabled={!isEditing}
								className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-500"
							/>
						</div>
					</label>
				</div>

				{errorMessage && (
					<div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
						{errorMessage}
					</div>
				)}

				<div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
					<p className={`text-sm ${isSaved ? "text-green-600" : "text-slate-500"}`}>
						{isSaved
							? "Thông tin đã được cập nhật thành công."
							: "Bạn có thể chỉnh sửa thông tin cá nhân."}
					</p>
					<button
						type="submit"
						disabled={!isEditing || isSubmitting}
						className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300"
					>
						<FiSave className="h-4 w-4" />
						{isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
					</button>
				</div>
			</form>
		</section>
	);
}

export default Profile;

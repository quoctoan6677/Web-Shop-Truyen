import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
	FiEye,
	FiEyeOff,
	FiLock,
	FiMail,
	FiMapPin,
	FiPhone,
	FiUser,
} from "react-icons/fi";
import { isAuthenticated, signUp } from "../../utils/auth";

function Register() {
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		password: "",
		phone: "",
		address: "",
	});

	if (isAuthenticated()) {
		return <Navigate to="/" replace />;
	}

	const handleChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
		setErrorMessage("");
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!formData.fullName.trim() || !formData.email.trim() || !formData.password) {
			setErrorMessage("Vui lòng nhập đầy đủ thông tin.");
			return;
		}

		setIsSubmitting(true);

		try {
			const account = await signUp({
				fullName: formData.fullName.trim(),
				email: formData.email.trim(),
				password: formData.password,
				phone: formData.phone.trim(),
				address: formData.address.trim(),
			});

			navigate(account.role === "admin" ? "/admin" : "/");
		} catch (error) {
			setErrorMessage(error.message || "Đăng ký thất bại.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section className="flex min-h-screen items-center justify-center px-4 py-10">
			<div className="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
				<div className="mx-auto w-full max-w-md">
					<h1 className="mt-2 text-4xl font-bold text-slate-900">Đăng ký</h1>
					<p className="mt-3 text-sm leading-6 text-slate-500">
						Tạo tài khoản mới để mua truyện và theo dõi đơn hàng.
					</p>

					<form onSubmit={handleSubmit} className="mt-8 grid gap-5">
						<label className="grid gap-2 text-sm font-medium text-slate-700">
							Họ và tên
							<div className="relative">
								<FiUser className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
								<input
									type="text"
									value={formData.fullName}
									onChange={(e) => handleChange("fullName", e.target.value)}
									placeholder="Nguyen Van A"
									className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
								/>
							</div>
						</label>

						<label className="grid gap-2 text-sm font-medium text-slate-700">
							Email
							<div className="relative">
								<FiMail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
								<input
									type="email"
									value={formData.email}
									onChange={(e) => handleChange("email", e.target.value)}
									placeholder="email@example.com"
									className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
								/>
							</div>
						</label>

						<label className="grid gap-2 text-sm font-medium text-slate-700">
							Mật khẩu
							<div className="relative">
								<FiLock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
								<input
									type={showPassword ? "text" : "password"}
									value={formData.password}
									onChange={(e) => handleChange("password", e.target.value)}
									placeholder="Nhập mật khẩu"
									className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-12 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
								/>
								<button
									type="button"
									onClick={() => setShowPassword((prev) => !prev)}
									className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
									aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
								>
									{showPassword ? (
										<FiEyeOff className="h-4 w-4" />
									) : (
										<FiEye className="h-4 w-4" />
									)}
								</button>
							</div>
						</label>

						<label className="grid gap-2 text-sm font-medium text-slate-700">
							Số điện thoại
							<div className="relative">
								<FiPhone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
								<input
									type="text"
									value={formData.phone}
									onChange={(e) => handleChange("phone", e.target.value)}
									placeholder="0987654321"
									className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
								/>
							</div>
						</label>

						<label className="grid gap-2 text-sm font-medium text-slate-700">
							Địa chỉ
							<div className="relative">
								<FiMapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
								<input
									type="text"
									value={formData.address}
									onChange={(e) => handleChange("address", e.target.value)}
									placeholder="Nhập địa chỉ"
									className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
								/>
							</div>
						</label>

						{errorMessage && (
							<div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
								{errorMessage}
							</div>
						)}

						<button
							type="submit"
							disabled={isSubmitting}
							className="mt-2 h-12 rounded-xl bg-blue-500 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300"
						>
							{isSubmitting ? "Đang tạo tài khoản..." : "Đăng ký"}
						</button>
					</form>

					<p className="mt-6 text-center text-sm text-slate-500">
						Đã có tài khoản?{" "}
						<Link
							to="/login"
							className="font-semibold text-blue-600 transition hover:text-blue-700"
						>
							Đăng nhập
						</Link>
					</p>
				</div>
			</div>
		</section>
	);
}

export default Register;

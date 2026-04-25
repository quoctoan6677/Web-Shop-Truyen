import { Link } from 'react-router-dom'

function Login() {
	return (
		<section className="mx-auto mt-10 w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
			<h1 className="text-2xl font-bold">Dang nhap</h1>
			<p className="mt-2 text-slate-600">Trang dang nhap mau.</p>
			<Link to="/register" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
				Chua co tai khoan? Dang ky
			</Link>
		</section>
	)
}

export default Login

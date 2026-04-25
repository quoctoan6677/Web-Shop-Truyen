import { Link } from 'react-router-dom'

function Register() {
	return (
		<section className="mx-auto mt-10 w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
			<h1 className="text-2xl font-bold">Dang ky</h1>
			<p className="mt-2 text-slate-600">Trang dang ky mau.</p>
			<Link to="/login" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
				Da co tai khoan? Dang nhap
			</Link>
		</section>
	)
}

export default Register

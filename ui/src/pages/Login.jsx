import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, Eye, EyeOff, Server, Lock, User } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuthStore } from "../store";

function Login() {
	const navigate = useNavigate();
	const login = useAuthStore((state) => state.login);

	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	// Check if already authenticated
	useEffect(() => {
		const token = localStorage.getItem("auth_token");
		const username = localStorage.getItem("auth_username");

		if (token || username) {
			api.auth.validateToken().then((valid) => {
				if (valid) {
					navigate("/dashboard");
				}
			});
		}
	}, [navigate]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		setError("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const { username, password } = formData;

			if (!username || !password) {
				setError("Please enter both username and password");
				setLoading(false);
				return;
			}

			// Try to login with basic auth first
			const response = await api.auth.login(username, password);

			if (response) {
				login({ username }, null);
				toast.success("Login successful!");
				navigate("/dashboard");
			}
		} catch (err) {
			console.error("Login error:", err);

			if (err.response?.status === 401) {
				setError("Invalid username or password");
			} else if (err.response?.status === 403) {
				setError("Access denied");
			} else {
				setError(
					"Unable to connect to server. Please check your connection.",
				);
			}

			toast.error(error || "Login failed");
		} finally {
			setLoading(false);
		}
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 p-4">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-md"
			>
				{/* Logo and Title */}
				<div className="text-center mb-8">
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{
							delay: 0.2,
							type: "spring",
							stiffness: 200,
						}}
						className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl shadow-glow mb-4"
					>
						<Server className="w-10 h-10 text-white" />
					</motion.div>

					<motion.h1
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3 }}
						className="text-4xl font-bold text-white mb-2"
					>
						datarhei Core
					</motion.h1>

					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.4 }}
						className="text-dark-300"
					>
						FFmpeg Process Management & Streaming
					</motion.p>
				</div>

				{/* Login Form */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
					className="bg-dark-800 rounded-2xl shadow-2xl p-8 border border-dark-700"
				>
					<h2 className="text-2xl font-semibold text-white mb-6">
						Sign In
					</h2>

					{error && (
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							className="bg-error-500/10 border border-error-500 text-error-400 px-4 py-3 rounded-lg mb-6 flex items-start"
						>
							<Lock className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
							<span className="text-sm">{error}</span>
						</motion.div>
					)}

					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Username Field */}
						<div>
							<label
								htmlFor="username"
								className="block text-sm font-medium text-dark-300 mb-2"
							>
								Username
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<User className="h-5 w-5 text-dark-400" />
								</div>
								<input
									type="text"
									id="username"
									name="username"
									value={formData.username}
									onChange={handleChange}
									className="block w-full pl-10 pr-3 py-3 border border-dark-600 rounded-lg bg-dark-700 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
									placeholder="Enter your username"
									required
									autoComplete="username"
									autoFocus
								/>
							</div>
						</div>

						{/* Password Field */}
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-dark-300 mb-2"
							>
								Password
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Lock className="h-5 w-5 text-dark-400" />
								</div>
								<input
									type={showPassword ? "text" : "password"}
									id="password"
									name="password"
									value={formData.password}
									onChange={handleChange}
									className="block w-full pl-10 pr-12 py-3 border border-dark-600 rounded-lg bg-dark-700 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
									placeholder="Enter your password"
									required
									autoComplete="current-password"
								/>
								<button
									type="button"
									onClick={togglePasswordVisibility}
									className="absolute inset-y-0 right-0 pr-3 flex items-center text-dark-400 hover:text-white transition-colors"
								>
									{showPassword ? (
										<EyeOff className="h-5 w-5" />
									) : (
										<Eye className="h-5 w-5" />
									)}
								</button>
							</div>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={loading}
							className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-glow"
						>
							{loading ? (
								<>
									<svg
										className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
									Signing in...
								</>
							) : (
								<>
									<LogIn className="w-5 h-5 mr-2" />
									Sign In
								</>
							)}
						</button>
					</form>

					{/* Additional Info */}
					<div className="mt-6 pt-6 border-t border-dark-700">
						<p className="text-sm text-dark-400 text-center">
							Default credentials:{" "}
							<span className="text-primary-400 font-mono">
								admin / admin123
							</span>
						</p>
					</div>
				</motion.div>

				{/* Footer */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.6 }}
					className="mt-8 text-center"
				>
					<p className="text-sm text-dark-400">
						Powered by{" "}
						<a
							href="https://datarhei.com"
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary-400 hover:text-primary-300 transition-colors"
						>
							datarhei
						</a>
					</p>
					<p className="text-xs text-dark-500 mt-2">
						Licensed under Apache 2.0 • GDPR Compliant
					</p>
				</motion.div>
			</motion.div>
		</div>
	);
}

export default Login;

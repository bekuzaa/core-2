import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

// Stores
import { useAuthStore, useUIStore } from "./store";

// Pages
import {
	Login,
	Dashboard,
	Processes,
	ProcessDetails,
	Wizard,
	Settings,
	Metrics,
	Sessions,
	FileManager,
	Logs,
	Documentation,
	NotFound,
} from "./pages";

// Layout
import Layout from "./components/Layout";

// Styles
import "./index.css";

// Create React Query client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: 1,
			staleTime: 30000,
		},
	},
});

// Protected Route Component
function ProtectedRoute({ children }) {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	return children;
}

// Public Route Component (redirect to dashboard if already authenticated)
function PublicRoute({ children }) {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	if (isAuthenticated) {
		return <Navigate to="/dashboard" replace />;
	}

	return children;
}

function App() {
	const theme = useUIStore((state) => state.theme);
	const setTheme = useUIStore((state) => state.setTheme);

	// Initialize theme
	useEffect(() => {
		const savedTheme = localStorage.getItem("theme") || "dark";
		setTheme(savedTheme);
	}, [setTheme]);

	// Apply theme class to document
	useEffect(() => {
		document.documentElement.classList.toggle("dark", theme === "dark");
	}, [theme]);

	return (
		<QueryClientProvider client={queryClient}>
			<Router>
				<div className="App">
					<Routes>
						{/* Public Routes */}
						<Route
							path="/login"
							element={
								<PublicRoute>
									<Login />
								</PublicRoute>
							}
						/>

						{/* Protected Routes */}
						<Route
							path="/"
							element={
								<ProtectedRoute>
									<Layout />
								</ProtectedRoute>
							}
						>
							<Route
								index
								element={<Navigate to="/dashboard" replace />}
							/>
							<Route path="dashboard" element={<Dashboard />} />
							<Route path="processes" element={<Processes />} />
							<Route
								path="processes/:id"
								element={<ProcessDetails />}
							/>
							<Route path="wizard" element={<Wizard />} />
							<Route path="metrics" element={<Metrics />} />
							<Route path="sessions" element={<Sessions />} />
							<Route path="files" element={<FileManager />} />
							<Route path="logs" element={<Logs />} />
							<Route path="settings" element={<Settings />} />
							<Route path="docs" element={<Documentation />} />
						</Route>

						{/* 404 Not Found */}
						<Route path="*" element={<NotFound />} />
					</Routes>

					{/* Toast Notifications */}
					<Toaster
						position="top-right"
						toastOptions={{
							duration: 4000,
							className: "toast-notification",
							success: {
								duration: 3000,
								iconTheme: {
									primary: "#10b981",
									secondary: "#fff",
								},
							},
							error: {
								duration: 5000,
								iconTheme: {
									primary: "#ef4444",
									secondary: "#fff",
								},
							},
							loading: {
								iconTheme: {
									primary: "#3b82f6",
									secondary: "#fff",
								},
							},
						}}
					/>
				</div>
			</Router>
		</QueryClientProvider>
	);
}

export default App;

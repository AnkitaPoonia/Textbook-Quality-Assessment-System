import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home"; // Guest Landing Page
import LoggedHome from "./pages/LoggedHome"; // User Community Feed
import Books from "./pages/Books"; // The Library (Grid of Books)
import BookDetail from "./pages/BookDetail";
import AddBook from "./pages/AddBook";
import ReviewBook from "./pages/ReviewBook";
import Admin from "./pages/Admin";
import UserProfile from "./pages/UserProfile";
import AdminLogin from "./pages/AdminLogin";
import ProtectedRoute from "./component/ProtectedRoute";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import { useAuth } from "./context/AuthContext";
import ShareUpdate from "./pages/ShareUpdate";

export default function App() {
	const { user, loading } = useAuth();

	if (loading)
		return (
			<div style={{ padding: "2rem", textAlign: "center" }}>Loading app...</div>
		);

	return (
		<div
			style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
		>
			<Navbar />
			<div style={{ flex: 1 }}>
				<Routes>
					{/* 1. HOME: Guest -> Landing Page | User -> Community Feed */}
					<Route path="/" element={user ? <LoggedHome /> : <Home />} />

					{/* 2. AUTH */}
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/secret-admin-login" element={<AdminLogin />} />
					<Route
						path="/share"
						element={
							<ProtectedRoute>
								<ShareUpdate />
							</ProtectedRoute>
						}
					/>

					{/* 3. LIBRARY (Books) */}
					<Route
						path="/books"
						element={
							<ProtectedRoute>
								<Books />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/books/:id"
						element={
							<ProtectedRoute>
								<BookDetail />
							</ProtectedRoute>
						}
					/>

					{/* 4. ACTIONS */}
					{/* CHANGED: Students can now add books too */}
					<Route
						path="/add-book"
						element={
							<ProtectedRoute roles={["teacher", "student", "admin"]}>
								<AddBook />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/review/:id"
						element={
							<ProtectedRoute>
								<ReviewBook />
							</ProtectedRoute>
						}
					/>

					{/* 5. USER & ADMIN */}
					<Route
						path="/profile"
						element={
							<ProtectedRoute>
								<UserProfile />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/admin"
						element={
							<ProtectedRoute roles={["admin"]}>
								<Admin />
							</ProtectedRoute>
						}
					/>

					{/* Catch-all */}
					<Route path="*" element={<Navigate to="/" />} />
				</Routes>
			</div>
			<Footer />
		</div>
	);
}

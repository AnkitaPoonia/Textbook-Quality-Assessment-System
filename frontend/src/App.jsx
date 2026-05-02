import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Home from "./pages/Home.jsx"; // Guest Landing Page
import LoggedHome from "./pages/LoggedHome.jsx"; // User Community Feed
import Books from "./pages/Books.jsx"; // The Library (Grid of Books)
import BookDetail from "./pages/BookDetail.jsx";
import AddBook from "./pages/AddBook.jsx";
import ReviewBook from "./pages/ReviewBook.jsx";
import Admin from "./pages/Admin.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import ProtectedRoute from "./component/ProtectedRoute.jsx";
import Navbar from "./component/Navbar.jsx";
import Footer from "./component/Footer.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import ShareUpdate from "./pages/ShareUpdate.jsx";

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

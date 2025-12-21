import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function Dashboard() {
	const { user } = useAuth();
	const [books, setBooks] = useState([]);

	useEffect(() => {
		// Fetch books to show in the list
		api.get("/books").then((res) => setBooks(res.data));
	}, []);

	return (
		<div className="container">
			{/* Welcome Banner */}
			<div
				style={{
					background: "linear-gradient(to right, #2563eb, #1d4ed8)",
					color: "white",
					padding: "2rem",
					borderRadius: "12px",
					marginBottom: "2rem",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<div>
					<h1 style={{ margin: 0, fontSize: "1.8rem" }}>
						Welcome back, {user.name}!
					</h1>
					<p style={{ margin: "0.5rem 0 0 0", opacity: 0.9 }}>
						You are logged in as a <strong>{user.role}</strong>.
					</p>
				</div>
				<div style={{ textAlign: "right" }}>
					<div style={{ fontSize: "2rem", fontWeight: "bold" }}>
						{user.credits || 0}
					</div>
					<div style={{ fontSize: "0.9rem", opacity: 0.9 }}>Credits Earned</div>
				</div>
			</div>

			{/* Stats Grid */}
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
					gap: "1.5rem",
					marginBottom: "3rem",
				}}
			>
				<div className="card" style={{ borderLeft: "5px solid #2563eb" }}>
					<h3 style={{ margin: "0 0 0.5rem 0", color: "#64748b" }}>
						Total Reviews
					</h3>
					<div style={{ fontSize: "2rem", fontWeight: "bold" }}>
						{user.stats?.reviewsSubmitted || 0}
					</div>
				</div>
				<div className="card" style={{ borderLeft: "5px solid #16a34a" }}>
					<h3 style={{ margin: "0 0 0.5rem 0", color: "#64748b" }}>Approved</h3>
					<div style={{ fontSize: "2rem", fontWeight: "bold" }}>
						{user.stats?.reviewsApproved || 0}
					</div>
				</div>
				<div className="card" style={{ borderLeft: "5px solid #f59e0b" }}>
					<h3 style={{ margin: "0 0 0.5rem 0", color: "#64748b" }}>
						Available Books
					</h3>
					<div style={{ fontSize: "2rem", fontWeight: "bold" }}>
						{books.length}
					</div>
				</div>
			</div>

			{/* Recent Resources Section */}
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "1.5rem",
				}}
			>
				<h2 style={{ margin: 0 }}>Latest Resources</h2>
				{user.role === "teacher" && (
					<Link to="/add-book">
						<button className="primary" style={{ width: "auto" }}>
							+ Add New Book
						</button>
					</Link>
				)}
			</div>

			<div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
				{books.map((b) => (
					<div
						key={b._id}
						className="card"
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							transition: "transform 0.2s",
						}}
					>
						<div>
							<h3 style={{ margin: "0 0 0.5rem 0", color: "#1e293b" }}>
								{b.title}
							</h3>
							<p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>
								{b.author} • {b.subject}
							</p>
						</div>
						<Link to={`/books/${b._id}`}>
							<button
								style={{
									background: "#f1f5f9",
									border: "none",
									padding: "0.5rem 1rem",
									borderRadius: "6px",
									color: "#334155",
									fontWeight: "600",
									cursor: "pointer",
								}}
							>
								View
							</button>
						</Link>
					</div>
				))}
			</div>
		</div>
	);
}

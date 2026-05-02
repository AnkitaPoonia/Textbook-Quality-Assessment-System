import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function AdminLogin() {
	const { login } = useAuth(); // We use the context login, but we'll add extra checks
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleAdminLogin = async (e) => {
		e.preventDefault();
		setError("");

		try {
			// 1. Perform standard login to check credentials
			const res = await api.post("/auth/login", { email, password });

			// 2. CRITICAL SECURITY CHECK: Is this user actually an admin?
			if (res.data.role !== "admin") {
				setError("⛔ ACCESS DENIED: You are not an Administrator.");

				// Immediately logout if they aren't an admin
				await api.post("/auth/logout");
				return;
			}

			// 3. If they are admin, let them in and go to Dashboard
			// We manually update the context user state here or let the page refresh handle it
			// For simplicity, we trigger a hard reload or use the context method if exposed
			// But re-using the 'login' function from context is cleanest:
			await login({ email, password });
			navigate("/admin"); // Send them directly to Admin Dashboard
		} catch (err) {
			setError("Invalid Admin Credentials");
		}
	};

	return (
		<div className="container" style={{ maxWidth: "400px", marginTop: "10vh" }}>
			<div className="card" style={{ borderTop: "5px solid #ef4444" }}>
				<h2 style={{ color: "#b91c1c" }}>🔒 Restricted Area</h2>
				<p
					style={{
						marginBottom: "1.5rem",
						fontSize: "0.9rem",
						color: "#7f1d1d",
					}}
				>
					This login portal is strictly for system administrators.
				</p>

				{error && (
					<div
						style={{
							background: "#fecaca",
							color: "#b91c1c",
							padding: "10px",
							borderRadius: "4px",
							marginBottom: "1rem",
						}}
					>
						{error}
					</div>
				)}

				<form onSubmit={handleAdminLogin}>
					<label>Admin Email</label>
					<input
						type="email"
						placeholder="admin@lpu.in"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>

					<label>Password</label>
					<input
						type="password"
						placeholder="••••••"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>

					<button className="primary" style={{ background: "#ef4444" }}>
						Authenticate
					</button>
				</form>
			</div>
		</div>
	);
}

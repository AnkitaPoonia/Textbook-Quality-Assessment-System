import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [showDropdown, setShowDropdown] = useState(false);
	const dropdownRef = useRef(null);

	// Close dropdown if clicking outside
	useEffect(() => {
		function handleClickOutside(event) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setShowDropdown(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [dropdownRef]);

	const handleLogout = () => {
		logout();
		setShowDropdown(false);
		navigate("/login");
	};

	return (
		<nav
			style={{
				background: "#ffffff",
				padding: "0.8rem 2rem",
				boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				position: "sticky",
				top: 0,
				zIndex: 1000,
			}}
		>
			{/* LOGO */}
			<Link
				to="/"
				style={{
					textDecoration: "none",
					display: "flex",
					alignItems: "center",
					gap: "10px",
				}}
			>
				<div
					style={{
						background: "#2563eb",
						color: "white",
						padding: "6px 12px",
						borderRadius: "8px",
						fontWeight: "bold",
					}}
				>
					LPU
				</div>
				<span
					style={{ fontSize: "1.3rem", fontWeight: "800", color: "#1e293b" }}
				>
					Quality<span style={{ color: "#2563eb" }}>Books</span>
				</span>
			</Link>

			{/* LINKS */}
			<div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
				{user ? (
					<>
						{/* MAIN TABS */}
						<Link to="/" style={navLinkStyle}>
							Community Feed
						</Link>
						<Link to="/books" style={navLinkStyle}>
							Library
						</Link>
						<Link to="/share" style={navLinkStyle}>
							➕ Share Update
						</Link>
						{/* ADMIN ONLY LINK */}
						{user.role === "admin" && (
							<Link
								to="/admin"
								style={{
									...navLinkStyle,
									color: "#dc2626",
									fontWeight: "bold",
								}}
							>
								Admin Panel 🛡️
							</Link>
						)}

						{/* PROFILE DROPDOWN */}
						<div style={{ position: "relative" }} ref={dropdownRef}>
							<div
								onClick={() => setShowDropdown(!showDropdown)}
								style={{
									width: "42px",
									height: "42px",
									background: "#f1f5f9",
									color: "#334155",
									borderRadius: "50%",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									cursor: "pointer",
									fontWeight: "bold",
									border: "2px solid #e2e8f0",
								}}
							>
								{user.name?.[0]?.toUpperCase()}
							</div>

							{showDropdown && (
								<div
									style={{
										position: "absolute",
										right: 0,
										top: "55px",
										background: "white",
										border: "1px solid #e2e8f0",
										borderRadius: "12px",
										boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
										width: "240px",
										overflow: "hidden",
										animation: "fadeIn 0.2s",
									}}
								>
									<div
										style={{
											padding: "1rem",
											borderBottom: "1px solid #f1f5f9",
											background: "#f8fafc",
										}}
									>
										<p
											style={{
												margin: 0,
												fontWeight: "bold",
												color: "#0f172a",
											}}
										>
											{user.name}
										</p>
										<p
											style={{
												margin: 0,
												fontSize: "0.8rem",
												color: "#64748b",
											}}
										>
											{user.role.toUpperCase()}
										</p>
									</div>

									<div style={{ padding: "0.5rem" }}>
										<Link
											to="/profile"
											onClick={() => setShowDropdown(false)}
											style={dropdownItemStyle}
										>
											👤 My Profile
										</Link>
										<Link
											to="/add-book"
											onClick={() => setShowDropdown(false)}
											style={dropdownItemStyle}
										>
											📚 Upload New Book
										</Link>
									</div>

									<div
										style={{
											borderTop: "1px solid #f1f5f9",
											padding: "0.5rem",
										}}
									>
										<button
											onClick={handleLogout}
											style={{
												...dropdownItemStyle,
												width: "100%",
												textAlign: "left",
												color: "#ef4444",
												background: "none",
												border: "none",
											}}
										>
											🚪 Logout
										</button>
									</div>
								</div>
							)}
						</div>
					</>
				) : (
					<div style={{ display: "flex", gap: "1rem" }}>
						<Link
							to="/login"
							style={{
								textDecoration: "none",
								color: "#64748b",
								fontWeight: "600",
								alignSelf: "center",
							}}
						>
							Log In
						</Link>
						<Link to="/signup">
							<button className="primary">Get Started</button>
						</Link>
					</div>
				)}
			</div>
		</nav>
	);
}

const navLinkStyle = {
	textDecoration: "none",
	color: "#475569",
	fontWeight: "600",
	fontSize: "0.95rem",
	transition: "color 0.2s",
};
const dropdownItemStyle = {
	display: "block",
	padding: "0.75rem 1rem",
	textDecoration: "none",
	color: "#334155",
	fontSize: "0.9rem",
	borderRadius: "6px",
	cursor: "pointer",
	transition: "background 0.2s",
};

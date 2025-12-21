import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Books from "./Books";

export default function Home() {
	const { user } = useAuth();

	// If logged in, show the Dashboard (Books List) directly
	if (user) {
		return <Books />;
	}

	// If guest, show the Beautiful Landing Page
	return (
		<div style={{ padding: "0", background: "#f8fafc", minHeight: "100vh" }}>
			{/* HERO SECTION */}
			<div
				style={{
					background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
					color: "white",
					padding: "6rem 2rem",
					textAlign: "center",
					borderRadius: "0 0 60px 60px",
					boxShadow:
						"0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
				}}
			>
				<div style={{ maxWidth: "800px", margin: "0 auto" }}>
					<div
						style={{
							display: "inline-block",
							background: "rgba(255,255,255,0.1)",
							padding: "0.5rem 1rem",
							borderRadius: "50px",
							marginBottom: "1.5rem",
							fontSize: "0.9rem",
							fontWeight: "600",
							letterSpacing: "0.5px",
						}}
					>
						🚀 OFFICIAL ASSESSMENT PORTAL
					</div>

					<h1
						style={{
							fontSize: "3.5rem",
							marginBottom: "1.5rem",
							fontWeight: "800",
							lineHeight: "1.2",
							background: "linear-gradient(to right, #ffffff, #93c5fd)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
						}}
					>
						Elevating Academic <br />
						<span style={{ color: "#60a5fa" }}>Standards Together.</span>
					</h1>

					<p
						style={{
							fontSize: "1.25rem",
							lineHeight: "1.75",
							color: "#cbd5e1",
							marginBottom: "3rem",
						}}
					>
						The centralized platform for educators and students to evaluate,
						review, and discover the highest quality academic resources used
						across campus.
					</p>

					<div
						style={{
							display: "flex",
							gap: "1rem",
							justifyContent: "center",
							flexWrap: "wrap",
						}}
					>
						<Link to="/signup">
							<button
								className="primary"
								style={{
									fontSize: "1.1rem",
									padding: "1rem 2.5rem",
									borderRadius: "50px",
									boxShadow: "0 4px 6px rgba(37, 99, 235, 0.3)",
								}}
							>
								Get Started Now
							</button>
						</Link>
						<Link to="/login">
							<button
								style={{
									background: "rgba(255,255,255,0.1)",
									border: "1px solid rgba(255,255,255,0.2)",
									color: "white",
									fontSize: "1.1rem",
									padding: "1rem 2.5rem",
									borderRadius: "50px",
									cursor: "pointer",
									backdropFilter: "blur(10px)",
								}}
							>
								Login
							</button>
						</Link>
					</div>
				</div>
			</div>

			{/* STATS SECTION */}
			<div
				className="container"
				style={{ marginTop: "-3rem", position: "relative", zIndex: 10 }}
			>
				<div
					className="card"
					style={{
						display: "flex",
						justifyContent: "space-around",
						flexWrap: "wrap",
						gap: "2rem",
						padding: "2rem",
						textAlign: "center",
						boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
					}}
				>
					<div>
						<div
							style={{
								fontSize: "2.5rem",
								fontWeight: "800",
								color: "#2563eb",
							}}
						>
							500+
						</div>
						<div style={{ color: "#64748b", fontWeight: "600" }}>
							Resources Added
						</div>
					</div>
					<div
						style={{ width: "1px", background: "#e2e8f0", display: "none" }}
					></div>{" "}
					{/* Divider */}
					<div>
						<div
							style={{
								fontSize: "2.5rem",
								fontWeight: "800",
								color: "#16a34a",
							}}
						>
							1.2k
						</div>
						<div style={{ color: "#64748b", fontWeight: "600" }}>
							Student Reviews
						</div>
					</div>
					<div>
						<div
							style={{
								fontSize: "2.5rem",
								fontWeight: "800",
								color: "#f59e0b",
							}}
						>
							50+
						</div>
						<div style={{ color: "#64748b", fontWeight: "600" }}>
							Verified Faculty
						</div>
					</div>
				</div>
			</div>

			{/* FEATURES SECTION */}
			<div
				className="container"
				style={{ marginTop: "5rem", marginBottom: "5rem" }}
			>
				<div style={{ textAlign: "center", marginBottom: "4rem" }}>
					<h2
						style={{
							fontSize: "2.5rem",
							color: "#1e293b",
							marginBottom: "1rem",
						}}
					>
						Why Use Our Platform?
					</h2>
					<p style={{ color: "#64748b", maxWidth: "600px", margin: "0 auto" }}>
						We ensure every textbook and reference material meets the highest
						educational standards through our unique 3-step verification
						process.
					</p>
				</div>

				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
						gap: "2rem",
					}}
				>
					{/* Feature 1 */}
					<div
						className="card"
						style={{
							textAlign: "left",
							borderTop: "5px solid #2563eb",
							padding: "2rem",
						}}
					>
						<div
							style={{
								width: "60px",
								height: "60px",
								background: "#eff6ff",
								borderRadius: "12px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								fontSize: "2rem",
								marginBottom: "1.5rem",
							}}
						>
							📚
						</div>
						<h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
							Curated Library
						</h3>
						<p style={{ color: "#64748b", lineHeight: "1.6" }}>
							Strictly moderated collection. Only books approved by verified
							faculty members appear on the dashboard.
						</p>
					</div>

					{/* Feature 2 */}
					<div
						className="card"
						style={{
							textAlign: "left",
							borderTop: "5px solid #f59e0b",
							padding: "2rem",
						}}
					>
						<div
							style={{
								width: "60px",
								height: "60px",
								background: "#fffbeb",
								borderRadius: "12px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								fontSize: "2rem",
								marginBottom: "1.5rem",
							}}
						>
							⭐
						</div>
						<h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
							Standardized Reviews
						</h3>
						<p style={{ color: "#64748b", lineHeight: "1.6" }}>
							Evaluation based on clear criteria: Accuracy, Relevance,
							Readability, and Visual Engagement.
						</p>
					</div>

					{/* Feature 3 */}
					<div
						className="card"
						style={{
							textAlign: "left",
							borderTop: "5px solid #16a34a",
							padding: "2rem",
						}}
					>
						<div
							style={{
								width: "60px",
								height: "60px",
								background: "#f0fdf4",
								borderRadius: "12px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								fontSize: "2rem",
								marginBottom: "1.5rem",
							}}
						>
							🏆
						</div>
						<h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
							Credit System
						</h3>
						<p style={{ color: "#64748b", lineHeight: "1.6" }}>
							Students earn academic credits for every approved review,
							encouraging high-quality feedback.
						</p>
					</div>
				</div>
			</div>

			{/* CTA SECTION */}
			<div
				style={{
					background: "#1e293b",
					color: "white",
					padding: "4rem 2rem",
					textAlign: "center",
				}}
			>
				<h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
					Ready to improve quality?
				</h2>
				<p style={{ color: "#94a3b8", marginBottom: "2rem" }}>
					Join hundreds of students and teachers today.
				</p>
				<Link to="/signup">
					<button
						className="primary"
						style={{
							background: "white",
							color: "#2563eb",
							padding: "1rem 3rem",
							borderRadius: "50px",
						}}
					>
						Create Free Account
					</button>
				</Link>
			</div>
		</div>
	);
}

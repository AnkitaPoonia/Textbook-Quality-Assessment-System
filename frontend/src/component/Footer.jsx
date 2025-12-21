export default function Footer() {
	return (
		<footer
			style={{
				background: "#0f172a",
				color: "#94a3b8",
				padding: "3rem 0",
				marginTop: "auto",
			}}
		>
			<div
				className="container"
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
					gap: "2rem",
				}}
			>
				<div>
					<h3 style={{ color: "white", marginBottom: "1rem" }}>
						LPU QualityBooks
					</h3>
					<p style={{ fontSize: "0.9rem", lineHeight: "1.6" }}>
						The official centralized platform for academic resource assessment
						and quality control.
					</p>
				</div>

				<div>
					<h4 style={{ color: "white", marginBottom: "1rem" }}>Quick Links</h4>
					<ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
						<li style={{ marginBottom: "0.5rem" }}>
							<a href="#" style={{ color: "#94a3b8", textDecoration: "none" }}>
								About Us
							</a>
						</li>
						<li style={{ marginBottom: "0.5rem" }}>
							<a href="#" style={{ color: "#94a3b8", textDecoration: "none" }}>
								Assessment Criteria
							</a>
						</li>
						<li style={{ marginBottom: "0.5rem" }}>
							<a href="#" style={{ color: "#94a3b8", textDecoration: "none" }}>
								Privacy Policy
							</a>
						</li>
					</ul>
				</div>

				<div>
					<h4 style={{ color: "white", marginBottom: "1rem" }}>Contact</h4>
					<p style={{ fontSize: "0.9rem" }}>
						LPU Campus, Jalandhar - Delhi, G.T. Road, Phagwara, Punjab (India) -
						144411
					</p>
					<p style={{ fontSize: "0.9rem" }}>Email: support@lpu.in</p>
				</div>
			</div>
			<div
				style={{
					textAlign: "center",
					borderTop: "1px solid #1e293b",
					marginTop: "2rem",
					paddingTop: "2rem",
					fontSize: "0.8rem",
				}}
			>
				&copy; {new Date().getFullYear()} LPU Assessment Platform. All rights
				reserved.
			</div>
		</footer>
	);
}

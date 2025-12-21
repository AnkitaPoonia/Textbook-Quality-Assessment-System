import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function BookDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { user } = useAuth();

	const [data, setData] = useState(null);
	const [reviews, setReviews] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);

	// --- EDIT FORM STATE ---
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		author: "",
		subject: "",
		edition: "",
		level: "UG",
		format: "textbook",
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const bookRes = await api.get(`/books/${id}`);
				setData(bookRes.data);

				// Initialize form with current book data
				const b = bookRes.data.book;
				setFormData({
					title: b.title || "",
					author: b.author || "",
					subject: b.subject || "",
					edition: b.edition || "",
					level: b.level || "UG",
					format: b.format || "textbook",
				});

				const reviewRes = await api.get(`/reviews/book/${id}`);
				setReviews(reviewRes.data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching details:", error);
				setLoading(false);
			}
		};
		fetchData();
	}, [id]);

	// --- HANDLERS ---
	const handleUpdateBook = async (e) => {
		e.preventDefault();
		try {
			// PUT request to update multiple fields
			const res = await api.put(`/books/${id}`, formData);
			setData({ ...data, book: res.data });
			setIsEditing(false);
			alert("Book details updated successfully!");
		} catch (err) {
			alert("Failed to update book.");
		}
	};

	const handleDeleteBook = async () => {
		if (!window.confirm("Are you sure you want to delete this book?")) return;
		try {
			await api.delete(`/books/${id}`);
			navigate("/books");
		} catch (err) {
			alert("Failed to delete book.");
		}
	};

	if (loading)
		return (
			<div className="container">
				<p>Loading...</p>
			</div>
		);
	if (!data)
		return (
			<div className="container">
				<p>Book not found</p>
			</div>
		);

	const { book } = data;
	const breakdown = book.scoreBreakdown || [];

	// Helpers
	const formatScore = (val) =>
		val !== undefined && val !== null ? val.toFixed(1) : "0.0";
	const renderStars = (score) => {
		const stars = [];
		const rounded = Math.round(score || 0);
		for (let i = 1; i <= 5; i++) {
			stars.push(
				<span key={i} style={{ color: i <= rounded ? "#fbbf24" : "#cbd5e1" }}>
					★
				</span>
			);
		}
		return (
			<span style={{ fontSize: "1.5rem", letterSpacing: "2px" }}>{stars}</span>
		);
	};

	return (
		<div className="container">
			<div className="card">
				{isEditing ? (
					/* --- FULL UPDATE FORM --- */
					<form onSubmit={handleUpdateBook}>
						<h2 style={{ marginBottom: "1.5rem" }}>Update Resource Details</h2>

						<label>Title</label>
						<input
							value={formData.title}
							onChange={(e) =>
								setFormData({ ...formData, title: e.target.value })
							}
							required
						/>

						<label>Author</label>
						<input
							value={formData.author}
							onChange={(e) =>
								setFormData({ ...formData, author: e.target.value })
							}
							required
						/>

						<div
							style={{
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: "1rem",
							}}
						>
							<div>
								<label>Subject</label>
								<input
									value={formData.subject}
									onChange={(e) =>
										setFormData({ ...formData, subject: e.target.value })
									}
									required
								/>
							</div>
							<div>
								<label>Edition</label>
								<input
									value={formData.edition}
									onChange={(e) =>
										setFormData({ ...formData, edition: e.target.value })
									}
								/>
							</div>
						</div>

						<div
							style={{
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: "1rem",
							}}
						>
							<div>
								<label>Level</label>
								<select
									value={formData.level}
									onChange={(e) =>
										setFormData({ ...formData, level: e.target.value })
									}
								>
									<option value="UG">UG</option>
									<option value="PG">PG</option>
								</select>
							</div>
							<div>
								<label>Format</label>
								<select
									value={formData.format}
									onChange={(e) =>
										setFormData({ ...formData, format: e.target.value })
									}
								>
									<option value="textbook">Textbook</option>
									<option value="reference">Reference</option>
									<option value="ebook">E-book</option>
								</select>
							</div>
						</div>

						<div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
							<button className="primary" type="submit">
								Save Changes
							</button>
							<button
								type="button"
								onClick={() => setIsEditing(false)}
								style={{
									background: "#94a3b8",
									color: "white",
									border: "none",
									padding: "0.75rem 1.5rem",
									borderRadius: "4px",
									cursor: "pointer",
								}}
							>
								Cancel
							</button>
						</div>
					</form>
				) : (
					/* --- DISPLAY MODE --- */
					<>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "start",
							}}
						>
							<div>
								<h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
									{book.title}
								</h2>
								<p style={{ color: "#64748b", marginBottom: "2rem" }}>
									Added by: {book.addedBy?.name || book.author} | Level:{" "}
									{book.level || "UG"}
								</p>
							</div>
							{/* Only Admin or Owner can edit/delete */}
							{(user.role === "admin" || user._id === book.addedBy?._id) && (
								<div style={{ display: "flex", gap: "10px" }}>
									<button onClick={() => setIsEditing(true)} style={btnEdit}>
										✏️ Edit Form
									</button>
									<button onClick={handleDeleteBook} style={btnDelete}>
										🗑️ Delete
									</button>
								</div>
							)}
						</div>

						<div
							style={{
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: "2rem",
							}}
						>
							{/* LEFT: INFO */}
							<div>
								<h3>Book Details</h3>
								<p>
									<strong>Subject:</strong> {book.subject}
								</p>
								<p>
									<strong>Author:</strong> {book.author}
								</p>
								<p>
									<strong>Edition:</strong> {book.edition || "N/A"}
								</p>
								<p>
									<strong>Format:</strong> {book.format || "Physical"}
								</p>
							</div>

							{/* RIGHT: SCORE CARD */}
							<div
								style={{
									background: "#f8fafc",
									padding: "1.5rem",
									borderRadius: "8px",
									border: "1px solid #e2e8f0",
									textAlign: "center",
								}}
							>
								<div
									style={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										gap: "10px",
										marginBottom: "10px",
									}}
								>
									<h3 style={{ margin: 0 }}>Quality Score</h3>
									<span onClick={() => setShowModal(true)} style={infoIcon}>
										i
									</span>
								</div>
								<div style={{ marginBottom: "5px" }}>
									{renderStars(book.finalScore)}
								</div>
								<div
									style={{
										fontSize: "2.5rem",
										fontWeight: "bold",
										color: book.finalScore > 0 ? "#1e293b" : "#94a3b8",
									}}
								>
									{formatScore(book.finalScore)}{" "}
									<span
										style={{
											fontSize: "1rem",
											color: "#64748b",
											fontWeight: "normal",
										}}
									>
										/ 5.0
									</span>
								</div>
								<div
									style={{
										marginTop: "1.5rem",
										display: "flex",
										justifyContent: "center",
										gap: "20px",
										fontSize: "0.9rem",
										color: "#475569",
									}}
								>
									<div>
										<strong>Student:</strong> {formatScore(book.studentAvg)}
									</div>
									<div
										style={{
											borderLeft: "1px solid #cbd5e1",
											paddingLeft: "20px",
										}}
									>
										<strong>Faculty:</strong> {formatScore(book.teacherAvg)}
									</div>
								</div>
							</div>
						</div>

						<hr style={{ margin: "2rem 0", borderTop: "1px solid #e2e8f0" }} />

						<div style={{ display: "flex", gap: "1rem" }}>
							{book.pdfUrl && (
								<a
									href={`http://localhost:8000${book.pdfUrl}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									<button className="primary" style={{ background: "#ef4444" }}>
										📄 Read PDF
									</button>
								</a>
							)}
							{(user.role === "student" || user.role === "teacher") && (
								<Link to={`/review/${id}`}>
									<button className="primary">Write a Review</button>
								</Link>
							)}
						</div>

						<div style={{ marginTop: "3rem" }}>
							<h3>Recent Reviews</h3>
							{reviews.length === 0 && (
								<p style={{ color: "#94a3b8" }}>No reviews yet.</p>
							)}
							{reviews.map((r) => (
								<div
									key={r._id}
									style={{
										borderBottom: "1px solid #f1f5f9",
										padding: "1rem 0",
									}}
								>
									<div
										style={{ display: "flex", justifyContent: "space-between" }}
									>
										<strong>
											{r.user?.name}{" "}
											<span style={{ fontSize: "0.8rem", color: "#64748b" }}>
												({r.user?.role})
											</span>
										</strong>
										<span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
											{new Date(r.createdAt).toLocaleDateString()}
										</span>
									</div>
									<p style={{ marginTop: "0.5rem", color: "#334155" }}>
										{r.comment || <em>No comment provided</em>}
									</p>
								</div>
							))}
						</div>
					</>
				)}
			</div>

			{/* BREAKDOWN MODAL */}
			{showModal && (
				<div style={modalOverlay} onClick={() => setShowModal(false)}>
					<div style={modalContent} onClick={(e) => e.stopPropagation()}>
						<h2 style={{ marginTop: 0 }}>Score Breakdown</h2>
						{breakdown.length > 0 ? (
							breakdown.map((item, i) => (
								<div key={i} style={{ marginBottom: "1rem" }}>
									<div
										style={{
											display: "flex",
											justifyContent: "space-between",
											marginBottom: "5px",
										}}
									>
										<span>{item.criteriaName}</span>
										<span style={{ fontWeight: "bold", color: "#2563eb" }}>
											{item.average.toFixed(1)}
										</span>
									</div>
									<div style={progressBg}>
										<div
											style={{
												...progressFill,
												width: `${(item.average / 5) * 100}%`,
												background: item.average > 3.5 ? "#22c55e" : "#eab308",
											}}
										></div>
									</div>
								</div>
							))
						) : (
							<p style={{ textAlign: "center", color: "#94a3b8" }}>
								No detailed criteria yet.
							</p>
						)}
						<button
							onClick={() => setShowModal(false)}
							className="primary"
							style={{ marginTop: "1rem" }}
						>
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

// Inline Styles
const btnEdit = {
	background: "#e0f2fe",
	color: "#0284c7",
	border: "none",
	padding: "8px 15px",
	borderRadius: "6px",
	cursor: "pointer",
	fontWeight: "bold",
};
const btnDelete = {
	background: "#fee2e2",
	color: "#ef4444",
	border: "none",
	padding: "8px 15px",
	borderRadius: "6px",
	cursor: "pointer",
	fontWeight: "bold",
};
const infoIcon = {
	cursor: "pointer",
	background: "#dbeafe",
	color: "#2563eb",
	width: "20px",
	height: "20px",
	borderRadius: "50%",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	fontWeight: "bold",
	fontSize: "0.8rem",
};
const modalOverlay = {
	position: "fixed",
	top: 0,
	left: 0,
	width: "100%",
	height: "100%",
	background: "rgba(0,0,0,0.5)",
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	zIndex: 2000,
};
const modalContent = {
	background: "white",
	padding: "2rem",
	borderRadius: "8px",
	width: "400px",
	maxWidth: "90%",
};
const progressBg = {
	width: "100%",
	background: "#e2e8f0",
	height: "8px",
	borderRadius: "4px",
	overflow: "hidden",
};
const progressFill = { height: "100%", borderRadius: "4px" };

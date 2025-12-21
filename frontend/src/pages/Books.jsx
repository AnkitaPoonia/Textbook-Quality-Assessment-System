import React, { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

/* ------------------ BookCard ------------------ */
const BookCard = ({ book }) => {
	if (!book || !book._id) return null;

	const uploaderRole = book.addedBy?.role || "student";
	let roleColor = "#16a34a";
	let roleLabel = "STUDENT";

	if (uploaderRole === "admin") {
		roleColor = "#dc2626";
		roleLabel = "ADMIN";
	} else if (uploaderRole === "teacher") {
		roleColor = "#2563eb";
		roleLabel = "FACULTY";
	}

	const gradients = [
		"linear-gradient(135deg, #a5b4fc, #6366f1)",
		"linear-gradient(135deg, #fca5a5, #ef4444)",
		"linear-gradient(135deg, #86efac, #22c55e)",
		"linear-gradient(135deg, #fcd34d, #f59e0b)",
	];

	const bg = gradients[(book.title?.length || 0) % gradients.length];

	const coverSrc = book.coverImage
		? `http://localhost:8000${book.coverImage}`
		: null;

	return (
		<div
			style={{
				borderRadius: 10,
				overflow: "hidden",
				display: "flex",
				flexDirection: "column",
				background: "#fff",
				boxShadow: "0 6px 18px rgba(16,24,40,0.06)",
			}}
		>
			<Link to={`/books/${book._id}`} style={{ textDecoration: "none" }}>
				{coverSrc ? (
					<img
						src={coverSrc}
						alt={book.title}
						style={{
							height: 180,
							width: "100%",
							objectFit: "cover",
						}}
					/>
				) : (
					<div
						style={{
							height: 180,
							background: bg,
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
							color: "white",
							padding: "1rem",
							textAlign: "center",
						}}
					>
						<div style={{ fontSize: "2.5rem" }}>📖</div>
						<h3
							style={{
								fontSize: "1.05rem",
								fontWeight: 800,
								marginTop: "0.5rem",
								textShadow: "0 1px 2px rgba(0,0,0,0.2)",
								overflow: "hidden",
								textOverflow: "ellipsis",
								display: "-webkit-box",
								WebkitLineClamp: 2,
								WebkitBoxOrient: "vertical",
							}}
						>
							{book.title}
						</h3>
					</div>
				)}
			</Link>

			<div style={{ padding: "1rem 1.25rem" }}>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "start",
						marginBottom: "0.75rem",
					}}
				>
					<div>
						<span style={{ fontSize: "0.75rem", color: "#64748b" }}>
							Author
						</span>
						<div style={{ fontWeight: 600, color: "#0f172a" }}>
							{book.author}
						</div>
					</div>

					<span
						style={{
							fontSize: "0.65rem",
							fontWeight: "700",
							color: roleColor,
							border: `1px solid ${roleColor}`,
							padding: "3px 8px",
							borderRadius: 6,
						}}
					>
						{roleLabel}
					</span>
				</div>

				<div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
					<span style={pillStyle}>{book.subject}</span>
					<span style={pillStyle}>{book.level || "UG"}</span>
				</div>

				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						borderTop: "1px solid #eef2f7",
						paddingTop: "0.8rem",
					}}
				>
					<Link to={`/books/${book._id}`}>
						<button style={viewButtonStyle}>View Details</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

const pillStyle = {
	background: "#f1f5f9",
	padding: "4px 8px",
	borderRadius: 6,
	fontSize: "0.75rem",
	color: "#475569",
};

const viewButtonStyle = {
	background: "white",
	border: "1px solid #2563eb",
	color: "#2563eb",
	padding: "6px 12px",
	borderRadius: 8,
	cursor: "pointer",
	fontWeight: 600,
};

/* ------------------ Books Page ------------------ */
export default function Books() {
	const [books, setBooks] = useState([]);
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const debounceRef = useRef(null);

	useEffect(() => {
		if (debounceRef.current) clearTimeout(debounceRef.current);

		debounceRef.current = setTimeout(() => {
			setLoading(true);
			api
				.get("/books", {
					params: search ? { search: search.trim() } : {},
				})
				.then((res) => {
					setBooks(res.data || []);
					setLoading(false);
				})
				.catch((err) => {
					console.error(err);
					setError("Failed to load books");
					setLoading(false);
				});
		}, 350);

		return () => clearTimeout(debounceRef.current);
	}, [search]);

	return (
		<div className="container" style={{ padding: "1.5rem" }}>
			<div
				style={{
					marginBottom: "1.5rem",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					gap: "1rem",
				}}
			>
				<div>
					<h2 style={{ margin: 0 }}>Library</h2>
					<p style={{ marginTop: 6, color: "#64748b" }}>
						Browse verified academic resources.
					</p>
				</div>

				<input
					type="text"
					placeholder="Search by title, author, subject..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					style={{
						width: 260,
						padding: "0.6rem 0.8rem",
						borderRadius: 8,
						border: "1px solid #cbd5f5",
						outline: "none",
					}}
				/>
			</div>

			{loading && (
				<div style={{ textAlign: "center", padding: "3rem" }}>
					Loading library...
				</div>
			)}

			{!loading && error && (
				<div style={{ textAlign: "center", color: "#dc2626" }}>{error}</div>
			)}

			{!loading && !error && books.length === 0 && (
				<div style={{ textAlign: "center", padding: "4rem", color: "#6b7280" }}>
					<h3>No books found 📚</h3>
				</div>
			)}

			{!loading && !error && books.length > 0 && (
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
						gap: "1.5rem",
					}}
				>
					{books.map((book) => (
						<BookCard key={book._id} book={book} />
					))}
				</div>
			)}
		</div>
	);
}

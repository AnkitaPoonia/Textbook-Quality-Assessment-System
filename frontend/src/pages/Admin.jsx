import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Admin() {
	const [books, setBooks] = useState([]);
	const [posts, setPosts] = useState([]);
	const [refresh, setRefresh] = useState(false);

	useEffect(() => {
		fetchPending();
	}, [refresh]);

	const fetchPending = () => {
		api
			.get("/books/pending")
			.then((res) => setBooks(res.data))
			.catch(console.error);
		api
			.get("/community/pending")
			.then((res) => setPosts(res.data))
			.catch(console.error);
	};

	// --- BOOK ACTIONS ---
	const handleBookAction = async (id, action) => {
		try {
			// action = "approve" or "reject"
			await api.put(`/books/${id}/${action}`);
			setRefresh(!refresh);
		} catch (error) {
			alert(`Failed to ${action} book`);
		}
	};

	// --- POST ACTIONS ---
	const handlePostAction = async (id, action) => {
		try {
			await api.put(`/community/${id}/${action}`);
			setRefresh(!refresh);
		} catch (error) {
			alert(`Failed to ${action} post`);
		}
	};

	// 👇 ADDED: Ability to DELETE a pending post directly if it's spam
	const handleDeletePost = async (id) => {
		if (!window.confirm("Permanently delete this post?")) return;
		try {
			await api.delete(`/community/${id}`);
			setRefresh(!refresh);
		} catch (error) {
			alert("Failed to delete post");
		}
	};

	return (
		<div className="container" style={{ maxWidth: "1200px" }}>
			<div style={{ marginBottom: "2rem" }}>
				<h1>Admin Dashboard 🛡️</h1>
				<p style={{ color: "#64748b" }}>Manage content and approvals</p>
			</div>

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
					gap: "2rem",
				}}
			>
				{/* 1. PENDING BOOKS */}
				<div className="card">
					<h2
						style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}
					>
						Pending Books ({books.length})
					</h2>
					{books.length === 0 && (
						<p style={{ color: "#94a3b8" }}>No pending books.</p>
					)}

					{books.map((book) => (
						<div
							key={book._id}
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								padding: "15px 0",
								borderBottom: "1px solid #f1f5f9",
							}}
						>
							<div>
								<div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
									{book.title}
								</div>
								<div style={{ fontSize: "0.85rem", color: "#64748b" }}>
									by {book.addedBy?.name} • {book.subject}
								</div>
							</div>
							<div style={{ display: "flex", gap: "10px" }}>
								<button
									onClick={() => handleBookAction(book._id, "approve")}
									style={btnGreen}
								>
									Approve
								</button>
								<button
									onClick={() => handleBookAction(book._id, "reject")}
									style={btnRed}
								>
									Reject
								</button>
							</div>
						</div>
					))}
				</div>

				{/* 2. PENDING POSTS */}
				<div className="card">
					<h2
						style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}
					>
						Pending Posts ({posts.length})
					</h2>
					{posts.length === 0 && (
						<p style={{ color: "#94a3b8" }}>No pending posts.</p>
					)}

					{posts.map((post) => (
						<div
							key={post._id}
							style={{ padding: "15px 0", borderBottom: "1px solid #f1f5f9" }}
						>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									marginBottom: "5px",
								}}
							>
								<strong style={{ fontSize: "1.1rem" }}>{post.title}</strong>
								<div style={{ display: "flex", gap: "10px" }}>
									<button
										onClick={() => handlePostAction(post._id, "approve")}
										style={btnGreen}
									>
										Approve
									</button>
									<button
										onClick={() => handlePostAction(post._id, "reject")}
										style={btnRed}
									>
										Reject
									</button>
									<button
										onClick={() => handleDeletePost(post._id)}
										style={{
											...btnRed,
											background: "#fee2e2",
											color: "#ef4444",
										}}
									>
										🗑️
									</button>
								</div>
							</div>
							<p
								style={{
									fontSize: "0.9rem",
									color: "#475569",
									margin: "5px 0",
								}}
							>
								{post.content.substring(0, 100)}...
							</p>
							<div style={{ fontSize: "0.8rem", color: "#64748b" }}>
								User: {post.author?.name}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

// Styles
const btnGreen = {
	background: "#22c55e",
	color: "white",
	border: "none",
	padding: "6px 10px",
	borderRadius: "4px",
	cursor: "pointer",
	fontSize: "0.9rem",
};
const btnRed = {
	background: "#ef4444",
	color: "white",
	border: "none",
	padding: "6px 10px",
	borderRadius: "4px",
	cursor: "pointer",
	fontSize: "0.9rem",
};

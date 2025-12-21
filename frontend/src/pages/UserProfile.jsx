import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function UserProfile() {
	const { user } = useAuth();
	const [myBooks, setMyBooks] = useState([]);
	const [myPosts, setMyPosts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchMyActivity = async () => {
			try {
				// Fetching all books and posts, then filtering for the current user
				// (Ideally, you'd have a /me route on the backend for this)
				const [booksRes, postsRes] = await Promise.all([
					api.get("/books"),
					api.get("/community"),
				]);

				// Filter for books and posts added by this user
				setMyBooks(
					booksRes.data.filter(
						(b) => b.addedBy?._id === user._id || b.addedBy === user._id
					)
				);
				setMyPosts(
					postsRes.data.filter(
						(p) => p.author?._id === user._id || p.author === user._id
					)
				);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching profile activity", error);
				setLoading(false);
			}
		};
		fetchMyActivity();
	}, [user._id]);

	// --- SHARED ACTIONS ---
	const handleDelete = async (id, type) => {
		if (!window.confirm(`Delete this ${type}?`)) return;
		try {
			await api.delete(`/${type === "book" ? "books" : "community"}/${id}`);
			if (type === "book") setMyBooks(myBooks.filter((b) => b._id !== id));
			else setMyPosts(myPosts.filter((p) => p._id !== id));
		} catch (err) {
			alert("Failed to delete");
		}
	};

	const handleEdit = async (item, type) => {
		const newText = prompt(
			`Edit your ${type} ${type === "book" ? "title" : "content"}:`,
			type === "book" ? item.title : item.content
		);
		if (
			!newText ||
			(type === "book" ? newText === item.title : newText === item.content)
		)
			return;

		try {
			const payload =
				type === "book"
					? { title: newText }
					: { title: item.title, content: newText };
			await api.put(
				`/${type === "book" ? "books" : "community"}/${item._id}`,
				payload
			);

			if (type === "book")
				setMyBooks(
					myBooks.map((b) =>
						b._id === item._id ? { ...b, title: newText } : b
					)
				);
			else
				setMyPosts(
					myPosts.map((p) =>
						p._id === item._id ? { ...p, content: newText } : p
					)
				);
		} catch (err) {
			alert("Failed to update");
		}
	};

	return (
		<div className="container" style={{ maxWidth: "800px" }}>
			{/* Profile Header */}
			<div className="card" style={{ textAlign: "center", padding: "2rem" }}>
				<div
					style={{
						width: "80px",
						height: "80px",
						borderRadius: "50%",
						background: "#2563eb",
						color: "white",
						fontSize: "2.5rem",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						margin: "0 auto 1rem auto",
					}}
				>
					{user.name[0]}
				</div>
				<h2 style={{ margin: 0 }}>{user.name}</h2>
				<p style={{ color: "#64748b", margin: "5px 0" }}>
					{user.email} • {user.role.toUpperCase()}
				</p>

				<div
					style={{
						display: "flex",
						justifyContent: "center",
						gap: "2rem",
						marginTop: "1.5rem",
					}}
				>
					<div>
						<div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
							{user.credits}
						</div>
						<div style={{ fontSize: "0.8rem", color: "#64748b" }}>Credits</div>
					</div>
					<div>
						<div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
							{user.stats?.reviewsSubmitted || 0}
						</div>
						<div style={{ fontSize: "0.8rem", color: "#64748b" }}>Reviews</div>
					</div>
				</div>
			</div>

			<h3 style={{ marginTop: "2rem" }}>My Activity</h3>

			{loading ? (
				<p>Loading activity...</p>
			) : (
				<>
					{/* MY BOOKS */}
					<h4 style={{ color: "#475569", marginBottom: "0.5rem" }}>
						Books Uploaded
					</h4>
					{myBooks.length === 0 ? (
						<p style={emptyStyle}>No books uploaded yet.</p>
					) : (
						myBooks.map((book) => (
							<div key={book._id} className="card" style={activityItemStyle}>
								<div>
									<strong>{book.title}</strong>
									<div style={{ fontSize: "0.8rem", color: "#64748b" }}>
										Status: {book.status}
									</div>
								</div>
								<div style={{ display: "flex", gap: "10px" }}>
									<button
										onClick={() => handleEdit(book, "book")}
										style={iconBtn}
									>
										✏️
									</button>
									<button
										onClick={() => handleDelete(book._id, "book")}
										style={iconBtn}
									>
										🗑️
									</button>
								</div>
							</div>
						))
					)}

					{/* MY COMMUNITY POSTS */}
					<h4
						style={{
							color: "#475569",
							marginTop: "2rem",
							marginBottom: "0.5rem",
						}}
					>
						Community Posts
					</h4>
					{myPosts.length === 0 ? (
						<p style={emptyStyle}>No posts shared yet.</p>
					) : (
						myPosts.map((post) => (
							<div key={post._id} className="card" style={activityItemStyle}>
								<div style={{ flex: 1 }}>
									<strong>{post.title}</strong>
									<p
										style={{
											margin: "5px 0",
											fontSize: "0.9rem",
											color: "#475569",
										}}
									>
										{post.content.substring(0, 80)}...
									</p>
								</div>
								<div style={{ display: "flex", gap: "10px" }}>
									<button
										onClick={() => handleEdit(post, "post")}
										style={iconBtn}
									>
										✏️
									</button>
									<button
										onClick={() => handleDelete(post._id, "post")}
										style={iconBtn}
									>
										🗑️
									</button>
								</div>
							</div>
						))
					)}
				</>
			)}
		</div>
	);
}

const emptyStyle = {
	color: "#94a3b8",
	fontStyle: "italic",
	background: "#f8fafc",
	padding: "1rem",
	borderRadius: "8px",
	border: "1px dashed #cbd5e1",
};
const activityItemStyle = {
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	marginBottom: "1rem",
	padding: "1rem",
};
const iconBtn = {
	background: "none",
	border: "none",
	cursor: "pointer",
	fontSize: "1.1rem",
};

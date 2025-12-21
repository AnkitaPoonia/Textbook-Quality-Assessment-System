import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Community() {
	const { user } = useAuth();
	const [posts, setPosts] = useState([]);
	const [showModal, setShowModal] = useState(false);

	// Form State
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [image, setImage] = useState(null);
	const [commentText, setCommentText] = useState({});

	useEffect(() => {
		loadPosts();
	}, []);

	const loadPosts = () => {
		api.get("/community").then((res) => setPosts(res.data));
	};

	const handleCreatePost = async (e) => {
		e.preventDefault();
		const data = new FormData();
		data.append("title", title);
		data.append("content", content);
		if (image) data.append("image", image);

		try {
			await api.post("/community", data);
			alert("Post submitted! Wait for approval.");
			setShowModal(false);
			setTitle("");
			setContent("");
			setImage(null);
			loadPosts();
		} catch (err) {
			alert("Error creating post");
		}
	};

	// 👇 HANDLE DELETE POST
	const handleDeletePost = async (postId) => {
		if (!window.confirm("Delete this post?")) return;
		try {
			await api.delete(`/community/${postId}`);
			setPosts(posts.filter((p) => p._id !== postId));
		} catch (error) {
			alert("Failed to delete post");
		}
	};

	const handleLike = async (postId) => {
		const res = await api.put(`/community/${postId}/like`);
		setPosts(
			posts.map((p) => (p._id === postId ? { ...p, likes: res.data } : p))
		);
	};

	const handleComment = async (postId) => {
		if (!commentText[postId]) return;
		const res = await api.post(`/community/${postId}/comment`, {
			text: commentText[postId],
		});
		setPosts(
			posts.map((p) => (p._id === postId ? { ...p, comments: res.data } : p))
		);
		setCommentText({ ...commentText, [postId]: "" });
	};

	return (
		<div className="container" style={{ maxWidth: "700px" }}>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "2rem",
				}}
			>
				<div>
					<h2 style={{ margin: 0, color: "#1e293b" }}>LPU Community Hub</h2>
					<p style={{ margin: 0, color: "#64748b" }}>Discussions & News</p>
				</div>
				<button
					className="primary"
					style={{ width: "auto" }}
					onClick={() => setShowModal(true)}
				>
					+ Create Post
				</button>
			</div>

			{/* MODAL */}
			{showModal && (
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						background: "rgba(0,0,0,0.5)",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						zIndex: 1000,
					}}
				>
					<div
						className="card"
						style={{ width: "500px", maxHeight: "90vh", overflowY: "auto" }}
					>
						<h3>Create New Post</h3>
						<form onSubmit={handleCreatePost}>
							<label>Title</label>
							<input
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								required
							/>
							<label>Details</label>
							<textarea
								rows="4"
								value={content}
								onChange={(e) => setContent(e.target.value)}
								required
							/>
							<label>Image (Optional)</label>
							<input
								type="file"
								accept="image/*"
								onChange={(e) => setImage(e.target.files[0])}
							/>
							<div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
								<button className="primary">Submit</button>
								<button
									type="button"
									onClick={() => setShowModal(false)}
									style={{
										background: "#94a3b8",
										color: "white",
										border: "none",
										padding: "0.75rem",
										borderRadius: "4px",
										cursor: "pointer",
									}}
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* FEED */}
			{posts.map((post) => (
				<div
					key={post._id}
					className="card"
					style={{ marginBottom: "2rem", padding: "0", overflow: "hidden" }}
				>
					<div
						style={{
							padding: "1rem",
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							background: "#f8fafc",
							borderBottom: "1px solid #e2e8f0",
						}}
					>
						<div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
							<div
								style={{
									width: "40px",
									height: "40px",
									borderRadius: "50%",
									background: "#2563eb",
									color: "white",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									fontWeight: "bold",
								}}
							>
								{post.author?.name[0]}
							</div>
							<div>
								<div style={{ fontWeight: "bold", color: "#334155" }}>
									{post.author?.name}
								</div>
								<div style={{ fontSize: "0.8rem", color: "#64748b" }}>
									{post.author?.role.toUpperCase()}
								</div>
							</div>
						</div>
						{/* DELETE BUTTON */}
						{(user.role === "admin" || user._id === post.author?._id) && (
							<button
								onClick={() => handleDeletePost(post._id)}
								style={{
									background: "transparent",
									border: "none",
									cursor: "pointer",
									fontSize: "1.2rem",
								}}
								title="Delete Post"
							>
								🗑️
							</button>
						)}
					</div>

					<div style={{ padding: "1.5rem" }}>
						<h3 style={{ marginTop: 0 }}>{post.title}</h3>
						<p style={{ lineHeight: "1.6", color: "#475569" }}>
							{post.content}
						</p>
					</div>

					{post.imageUrl && (
						<div
							style={{
								width: "100%",
								maxHeight: "400px",
								overflow: "hidden",
								borderTop: "1px solid #e2e8f0",
								borderBottom: "1px solid #e2e8f0",
							}}
						>
							<img
								src={`http://localhost:8000${post.imageUrl}`}
								style={{ width: "100%", objectFit: "cover" }}
								alt="Post"
							/>
						</div>
					)}

					<div style={{ padding: "1rem", background: "#fff" }}>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: "1.5rem",
								marginBottom: "1rem",
							}}
						>
							<button
								onClick={() => handleLike(post._id)}
								style={{
									background: "none",
									border: "none",
									cursor: "pointer",
									fontSize: "1rem",
									color: post.likes.includes(user._id) ? "#ef4444" : "#64748b",
								}}
							>
								{post.likes.includes(user._id) ? "❤️" : "🤍"}{" "}
								{post.likes.length} Likes
							</button>
							<span style={{ color: "#64748b" }}>
								💬 {post.comments.length} Comments
							</span>
						</div>

						{/* Comments */}
						<div
							style={{
								background: "#f8fafc",
								padding: "1rem",
								borderRadius: "8px",
							}}
						>
							{post.comments.map((c, i) => (
								<div
									key={i}
									style={{ marginBottom: "0.5rem", fontSize: "0.9rem" }}
								>
									<strong>{c.user?.name}: </strong> {c.text}
								</div>
							))}
							<div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
								<input
									placeholder="Write a comment..."
									value={commentText[post._id] || ""}
									onChange={(e) =>
										setCommentText({
											...commentText,
											[post._id]: e.target.value,
										})
									}
									style={{ marginBottom: 0, borderRadius: "20px" }}
								/>
								<button
									onClick={() => handleComment(post._id)}
									style={{
										width: "auto",
										padding: "0 1.5rem",
										borderRadius: "20px",
										background: "#2563eb",
										color: "white",
										border: "none",
										cursor: "pointer",
									}}
								>
									Send
								</button>
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

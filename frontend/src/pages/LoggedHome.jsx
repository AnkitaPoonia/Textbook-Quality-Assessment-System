import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Feed() {
	const { user } = useAuth();
	const [posts, setPosts] = useState([]);
	const [commentText, setCommentText] = useState({});
	const [editingPostId, setEditingPostId] = useState(null);
	const [editPostData, setEditPostData] = useState({ title: "", content: "" });

	useEffect(() => {
		loadPosts();
	}, []);

	const loadPosts = () => {
		api.get("/community").then((res) => setPosts(res.data));
	};

	// --- POST ACTIONS ---
	const handleDeletePost = async (postId) => {
		if (!window.confirm("Are you sure you want to delete this post?")) return;
		try {
			await api.delete(`/community/${postId}`);
			setPosts(posts.filter((p) => p._id !== postId));
		} catch (error) {
			alert("Failed to delete post");
		}
	};

	const startEditing = (post) => {
		setEditingPostId(post._id);
		setEditPostData({ title: post.title, content: post.content });
	};

	const handleUpdatePost = async (postId) => {
		try {
			await api.put(`/community/${postId}`, editPostData);
			setPosts(
				posts.map((p) => (p._id === postId ? { ...p, ...editPostData } : p))
			);
			setEditingPostId(null);
		} catch (err) {
			alert("Update failed");
		}
	};

	const handleLike = async (postId) => {
		try {
			const res = await api.put(`/community/${postId}/like`);
			setPosts(
				posts.map((p) => (p._id === postId ? { ...p, likes: res.data } : p))
			);
		} catch (error) {
			console.error("Error liking post", error);
		}
	};

	// --- COMMENT ACTIONS ---
	const handleComment = async (postId) => {
		if (!commentText[postId] || commentText[postId].trim() === "") return;
		try {
			const res = await api.post(`/community/${postId}/comment`, {
				text: commentText[postId],
			});
			setPosts(
				posts.map((p) => (p._id === postId ? { ...p, comments: res.data } : p))
			);
			setCommentText({ ...commentText, [postId]: "" });
		} catch (error) {
			console.error("Error adding comment", error);
		}
	};

	const handleEditComment = async (postId, comment) => {
		const newText = prompt("Edit your comment:", comment.text);
		if (newText === null || newText === comment.text) return;
		try {
			const res = await api.put(`/community/${postId}/comment/${comment._id}`, {
				text: newText,
			});
			setPosts(
				posts.map((p) => (p._id === postId ? { ...p, comments: res.data } : p))
			);
		} catch (error) {
			alert("Failed to edit comment");
		}
	};

	return (
		<div style={{ maxWidth: "650px", margin: "0 auto", padding: "2rem 1rem" }}>
			<h2
				style={{
					marginBottom: "2rem",
					borderBottom: "3px solid #2563eb",
					paddingBottom: "0.5rem",
					display: "inline-block",
					color: "#1e293b",
				}}
			>
				Community Feed
			</h2>

			{posts.length === 0 && (
				<p style={{ color: "#64748b" }}>No discussions yet.</p>
			)}

			{posts.map((post) => (
				<div
					key={post._id}
					className="card"
					style={{
						marginBottom: "2.5rem",
						padding: "1.5rem",
						borderRadius: "12px",
						boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
					}}
				>
					{editingPostId === post._id ? (
						/* --- EDIT POST FORM --- */
						<div
							style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
						>
							<h3 style={{ margin: 0 }}>Edit Post</h3>
							<input
								value={editPostData.title}
								onChange={(e) =>
									setEditPostData({ ...editPostData, title: e.target.value })
								}
								style={inputStyle}
							/>
							<textarea
								value={editPostData.content}
								onChange={(e) =>
									setEditPostData({ ...editPostData, content: e.target.value })
								}
								rows="4"
								style={inputStyle}
							/>
							<div style={{ display: "flex", gap: "10px" }}>
								<button
									className="primary"
									onClick={() => handleUpdatePost(post._id)}
								>
									Update
								</button>
								<button
									onClick={() => setEditingPostId(null)}
									style={{
										background: "#94a3b8",
										color: "white",
										border: "none",
										padding: "8px 16px",
										borderRadius: "6px",
									}}
								>
									Cancel
								</button>
							</div>
						</div>
					) : (
						/* --- VIEW POST MODE --- */
						<>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									marginBottom: "1.2rem",
								}}
							>
								<div
									style={{ display: "flex", alignItems: "center", gap: "12px" }}
								>
									<div style={avatarStyle}>{post.author?.name?.[0]}</div>
									<div>
										<div style={{ fontWeight: "bold", color: "#1e293b" }}>
											{post.author?.name}
										</div>
										<div style={{ fontSize: "0.8rem", color: "#64748b" }}>
											{new Date(post.createdAt).toLocaleDateString()}
										</div>
									</div>
								</div>
								<div style={{ display: "flex", gap: "8px" }}>
									{user._id === post.author?._id && (
										<button
											onClick={() => startEditing(post)}
											style={iconBtnStyle}
											title="Edit Post"
										>
											✏️
										</button>
									)}
									{(user.role === "admin" || user._id === post.author?._id) && (
										<button
											onClick={() => handleDeletePost(post._id)}
											style={iconBtnStyle}
											title="Delete Post"
										>
											🗑️
										</button>
									)}
								</div>
							</div>

							<h3
								style={{
									margin: "0 0 0.75rem 0",
									color: "#1e293b",
									fontSize: "1.25rem",
								}}
							>
								{post.title}
							</h3>
							<p
								style={{
									color: "#334155",
									lineHeight: "1.6",
									marginBottom: "1rem",
								}}
							>
								{post.content}
							</p>

							{post.imageUrl && (
								<img
									src={`http://localhost:8000${post.imageUrl}`}
									alt="Post"
									style={{
										width: "100%",
										borderRadius: "8px",
										marginBottom: "1.2rem",
									}}
								/>
							)}

							<div
								style={{
									display: "flex",
									gap: "1.5rem",
									paddingBottom: "1rem",
									borderBottom: "1px solid #f1f5f9",
								}}
							>
								<button
									onClick={() => handleLike(post._id)}
									style={{
										...actionBtnStyle,
										color: post.likes.includes(user._id)
											? "#ef4444"
											: "#64748b",
									}}
								>
									{post.likes.includes(user._id) ? "❤️" : "🤍"}{" "}
									{post.likes.length} Likes
								</button>
								<span style={{ ...actionBtnStyle, cursor: "default" }}>
									💬 {post.comments.length} Comments
								</span>
							</div>

							{/* --- MODERN COMMENT SECTION --- */}
							<div style={{ marginTop: "1.2rem" }}>
								{post.comments.map((c, i) => (
									<div key={i} style={commentBubbleStyle}>
										<div
											style={{
												display: "flex",
												justifyContent: "space-between",
												alignItems: "start",
											}}
										>
											<div
												style={{
													fontSize: "0.85rem",
													fontWeight: "700",
													color: "#2563eb",
													marginBottom: "2px",
												}}
											>
												{c.user?.name}
											</div>
											{user._id === c.user?._id && (
												<button
													onClick={() => handleEditComment(post._id, c)}
													style={{
														border: "none",
														background: "transparent",
														cursor: "pointer",
														fontSize: "0.8rem",
														opacity: 0.6,
													}}
												>
													✏️
												</button>
											)}
										</div>
										<div
											style={{
												fontSize: "0.95rem",
												color: "#334155",
												lineHeight: "1.4",
											}}
										>
											{c.text}
										</div>
									</div>
								))}

								<div
									style={{ display: "flex", gap: "10px", marginTop: "1rem" }}
								>
									<input
										placeholder="Write a comment..."
										value={commentText[post._id] || ""}
										onChange={(e) =>
											setCommentText({
												...commentText,
												[post._id]: e.target.value,
											})
										}
										style={commentInputStyle}
									/>
									<button
										onClick={() => handleComment(post._id)}
										style={sendBtnStyle}
									>
										Send
									</button>
								</div>
							</div>
						</>
					)}
				</div>
			))}
		</div>
	);
}

// --- STYLES ---
const avatarStyle = {
	width: "42px",
	height: "42px",
	borderRadius: "50%",
	background: "#2563eb",
	color: "white",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	fontWeight: "bold",
	fontSize: "1.1rem",
};
const iconBtnStyle = {
	background: "none",
	border: "none",
	cursor: "pointer",
	fontSize: "1.1rem",
};
const actionBtnStyle = {
	background: "none",
	border: "none",
	cursor: "pointer",
	fontSize: "0.95rem",
	fontWeight: "600",
	display: "flex",
	alignItems: "center",
	gap: "6px",
};
const commentBubbleStyle = {
	background: "#f1f5f9",
	padding: "10px 14px",
	borderRadius: "14px",
	marginBottom: "8px",
	maxWidth: "90%",
	border: "1px solid #e2e8f0",
};
const commentInputStyle = {
	flexGrow: 1,
	padding: "10px 16px",
	borderRadius: "24px",
	border: "1px solid #cbd5e1",
	outline: "none",
	fontSize: "0.95rem",
};
const sendBtnStyle = {
	background: "#2563eb",
	color: "white",
	border: "none",
	padding: "0 20px",
	borderRadius: "24px",
	cursor: "pointer",
	fontWeight: "bold",
};
const inputStyle = {
	padding: "10px",
	borderRadius: "6px",
	border: "1px solid #cbd5e1",
	width: "100%",
	fontSize: "1rem",
};

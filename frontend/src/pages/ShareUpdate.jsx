import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function ShareUpdate() {
	const { user } = useAuth();
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [image, setImage] = useState(null);
	const [myPosts, setMyPosts] = useState([]);

	useEffect(() => {
		loadMyPosts();
	}, []);

	const loadMyPosts = async () => {
		// We filter posts on frontend for now, or you can add a backend route /community/me
		const res = await api.get("/community");
		// Filter: Only show posts where author._id matches logged in user
		const mine = res.data.filter(
			(p) => p.author?._id === user._id || p.author === user._id
		);
		setMyPosts(mine);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const data = new FormData();
		data.append("title", title);
		data.append("content", content);
		if (image) data.append("image", image);

		try {
			await api.post("/community", data);
			alert("Post submitted for approval!");
			setTitle("");
			setContent("");
			setImage(null);
			loadMyPosts(); // Refresh list
		} catch (err) {
			alert("Error posting.");
		}
	};

	return (
		<div className="container" style={{ maxWidth: "600px" }}>
			<h1>Share with Community</h1>

			{/* CREATE POST FORM */}
			<div className="card" style={{ marginBottom: "2rem" }}>
				<form onSubmit={handleSubmit}>
					<label>Title</label>
					<input
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
						placeholder="Discussion topic..."
					/>

					<label>Content</label>
					<textarea
						value={content}
						onChange={(e) => setContent(e.target.value)}
						rows="4"
						required
						placeholder="Write your thoughts..."
					/>

					<label>Image (Optional)</label>
					<input
						type="file"
						onChange={(e) => setImage(e.target.files[0])}
						accept="image/*"
					/>

					<button className="primary" style={{ marginTop: "1rem" }}>
						Submit Post
					</button>
				</form>
			</div>

			{/* MY POSTS LIST */}
			<h3>My History</h3>
			{myPosts.length === 0 && (
				<p style={{ color: "#64748b" }}>You haven't posted anything yet.</p>
			)}

			{myPosts.map((post) => (
				<div
					key={post._id}
					className="card"
					style={{
						marginBottom: "1rem",
						borderLeft:
							post.status === "approved"
								? "4px solid #22c55e"
								: "4px solid #eab308",
					}}
				>
					<div style={{ display: "flex", justifyContent: "space-between" }}>
						<strong>{post.title}</strong>
						<span
							style={{
								fontSize: "0.8rem",
								padding: "2px 6px",
								borderRadius: "4px",
								background: post.status === "approved" ? "#dcfce7" : "#fef9c3",
								color: post.status === "approved" ? "#166534" : "#854d0e",
							}}
						>
							{post.status.toUpperCase()}
						</span>
					</div>
					<p style={{ fontSize: "0.9rem", color: "#475569" }}>{post.content}</p>
				</div>
			))}
		</div>
	);
}

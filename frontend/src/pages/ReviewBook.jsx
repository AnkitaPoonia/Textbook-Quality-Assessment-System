import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

// --- STAR INPUT COMPONENT ---
const StarInput = ({ value, onChange }) => {
	const [hover, setHover] = useState(0);

	return (
		<div style={{ display: "flex", gap: "5px" }}>
			{[1, 2, 3, 4, 5].map((star) => (
				<button
					key={star}
					type="button"
					onClick={() => onChange(star)}
					onMouseEnter={() => setHover(star)}
					onMouseLeave={() => setHover(0)}
					style={{
						background: "none",
						border: "none",
						cursor: "pointer",
						fontSize: "2rem",
						color: star <= (hover || value) ? "#fbbf24" : "#cbd5e1", // Gold if selected/hovered, else Gray
						transition: "color 0.2s",
						padding: 0,
					}}
				>
					
				</button>
			))}
			<span
				style={{
					marginLeft: "10px",
					fontSize: "1.2rem",
					color: "#64748b",
					display: "flex",
					alignItems: "center",
				}}
			>
				{value}/5
			</span>
		</div>
	);
};

export default function ReviewBook() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { user } = useAuth();

	const [criteriaList, setCriteriaList] = useState([]);
	const [scores, setScores] = useState({});
	const [comment, setComment] = useState("");
	const [bookTitle, setBookTitle] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// 1. Get Book Name
		api.get(`/books/${id}`).then((res) => {
			setBookTitle(res.data.book.title);
		});

		// 2. Get Criteria based on User Role (Student/Teacher)
		api
			.get(`/criteria/${user.role}`)
			.then((res) => {
				setCriteriaList(res.data);
				// Initialize all scores to 0
				const initialScores = {};
				res.data.forEach((c) => {
					initialScores[c._id] = 0;
				});
				setScores(initialScores);
				setLoading(false);
			})
			.catch((err) => {
				console.error(err);
				setLoading(false);
			});
	}, [id, user.role]);

	const handleScoreChange = (criteriaId, value) => {
		setScores((prev) => ({
			...prev,
			[criteriaId]: value,
		}));
	};

	const submit = async (e) => {
		e.preventDefault();

		// Validation: Ensure all stars are clicked
		const incomplete = Object.values(scores).some((val) => val === 0);
		if (incomplete) {
			alert("Please rate all criteria before submitting.");
			return;
		}

		const scoresPayload = Object.keys(scores).map((key) => ({
			criteriaId: key,
			value: scores[key],
		}));

		try {
			await api.post("/reviews", {
				bookId: id,
				scores: scoresPayload,
				comment, // This is the private feedback
			});
			alert("Review submitted! The Quality Score has been updated.");
			navigate(`/books/${id}`); // Send them back to the book detail page
		} catch (error) {
			console.error(error);
			alert(
				error.response?.data?.message ||
					"Error submitting review. You may have already reviewed this book."
			);
			navigate(`/books/${id}`); 
		}
	};

	if (loading) return <div className="container">Loading criteria...</div>;

	if (criteriaList.length === 0) {
		return (
			<div className="container">
				<p>
					No assessment criteria found for your role ({user.role}). Please
					contact Admin.
				</p>
			</div>
		);
	}

	return (
		<div className="container" style={{ maxWidth: "700px" }}>
			<div className="card">
				<h2 style={{ marginBottom: "0.5rem", color: "#1e293b" }}>
					Evaluate Resource
				</h2>
				<p style={{ color: "#64748b", marginBottom: "2rem" }}>
					You are reviewing:{" "}
					<strong style={{ color: "#2563eb" }}>{bookTitle}</strong>
				</p>

				<form onSubmit={submit}>
					{/* CRITERIA LIST */}
					{criteriaList.map((c) => (
						<div
							key={c._id}
							style={{
								background: "#f8fafc",
								padding: "1.5rem",
								borderRadius: "8px",
								border: "1px solid #e2e8f0",
								marginBottom: "1.5rem",
							}}
						>
							<label
								style={{
									fontSize: "1.1rem",
									fontWeight: "600",
									display: "block",
									marginBottom: "0.5rem",
								}}
							>
								{c.name}
							</label>
							<div
								style={{
									fontSize: "0.9rem",
									color: "#64748b",
									marginBottom: "1rem",
								}}
							>
								Rate based on {c.name.toLowerCase()} standards.
							</div>
							<StarInput
								value={scores[c._id] || 0}
								onChange={(val) => handleScoreChange(c._id, val)}
							/>
						</div>
					))}

					{/* PRIVATE FEEDBACK SECTION */}
					<div
						style={{
							marginTop: "2rem",
							borderTop: "2px solid #f1f5f9",
							paddingTop: "2rem",
						}}
					>
						<label
							style={{
								fontWeight: "bold",
								display: "block",
								marginBottom: "0.5rem",
								color: "#1e293b",
							}}
						>
							🔒 Private Feedback for Publisher/Admin
						</label>
						<p
							style={{
								fontSize: "0.85rem",
								color: "#64748b",
								marginBottom: "1rem",
								background: "#fef3c7",
								padding: "10px",
								borderRadius: "6px",
								display: "inline-block",
							}}
						>
							This comment will <strong>NOT</strong> be public. Only the Admin
							and the Book Uploader will see it.
						</p>
						<textarea
							rows="5"
							placeholder="Suggest improvements, report errors, or give specific praise..."
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							style={{
								width: "100%",
								padding: "12px",
								marginTop: "5px",
								border: "1px solid #cbd5e1",
								borderRadius: "6px",
								fontSize: "1rem",
								fontFamily: "inherit",
							}}
						></textarea>
					</div>

					<button
						className="primary"
						style={{
							marginTop: "2rem",
							width: "100%",
							padding: "1rem",
							fontSize: "1.1rem",
						}}
					>
						Submit Assessment
					</button>
				</form>
			</div>
		</div>
	);
}

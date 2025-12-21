import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function AddBook() {
	const navigate = useNavigate();

	const [pdfFile, setPdfFile] = useState(null);
	const [coverFile, setCoverFile] = useState(null);

	const [formData, setFormData] = useState({
		title: "",
		author: "",
		subject: "",
		edition: "",
		semester: "",
		level: "UG",
		format: "textbook",
	});

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handlePdfChange = (e) => {
		setPdfFile(e.target.files[0]);
	};

	const handleCoverChange = (e) => {
		setCoverFile(e.target.files[0]);
	};

	const submit = async (e) => {
		e.preventDefault();

		const data = new FormData();

		// 👇 keep PDF logic (unchanged)
		if (pdfFile) {
			data.append("pdf", pdfFile);
		}

		// 👇 add cover logic (NEW, optional)
		if (coverFile) {
			data.append("cover", coverFile);
		}

		// 👇 append all text fields
		Object.keys(formData).forEach((key) => {
			data.append(key, formData[key]);
		});

		try {
			await api.post("/books", data, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			alert("Book uploaded successfully!");
			navigate("/");
		} catch (error) {
			console.error(error);
			alert("Error uploading book.");
		}
	};

	return (
		<div className="container">
			<div className="card">
				<h2>Add Academic Resource</h2>

				<form onSubmit={submit}>
					<label>Book Title</label>
					<input name="title" required onChange={handleChange} />

					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							gap: "1rem",
						}}
					>
						<div>
							<label>Author</label>
							<input name="author" required onChange={handleChange} />
						</div>

						<div>
							<label>Subject</label>
							<input name="subject" required onChange={handleChange} />
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
							<select name="level" onChange={handleChange}>
								<option value="UG">UG</option>
								<option value="PG">PG</option>
							</select>
						</div>

						<div>
							<label>Format</label>
							<select name="format" onChange={handleChange}>
								<option value="textbook">Textbook</option>
								<option value="reference">Reference</option>
								<option value="ebook">E-Book</option>
							</select>
						</div>
					</div>

					<label>Upload PDF (Optional)</label>
					<input
						type="file"
						accept="application/pdf"
						onChange={handlePdfChange}
					/>

					<label>Upload Cover Image (Optional)</label>
					<input type="file" accept="image/*" onChange={handleCoverChange} />

					<button className="primary" style={{ marginTop: "1rem" }}>
						Submit Book
					</button>
				</form>
			</div>
		</div>
	);
}

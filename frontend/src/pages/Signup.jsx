import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
	const { signup } = useAuth();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		role: "student",
		regNumber: "",
	});

	const handleChange = (e) =>
		setFormData({ ...formData, [e.target.name]: e.target.value });

	const submit = async (e) => {
		e.preventDefault();
		try {
			await signup(formData);
		} catch (error) {
			alert("Signup failed. Check email or try again.");
		}
	};

	return (
		<div className="container" style={{ maxWidth: "400px", marginTop: "5vh" }}>
			<div className="card">
				<h2 style={{ textAlign: "center", color: "#2563eb" }}>
					Join the Network
				</h2>
				<form onSubmit={submit}>
					<label>Full Name</label>
					<input
						name="name"
						required
						onChange={handleChange}
						placeholder="John Doe"
					/>

					<label>Registration Number (LPU)</label>
					<input
						name="regNumber"
						required
						onChange={handleChange}
						placeholder="e.g., 12204456"
					/>

					<label>Email (@lpu.in)</label>
					<input
						name="email"
						type="email"
						required
						onChange={handleChange}
						placeholder="john@lpu.in"
					/>

					<label>Password</label>
					<input
						name="password"
						type="password"
						required
						onChange={handleChange}
					/>

					<label>I am a:</label>
					<select name="role" onChange={handleChange} value={formData.role}>
						<option value="student">Student</option>
						<option value="teacher">Faculty / Teacher</option>
					</select>

					<button className="primary" style={{ marginTop: "1rem" }}>
						Create Account
					</button>
				</form>
			</div>
		</div>
	);
}

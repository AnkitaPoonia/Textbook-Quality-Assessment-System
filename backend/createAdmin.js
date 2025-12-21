import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./models/user.js";

dotenv.config();

mongoose
	.connect(process.env.MONGO_URI)
	.then(async () => {
		console.log("Connected to MongoDB...");

		// 1. Check if admin already exists
		const existingAdmin = await User.findOne({ email: "admin@lpu.in" });
		if (existingAdmin) {
			console.log("Admin already exists!");
			process.exit();
		}

		// 2. Create the Admin User manually
		const hashedPassword = await bcrypt.hash("admin123", 10); // Set your secure password here

		await User.create({
			name: "Super Admin",
			email: "admin@lpu.in",
			password: hashedPassword,
			role: "admin", // This is where we force the role
			isVerified: true,
		});

		console.log("✅ Admin User Created Successfully!");
		console.log("Email: admin@lpu.in");
		console.log("Password: admin123");

		process.exit();
	})
	.catch((err) => {
		console.error(err);
		process.exit();
	});

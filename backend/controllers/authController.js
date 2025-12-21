import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// --- CONFIG: Define Cookie Options in one place ---
// This ensures Login and Logout use the EXACT same settings.
const cookieOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV !== "development", // False on localhost, True on production
	sameSite: "strict",
	path: "/", // 👈 CRITICAL: Forces cookie to apply to the whole site
};

// --- HELPER: Generate JWT Token ---
const generateToken = (res, user) => {
	const token = jwt.sign(
		{ id: user._id, role: user.role },
		process.env.JWT_SECRET,
		{
			expiresIn: "30d",
		}
	);

	res.cookie("jwt", token, {
		...cookieOptions,
		maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
	});
};

// --- SIGNUP ---
export const signup = async (req, res) => {
	try {
		const { name, email, password, role, regNumber } = req.body;

		if (!email.endsWith("@lpu.in")) {
			return res
				.status(400)
				.json({ message: "Only @lpu.in emails are allowed." });
		}

		const userExists = await User.findOne({ email });
		if (userExists) {
			return res.status(400).json({ message: "User already exists" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = await User.create({
			name,
			email,
			password: hashedPassword,
			role: role || "student",
			regNumber: regNumber || "N/A",
		});

		if (user) {
			generateToken(res, user);
			res.status(201).json({
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			});
		} else {
			res.status(400).json({ message: "Invalid user data" });
		}
	} catch (error) {
		console.error("Signup Error:", error);
		res.status(500).json({ message: "Server error during signup" });
	}
};

// --- LOGIN ---
export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (user && (await bcrypt.compare(password, user.password))) {
			generateToken(res, user);
			res.json({
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				credits: user.credits,
				stats: user.stats,
			});
		} else {
			res.status(401).json({ message: "Invalid email or password" });
		}
	} catch (error) {
		console.error("Login Error:", error);
		res.status(500).json({ message: "Server error during login" });
	}
};

// --- LOGOUT (FIXED) ---
export const logout = (req, res) => {
	// We send the same options, but with an empty value and instant expiry
	res.cookie("jwt", "", {
		...cookieOptions, // 👈 Uses the exact same Secure/SameSite/Path settings
		expires: new Date(0), // Sets expiry to 1970 (instant delete)
	});
	res.status(200).json({ message: "Logged out successfully" });
};

// --- GET CURRENT USER (Me) ---
export const me = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select("-password");
		if (user) {
			res.json(user);
		} else {
			res.status(404).json({ message: "User not found" });
		}
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};

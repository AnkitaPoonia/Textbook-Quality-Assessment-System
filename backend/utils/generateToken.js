import jwt from "jsonwebtoken";

export const generateToken = (res, payload) => {
	const token = jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});

	res.cookie("token", token, {
		httpOnly: true,
		sameSite: "lax",
		secure: false, // true only in HTTPS
	});
};

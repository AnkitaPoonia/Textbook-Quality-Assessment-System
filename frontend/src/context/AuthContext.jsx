import { createContext, useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	// 1. Check if user is logged in on page load
	useEffect(() => {
		checkUserLoggedIn();
	}, []);

	const checkUserLoggedIn = async () => {
		try {
			const { data } = await api.get("/auth/me");
			setUser(data);
		} catch (error) {
			// 🛑 CRITICAL FIX: If /me fails (401), ensure User is NULL
			console.log("Not logged in or Session expired");
			setUser(null);
		} finally {
			setLoading(false);
		}
	};

	// 2. Login Function
	const login = async (formData) => {
		const { data } = await api.post("/auth/login", formData);
		setUser(data);
		navigate("/");
	};

	// 3. Signup Function
	const signup = async (formData) => {
		const { data } = await api.post("/auth/signup", formData);
		setUser(data);
		navigate("/");
	};

	// 4. Logout Function (Fixes "Zombie Navbar")
	const logout = async () => {
		try {
			await api.post("/auth/logout"); // Tell server to delete cookie
			setUser(null); // Clear frontend state immediately
			navigate("/login");
		} catch (error) {
			console.error("Logout failed", error);
			// Even if server fails, clear frontend state
			setUser(null);
			navigate("/login");
		}
	};

	return (
		<AuthContext.Provider value={{ user, login, signup, logout, loading }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);

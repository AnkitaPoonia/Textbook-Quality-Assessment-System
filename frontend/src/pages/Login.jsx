import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { FaUserGraduate, FaEnvelope, FaLock, FaMoon, FaSun } from "react-icons/fa";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [theme, setTheme] = useState("dark");

  const submit = async (e) => {
    e.preventDefault();
    await login({ email, password });
  };

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const themes = {
    dark: {
      pageBg: "linear-gradient(135deg, #0f172a, #1e293b)",
      cardBg: "rgba(30,41,59,0.85)",
      iconColor: "#22c55e",
      textColor: "#e5e7eb",
      btnGradient: "linear-gradient(135deg, #1e40af, #3b82f6)",
      floatColors: ["#22c55e", "#3b82f6", "#8b5cf6", "#14b8a6"],
      toggleBg: "rgba(255,255,255,0.15)",
      toggleIcon: "#fff",
    },
    light: {
      pageBg: "linear-gradient(135deg, #f0f4f8, #d9e2ec)",
      cardBg: "rgba(255,255,255,0.85)",
      iconColor: "#1e40af",
      textColor: "#1e293b",
      btnGradient: "linear-gradient(135deg, #3b82f6, #6366f1)",
      floatColors: ["#3b82f6", "#6366f1", "#8b5cf6", "#14b8a6"],
      toggleBg: "rgba(255,255,255,0.95)", // lighter and classy
      toggleIcon: "#1e293b",
    },
  };

  const current = themes[theme];

  return (
    <div
      style={{
        background: current.pageBg,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Floating emojis */}
      <div>
        {["📘","🧠","✨","🎓","📚","☁️"].map((emoji, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              fontSize: "48px",
              left: `${10 + i*15}%`,
              bottom: "-10%",
              animation: `floatUp ${18 + i*2}s infinite ease-in-out`,
              color: current.floatColors[i % current.floatColors.length],
              opacity: 0.85,
            }}
          >
            {emoji}
          </span>
        ))}
      </div>

      {/* Floating round glowing bubbles */}
      <div>
        {[...Array(20)].map((_, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              width: `${30 + Math.random() * 30}px`,
              height: `${30 + Math.random() * 30}px`,
              background: "rgba(255,255,255,0.25)",
              borderRadius: "50%", // perfect circle
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `bubbleFloat ${10 + Math.random() * 15}s ease-in-out infinite`,
              opacity: Math.random() * 0.5 + 0.4,
              boxShadow: "0 0 20px rgba(255,255,255,0.6)", // glowing effect
            }}
          ></span>
        ))}
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          background: current.toggleBg,
          border: "none",
          borderRadius: "50%",
          padding: "10px",
          fontSize: "22px",
          cursor: "pointer",
          zIndex: 2,
          color: current.toggleIcon,
          backdropFilter: "blur(10px)",
        }}
      >
        {theme === "dark" ? <FaMoon /> : <FaSun />}
      </button>

      {/* Login Card */}
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 70 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{
          background: current.cardBg,
          color: current.textColor,
          padding: "50px 44px",
          borderRadius: "26px",
          backdropFilter: "blur(20px)",
          boxShadow: "0 60px 120px rgba(0,0,0,0.4)",
          textAlign: "center",
          width: "420px",
          zIndex: 1,
        }}
      >
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ color: current.iconColor, fontSize: "56px", marginBottom: "10px" }}
        >
          <FaUserGraduate />
        </motion.div>

        <h1 style={{ fontSize: "28px", fontWeight: 600 }}>Welcome Learner</h1>
        <p style={{ fontSize: "14px", marginBottom: "28px", opacity: 0.9 }}>
          Your journey begins here 📚
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px", marginBottom: "18px", borderRadius: "14px", background: "rgba(255,255,255,0.18)" }}>
          <FaEnvelope style={{ color: current.iconColor }} />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: "14px", color: current.textColor }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px", marginBottom: "18px", borderRadius: "14px", background: "rgba(255,255,255,0.18)" }}>
          <FaLock style={{ color: current.iconColor }} />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: "14px", color: current.textColor }}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: "100%",
            padding: "14px",
            marginTop: "10px",
            borderRadius: "18px",
            border: "none",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            background: current.btnGradient,
          }}
        >
          Start Learning 🚀
        </motion.button>

        <p style={{ marginTop: "22px", fontSize: "12px", opacity: 0.85 }}>
          Learning begins with curiosity
        </p>
      </motion.form>

      <style>{`
        @keyframes floatUp {
          0%{transform:translateY(0) rotate(0deg);opacity:0;}
          20%{opacity:1;}
          100%{transform:translateY(-120vh) rotate(360deg);opacity:0;}
        }

        @keyframes bubbleFloat {
          0% { transform: translateY(100vh) scale(0.5); opacity: 0; }
          25% { opacity: 0.5; }
          50% { transform: translateY(50vh) scale(0.7); opacity: 0.7; }
          75% { opacity: 0.5; }
          100% { transform: translateY(-10vh) scale(1); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
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
    <div className="signup-page">
      
      {/* 🌈 ARTISTIC BACKGROUND */}
      <div className="art-bg">
        <span className="float emoji1">🚀</span>
        <span className="float emoji2">💡</span>
        <span className="float emoji3">⚛️</span>
        <span className="float emoji4">🧬</span>
        <span className="float emoji5">📝</span>
        <span className="float emoji6">🪐</span>
      </div>

      {/* 🎓 COMPACT SIGNUP CARD */}
      <div className="glass-card">
        
        <div className="header-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
            <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>

        <h2 className="title">Join the Network</h2>
        <p className="subtitle">Create your academic identity</p>

        <form onSubmit={submit}>
          
          <div className="input-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <input
              name="name"
              required
              onChange={handleChange}
              placeholder="Full Name"
            />
          </div>

          <div className="input-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="8" x2="7" y2="8"/><line x1="7" y1="12" x2="7" y2="12"/><line x1="7" y1="16" x2="7" y2="16"/></svg>
            <input
              name="regNumber"
              required
              onChange={handleChange}
              placeholder="Reg. Number"
            />
          </div>

          <div className="input-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <input
              name="email"
              type="email"
              required
              onChange={handleChange}
              placeholder="Email (@lpu.in)"
            />
          </div>

          <div className="input-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input
              name="password"
              type="password"
              required
              onChange={handleChange}
              placeholder="Password"
            />
          </div>

          <div className="input-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <select name="role" onChange={handleChange} value={formData.role}>
              <option value="student">Student</option>
              <option value="teacher">Faculty / Teacher</option>
            </select>
          </div>

          <button className="action-btn">
            Create Account
          </button>
        </form>
      </div>

      {/* 🎨 STYLES */}
      <style>{`
        .signup-page {
          height: 100vh; /* Fixed height to force no scroll */
          width: 100vw;
          position: relative;
          overflow: hidden; /* Hide scrollbars */
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: "Poppins", sans-serif;
          background: linear-gradient(135deg, #021034ff, #2a064bff); 
        }

        /* ARTISTIC BACKGROUND */
        .art-bg { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
        
        .float {
          position: absolute;
          font-size: 30px;
          opacity: 0.5;
          animation: floatUp 15s infinite linear;
        }

        .emoji1 { left: 10%; bottom: -10%; animation-delay: 0s; }
        .emoji2 { left: 30%; bottom: -15%; animation-delay: 4s; }
        .emoji3 { left: 50%; bottom: -12%; animation-delay: 8s; }
        .emoji4 { left: 70%; bottom: -18%; animation-delay: 2s; }
        .emoji5 { left: 85%; bottom: -14%; animation-delay: 6s; }
        .emoji6 { left: 20%; bottom: -20%; animation-delay: 10s; }

        @keyframes floatUp {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          20% { opacity: 0.8; }
          100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
        }

        /* CARD STYLE - Compact Mode */
        .glass-card {
          position: relative;
          z-index: 1;
          width: 90%;
          max-width: 380px; /* Slightly narrower */
          padding: 30px 25px; /* Reduced padding significantly */
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: white;
          text-align: center;
          animation: slideUp 0.6s ease-out;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .header-icon {
          color: #facc15;
          margin-bottom: 5px; /* Reduced gap */
          animation: bounce 3s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        .title { 
          font-size: 24px; /* Slightly smaller for fit */
          margin: 0; 
          font-weight: 700; 
          letter-spacing: -0.5px; 
          color: #ffffff; 
        
        }
        
        .subtitle { 
          font-size: 13px; 
          opacity: 0.8; 
          margin-bottom: 20px; /* Reduced gap */
          margin-top: 2px; 
        }

        /* INPUTS - Compact but Bold */
        .input-box {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.95); 
          border-radius: 10px; /* Tighter radius */
          padding: 10px 14px; /* Reduced padding */
          margin-bottom: 10px; /* Reduced margin */
          border: 1px solid rgba(255, 255, 255, 0.5);
          transition: 0.3s;
        }

        .input-box:focus-within {
          background: #ffffff;
          border-color: #facc15;
          transform: scale(1.01);
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .input-box svg { color: #d97706; margin-right: 10px; flex-shrink: 0; }

        .input-box input, .input-box select {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: #1f2937; 
          font-size: 15px; /* Still legible */
          font-weight: 600; /* Bold as requested */
          font-family: inherit;
        }
        
        .input-box input::placeholder { 
          color: #9ca3af; 
          font-weight: 400; 
          font-size: 14px;
        }

        option { background: white; color: #333; }

        /* BUTTON */
        .action-btn {
          width: 100%;
          padding: 12px; /* Reduced padding */
          margin-top: 10px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #facc15, #f97316);
          color: #1a1a1a;
          font-weight: 800; 
          font-size: 16px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 15px rgba(249, 115, 22, 0.4);
        }
      `}</style>
    </div>
  );
}
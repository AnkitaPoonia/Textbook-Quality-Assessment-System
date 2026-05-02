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
    if (pdfFile) data.append("pdf", pdfFile);
    if (coverFile) data.append("cover", coverFile);
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
    <div className="add-book-page">
      
      {/* 🌈 ARTISTIC BACKGROUND */}
      <div className="art-bg">
        <span className="float emoji1">🚀</span>
        <span className="float emoji2">💡</span>
        <span className="float emoji3">⚛️</span>
        <span className="float emoji4">🧬</span>
        <span className="float emoji5">📝</span>
        <span className="float emoji6">🪐</span>
      </div>

      <div className="glass-card">
        <div className="header-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40">
            <path d="M19 13H5v-2h14v2z"/><path d="M12 5v14h-2V5h2z"/>
          </svg>
        </div>
        
        <h2 className="title">Add Academic Resource</h2>
        <p className="subtitle">Contribute to the library</p>

        <form onSubmit={submit}>
          {/* Title */}
          <div className="input-group">
            <label>Book Title</label>
            <div className="input-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              <input name="title" required onChange={handleChange} placeholder="e.g. Engineering Physics" />
            </div>
          </div>

          {/* Grid for Author & Subject */}
          <div className="grid-2">
            <div className="input-group">
              <label>Author</label>
              <div className="input-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input name="author" required onChange={handleChange} placeholder="Author Name" />
              </div>
            </div>

            <div className="input-group">
              <label>Subject</label>
              <div className="input-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                <input name="subject" required onChange={handleChange} placeholder="Subject" />
              </div>
            </div>
          </div>

          {/* Grid for Level & Format */}
          <div className="grid-2">
            <div className="input-group">
              <label>Level</label>
              <div className="input-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                <select name="level" onChange={handleChange}>
                  <option value="UG">Undergraduate (UG)</option>
                  <option value="PG">Postgraduate (PG)</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>Format</label>
              <div className="input-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                <select name="format" onChange={handleChange}>
                  <option value="textbook">Textbook</option>
                  <option value="reference">Reference</option>
                  <option value="ebook">E-Book</option>
                </select>
              </div>
            </div>
          </div>

          {/* Uploads */}
          <div className="input-group">
            <label>Upload PDF (Optional)</label>
            <div className="file-input-box">
              <input type="file" accept="application/pdf" onChange={handlePdfChange} />
            </div>
          </div>

          <div className="input-group">
            <label>Upload Cover Image (Optional)</label>
            <div className="file-input-box">
              <input type="file" accept="image/*" onChange={handleCoverChange} />
            </div>
          </div>

          <button className="submit-btn">Submit Resource</button>
        </form>
      </div>

      {/* 🎨 STYLES */}
      <style>{`
        .add-book-page {
          min-height: 100vh;
          width: 100vw;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px 20px;
          font-family: "Poppins", sans-serif;
          background: linear-gradient(135deg, #112b75ff, #4a137dff); 
          overflow-x: hidden;
        }

        /* ARTISTIC BACKGROUND */
        .art-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
        
        .float {
          position: absolute;
          font-size: 30px;
          opacity: 0.4;
          animation: floatUp 20s infinite linear;
        }

        .emoji1 { left: 10%; bottom: -10%; animation-delay: 0s; }
        .emoji2 { left: 30%; bottom: -15%; animation-delay: 4s; }
        .emoji3 { left: 50%; bottom: -12%; animation-delay: 8s; }
        .emoji4 { left: 70%; bottom: -18%; animation-delay: 2s; }
        .emoji5 { left: 85%; bottom: -14%; animation-delay: 6s; }
        .emoji6 { left: 20%; bottom: -20%; animation-delay: 10s; }

        @keyframes floatUp {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          20% { opacity: 0.6; }
          100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
        }

        /* GLASS CARD */
        .glass-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 550px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
          color: white;
          animation: slideUp 0.6s ease-out;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .header-icon {
          color: #facc15;
          text-align: center;
          margin-bottom: 10px;
          animation: bounce 3s infinite;
        }
        
        .header-icon svg { display: inline-block; }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .title { font-size: 26px; font-weight: 700; text-align: center; margin: 0; }
        .subtitle { font-size: 14px; opacity: 0.8; text-align: center; margin: 5px 0 30px 0; }

        /* FORM ELEMENTS */
        .input-group { margin-bottom: 15px; }
        .input-group label { display: block; font-size: 13px; margin-bottom: 6px; font-weight: 500; opacity: 0.9; }

        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }

        .input-box {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          padding: 12px 15px;
          border: 1px solid rgba(255, 255, 255, 0.5);
          transition: 0.2s;
        }

        .input-box:focus-within {
          background: white;
          border-color: #facc15;
          box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.2);
        }

        .input-box svg { color: #d97706; margin-right: 10px; flex-shrink: 0; }

        .input-box input, .input-box select {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          font-size: 14px;
          color: #1f2937;
          font-weight: 500;
          font-family: inherit;
        }

        .file-input-box {
          background: rgba(255, 255, 255, 0.1);
          border: 1px dashed rgba(255, 255, 255, 0.4);
          padding: 10px;
          border-radius: 12px;
        }
        
        .file-input-box input { color: white; font-size: 13px; }

        .submit-btn {
          width: 100%;
          padding: 14px;
          margin-top: 20px;
          background: linear-gradient(135deg, #facc15, #f97316);
          border: none;
          border-radius: 12px;
          color: #1a1a1a;
          font-weight: 800;
          font-size: 16px;
          cursor: pointer;
          transition: 0.2s;
        }

        .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(249, 115, 22, 0.4); }

        @media (max-width: 500px) {
          .grid-2 { grid-template-columns: 1fr; }
          .glass-card { padding: 30px 20px; }
        }
      `}</style>
    </div>
  );
}
export const API_BASE = import.meta.env.VITE_API_BASE ||
    (window.location.hostname.includes('vercel.app')
        ? "https://docxagent-backend-1.onrender.com"
        : "http://localhost:8000");

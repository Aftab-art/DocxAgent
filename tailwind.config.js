/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0f1117",
                surface: "#1a1d24",
                border: "#2d323d",
                primary: "#3b82f6",
                secondary: "#6366f1",
            }
        },
    },
    plugins: [],
}

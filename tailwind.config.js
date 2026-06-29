/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#08111f",
          900: "#0b1728",
          800: "#10243b",
        },
        lazada: {
          blue: "#1d6ef2",
          orange: "#f97316",
          red: "#ef4444",
          green: "#16a34a",
        },
      },
      boxShadow: {
        panel: "0 14px 40px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};

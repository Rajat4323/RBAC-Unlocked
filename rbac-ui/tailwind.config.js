/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#1D1F23", // Dark background color
        glass: "255, 255, 255, 0.1)", // Glassmorphism background color
      },
      backdropBlur: {
        xs: "4px", // Optional: Adds a subtle blur effect
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
      },
    },
  },
  plugins: [],
};

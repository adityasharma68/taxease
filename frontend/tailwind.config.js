/** @type {import('tailwindcss').Config} */
export default {
  // Tell Tailwind which files to scan for class names
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      // Custom font family
      fontFamily: {
        sans: ["DM Sans", "Segoe UI", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

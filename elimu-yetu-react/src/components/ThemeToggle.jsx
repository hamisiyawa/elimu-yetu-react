import { useTheme } from "../context/ThemeContext";

function ThemeToggle({ className = "" }) {
  const { theme, updateTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className={`theme-toggle-btn ${className}`}
      onClick={() => updateTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <i className={`bi ${isDark ? "bi-sun" : "bi-moon-stars"}`}></i>
    </button>
  );
}

export default ThemeToggle;
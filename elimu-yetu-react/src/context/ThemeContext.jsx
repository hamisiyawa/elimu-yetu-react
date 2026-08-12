import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {

  // read saved preference — default to light
  const [theme,    setTheme]    = useState(() => localStorage.getItem("theme")    || "light");
  const [fontSize, setFontSize] = useState(() => localStorage.getItem("fontSize") || "medium");
  const [language, setLanguage] = useState(() => localStorage.getItem("language") || "en");

  // apply theme to document whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // apply font size to document whenever it changes
  useEffect(() => {
    const sizeMap = { small: "14px", medium: "16px", large: "18px" };
    document.documentElement.style.setProperty("--base-font-size", sizeMap[fontSize]);
    localStorage.setItem("fontSize", fontSize);
  }, [fontSize]);

  // save language preference
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const updateTheme    = (val) => setTheme(val);
  const updateFontSize = (val) => setFontSize(val);
  const updateLanguage = (val) => setLanguage(val);

  return (
    <ThemeContext.Provider value={{
      theme, updateTheme,
      fontSize, updateFontSize,
      language, updateLanguage,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
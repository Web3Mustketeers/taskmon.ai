import React, { useEffect, useState } from "react";

function useDarkMode() {
  const [theme, setTheme] = useState("");
  const colorTheme = theme === "dark" ? "light" : "dark";

  useEffect(() => {
    setTheme(localStorage.theme);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = window.document.documentElement;
      root.classList.remove(colorTheme);
      if (theme) root.classList.add(theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme, colorTheme]);

  return [colorTheme, setTheme];
}

export default useDarkMode;

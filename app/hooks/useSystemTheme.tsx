import { useState, useEffect } from "react";

function useSystemTheme() {
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(() => {
    // Check if we're in a browser environment
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    // Default to light if not in browser
    return "light";
  });

  useEffect(() => {
    // Skip if not in browser
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    // Modern browsers
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return systemTheme;
}

export { useSystemTheme };

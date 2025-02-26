import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";
import PropTypes from "prop-types";

// Create theme context
const ThemeContext = createContext();

/**
 * ThemeProvider Component
 *
 * Provides theme context with functionality to switch between themes
 * and persists theme preference in localStorage
 */
export const ThemeProvider = ({ children }) => {
	// Initialize theme state from localStorage or system preference
	const [theme, setTheme] = useState(() => {
		const savedTheme = localStorage.getItem("theme");

		if (savedTheme) {
			return savedTheme;
		}

		// Check system preference
		if (
			window.matchMedia &&
			window.matchMedia("(prefers-color-scheme: dark)").matches
		) {
			return "dark";
		}

		return "light"; // Default theme
	});

	// Apply theme to document
	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
		localStorage.setItem("theme", theme);

		// Update meta theme-color
		const metaThemeColor = document.querySelector('meta[name="theme-color"]');
		if (metaThemeColor) {
			metaThemeColor.setAttribute(
				"content",
				theme === "dark" ? "#1e1e2e" : "#ffffff"
			);
		}
	}, [theme]);

	// Toggle between light and dark themes
	const toggleTheme = useCallback(() => {
		setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
	}, []);

	// Set specific theme
	const setSpecificTheme = useCallback((newTheme) => {
		if (newTheme === "light" || newTheme === "dark" || newTheme === "system") {
			if (newTheme === "system") {
				// Use system preference
				const isDarkMode =
					window.matchMedia &&
					window.matchMedia("(prefers-color-scheme: dark)").matches;
				setTheme(isDarkMode ? "dark" : "light");
			} else {
				setTheme(newTheme);
			}
		}
	}, []);

	// Listen for system theme changes if theme is set to 'system'
	useEffect(() => {
		const storedTheme = localStorage.getItem("theme");

		if (storedTheme === "system") {
			const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

			const handleChange = (e) => {
				setTheme(e.matches ? "dark" : "light");
			};

			mediaQuery.addEventListener("change", handleChange);

			return () => {
				mediaQuery.removeEventListener("change", handleChange);
			};
		}
	}, []);

	// Context value
	const contextValue = {
		theme,
		toggleTheme,
		setTheme: setSpecificTheme,
	};

	return (
		<ThemeContext.Provider value={contextValue}>
			{children}
		</ThemeContext.Provider>
	);
};

ThemeProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

// Custom hook for using the theme context
export const useTheme = () => {
	const context = useContext(ThemeContext);

	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}

	return context;
};

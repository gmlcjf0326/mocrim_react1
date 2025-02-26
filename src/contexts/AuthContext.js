import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";
import PropTypes from "prop-types";

// Create auth context
const AuthContext = createContext();

/**
 * AuthProvider Component
 *
 * Provides authentication context with login, logout functionality
 * and persistent authentication state
 */
export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	// Initialize auth state from localStorage on mount
	useEffect(() => {
		const checkAuthStatus = () => {
			const storedUser = localStorage.getItem("user");
			const storedToken = localStorage.getItem("token");

			if (storedUser && storedToken) {
				try {
					const parsedUser = JSON.parse(storedUser);
					setUser(parsedUser);
					setIsAuthenticated(true);
				} catch (error) {
					// Invalid stored user data
					localStorage.removeItem("user");
					localStorage.removeItem("token");
				}
			}

			setIsLoading(false);
		};

		checkAuthStatus();
	}, []);

	// Login function
	const login = useCallback(async (username, password) => {
		setIsLoading(true);

		try {
			// In a real app, this would be an API call:
			// const response = await api.login(username, password);
			// const { token, user } = response.data;

			// Mock authentication for demonstration
			if (username === "admin" && password === "password") {
				const mockUser = {
					id: 1,
					name: "관리자",
					username: "admin",
					role: "admin",
					email: "admin@moklim.com",
				};

				const mockToken =
					"mock-jwt-token-" + Math.random().toString(36).substring(2);

				// Store auth data in localStorage
				localStorage.setItem("user", JSON.stringify(mockUser));
				localStorage.setItem("token", mockToken);

				setUser(mockUser);
				setIsAuthenticated(true);
				setIsLoading(false);

				return { success: true };
			} else {
				throw new Error("Invalid credentials");
			}
		} catch (error) {
			setIsLoading(false);
			throw error;
		}
	}, []);

	// Logout function
	const logout = useCallback(() => {
		// Clear auth data from localStorage
		localStorage.removeItem("user");
		localStorage.removeItem("token");

		setUser(null);
		setIsAuthenticated(false);

		return Promise.resolve();
	}, []);

	// Update user information
	const updateUserInfo = useCallback(
		(updatedUserInfo) => {
			if (!user) return;

			const updatedUser = { ...user, ...updatedUserInfo };

			// Update localStorage
			localStorage.setItem("user", JSON.stringify(updatedUser));

			// Update state
			setUser(updatedUser);
		},
		[user]
	);

	// Context value
	const contextValue = {
		user,
		isAuthenticated,
		isLoading,
		login,
		logout,
		updateUserInfo,
	};

	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	);
};

AuthProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

// Custom hook for using the auth context
export const useAuth = () => {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context;
};

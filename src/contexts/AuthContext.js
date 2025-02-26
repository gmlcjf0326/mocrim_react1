import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Simulate checking authentication
		const checkAuth = () => {
			setIsLoading(true);
			// In a real app, you would check localStorage or cookies
			const storedUser = localStorage.getItem("user");
			if (storedUser) {
				setUser(JSON.parse(storedUser));
				setIsAuthenticated(true);
			}
			setIsLoading(false);
		};

		checkAuth();
	}, []);

	const login = (userData) => {
		setUser(userData);
		setIsAuthenticated(true);
		localStorage.setItem("user", JSON.stringify(userData));
	};

	const logout = () => {
		setUser(null);
		setIsAuthenticated(false);
		localStorage.removeItem("user");
	};

	return (
		<AuthContext.Provider
			value={{ user, isAuthenticated, isLoading, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

import React, { createContext, useState, useContext, useCallback } from "react";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
	const [notifications, setNotifications] = useState([]);

	const showNotification = useCallback((notification) => {
		const id = Date.now();
		setNotifications((prev) => [...prev, { ...notification, id }]);

		// Auto-hide after 5 seconds
		setTimeout(() => {
			setNotifications((prev) => prev.filter((item) => item.id !== id));
		}, 5000);

		return id;
	}, []);

	const hideNotification = useCallback((id) => {
		setNotifications((prev) => prev.filter((item) => item.id !== id));
	}, []);

	return (
		<NotificationContext.Provider
			value={{ notifications, showNotification, hideNotification }}>
			{children}
		</NotificationContext.Provider>
	);
};

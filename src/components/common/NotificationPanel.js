import React from "react";
import PropTypes from "prop-types";
import { useNotification } from "../../contexts/NotificationContext";

/**
 * NotificationPanel Component
 *
 * Displays system notifications in a floating panel
 * Automatically removes notifications after a set time
 */
const NotificationPanel = ({ notifications = [] }) => {
	const { removeNotification } = useNotification();

	// Get icon based on notification type
	const getNotificationIcon = (type) => {
		switch (type) {
			case "success":
				return "✅";
			case "error":
				return "❌";
			case "warning":
				return "⚠️";
			default:
				return "ℹ️";
		}
	};

	if (!notifications || notifications.length === 0) {
		return null;
	}

	return (
		<div className="notification-panel">
			{notifications.map((notification) => (
				<div
					key={notification.id}
					className={`notification-item notification-${
						notification.type || "info"
					}`}>
					<span className="notification-icon">
						{getNotificationIcon(notification.type)}
					</span>
					<div className="notification-content">
						<div className="notification-title">{notification.title}</div>
						<div className="notification-message">{notification.message}</div>
					</div>
					<button
						className="notification-close"
						onClick={() => removeNotification(notification.id)}
						aria-label="Close notification">
						×
					</button>
				</div>
			))}
		</div>
	);
};

NotificationPanel.propTypes = {
	notifications: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
			title: PropTypes.string,
			message: PropTypes.string.isRequired,
			type: PropTypes.oneOf(["info", "success", "warning", "error"]),
		})
	),
};

export default NotificationPanel;

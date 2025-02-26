import React from "react";
import PropTypes from "prop-types";

/**
 * NotificationPanel Component
 *
 * Displays system notifications and alerts to the user in a persistent panel
 * that can be dismissed individually or cleared all at once.
 */
const NotificationPanel = ({ notifications = [] }) => {
	if (notifications.length === 0) {
		return null;
	}

	// Get icon based on notification type
	const getNotificationIcon = (type) => {
		switch (type) {
			case "info":
				return "ℹ️";
			case "success":
				return "✅";
			case "warning":
				return "⚠️";
			case "error":
				return "❌";
			default:
				return "📢";
		}
	};

	return (
		<div className="notification-panel">
			{notifications.map((notification) => (
				<div
					key={notification.id}
					className={`notification-item notification-${
						notification.type || "info"
					}`}>
					<div className="notification-icon">
						{getNotificationIcon(notification.type)}
					</div>
					<div className="notification-content">
						<div className="notification-title">{notification.title}</div>
						<div className="notification-message">{notification.message}</div>
					</div>
					<button
						className="notification-close"
						onClick={() =>
							notification.onClose && notification.onClose(notification.id)
						}
						aria-label="알림 닫기">
						✕
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
			title: PropTypes.string.isRequired,
			message: PropTypes.string.isRequired,
			type: PropTypes.oneOf(["info", "success", "warning", "error"]),
			onClose: PropTypes.func,
		})
	),
};

export default NotificationPanel;

import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "./QuickAccessButtons.css";

/**
 * QuickAccessButtons Component
 *
 * Renders a grid of quick access buttons for common actions in the ERP system.
 * Each button has an icon and label and navigates to a specific route when clicked.
 *
 * @component
 * @param {Object} props
 * @param {Array} props.buttons - Array of button configuration objects
 */
const QuickAccessButtons = ({ buttons }) => {
	const navigate = useNavigate();

	/**
	 * Handle button click and navigate to the specified path
	 * @param {string} path - The route path to navigate to
	 */
	const handleButtonClick = (path) => {
		navigate(path);
	};

	return (
		<div className="quick-access-section">
			<h3 className="section-title">빠른 액세스</h3>
			<div className="quick-access-grid">
				{buttons.map((button) => (
					<button
						key={button.id}
						className="quick-access-button"
						onClick={() => handleButtonClick(button.path)}
						aria-label={button.label}>
						<div className="quick-access-icon">{button.icon}</div>
						<div className="quick-access-label">{button.label}</div>
					</button>
				))}
			</div>
		</div>
	);
};

QuickAccessButtons.propTypes = {
	buttons: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			icon: PropTypes.node.isRequired,
			label: PropTypes.string.isRequired,
			path: PropTypes.string.isRequired,
		})
	).isRequired,
};

// Default buttons configuration
QuickAccessButtons.defaultProps = {
	buttons: [
		{
			id: "new-order",
			icon: "🛒",
			label: "새 주문 생성",
			path: "/orders/management",
		},
		{
			id: "product-management",
			icon: "📦",
			label: "제고 항목 추가",
			path: "/purchase/inventory",
		},
		{
			id: "production-planning",
			icon: "🏭",
			label: "생산 계획 생성",
			path: "/production/woodesty",
		},
		{
			id: "purchase-order",
			icon: "🧾",
			label: "발주서 생성",
			path: "/purchase/vendors",
		},
		{
			id: "client-management",
			icon: "👥",
			label: "고객 추가",
			path: "/orders/management",
		},
		{
			id: "report-generation",
			icon: "📊",
			label: "보고서 생성",
			path: "/financial/collection",
		},
	],
};

export default React.memo(QuickAccessButtons);

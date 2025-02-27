import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "./QuickAccessButtons.css";

/**
 * QuickAccessButtons Component
 *
 * Renders the six quick access buttons shown in the dashboard
 * Each button navigates to a specific part of the application
 */
const QuickAccessButtons = () => {
	const navigate = useNavigate();

	// Define button configurations based on the screenshot
	const buttonConfigs = [
		{
			id: "new-order",
			icon: "🛒",
			label: "새 주문 생성",
			action: () => navigate("/orders/management"),
		},
		{
			id: "product-inventory",
			icon: "📦",
			label: "제고 항목 추가",
			action: () => navigate("/purchase/inventory"),
		},
		{
			id: "production-plan",
			icon: "🏭",
			label: "생산 계획 생성",
			action: () => navigate("/production/woodesty"),
		},
		{
			id: "purchase-order",
			icon: "🧾",
			label: "발주서 생성",
			action: () => navigate("/purchase/vendors"),
		},
		{
			id: "customer-management",
			icon: "👥",
			label: "고객 추가",
			action: () => navigate("/orders/management"),
		},
		{
			id: "report-generation",
			icon: "📊",
			label: "보고서 생성",
			action: () => navigate("/financial/collection"),
		},
	];

	return (
		<div className="quick-access-section">
			<h2 className="section-title">빠른 액세스</h2>
			<div className="quick-access-grid">
				{buttonConfigs.map((button) => (
					<button
						key={button.id}
						className="quick-access-item"
						onClick={button.action}
						aria-label={button.label}>
						<div className="quick-access-icon">{button.icon}</div>
						<div className="quick-access-label">{button.label}</div>
					</button>
				))}
			</div>
		</div>
	);
};

export default QuickAccessButtons;

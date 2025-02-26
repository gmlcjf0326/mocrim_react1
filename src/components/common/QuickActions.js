import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../contexts/NotificationContext";

/**
 * QuickActions Component
 *
 * Floating action button that shows context-aware quick actions based on current module
 */
const QuickActions = ({ activeModule }) => {
	const [isOpen, setIsOpen] = useState(false);
	const navigate = useNavigate();
	const { showNotification } = useNotification();

	// Get actions based on current module
	const getActionsForModule = () => {
		switch (activeModule) {
			case "purchase":
				return [
					{
						id: "new-order",
						label: "신규 발주",
						icon: "📝",
						path: "/purchase/vendors",
					},
					{
						id: "inventory",
						label: "원자재 관리",
						icon: "📦",
						path: "/purchase/inventory",
					},
					{
						id: "vendor",
						label: "매입사 관리",
						icon: "🏢",
						path: "/purchase/vendors",
					},
				];
			case "production":
				return [
					{
						id: "new-production",
						label: "신규 생산",
						icon: "🏭",
						path: "/production/woodesty",
					},
					{
						id: "materials",
						label: "자재 관리",
						icon: "📦",
						path: "/production/woodesty",
					},
					{
						id: "processors",
						label: "임가공 관리",
						icon: "🤝",
						path: "/production/outsourced",
					},
				];
			case "orders":
				return [
					{
						id: "new-order",
						label: "신규 수주",
						icon: "📋",
						path: "/orders/management",
					},
					{
						id: "delivery",
						label: "배송 관리",
						icon: "🚚",
						path: "/orders/management",
					},
					{
						id: "inventory",
						label: "제품 재고",
						icon: "📦",
						path: "/orders/inventory",
					},
				];
			case "financial":
				return [
					{
						id: "new-collection",
						label: "수금 등록",
						icon: "💰",
						path: "/financial/collection",
					},
					{
						id: "new-payment",
						label: "지급 등록",
						icon: "💸",
						path: "/financial/payment",
					},
					{
						id: "reports",
						label: "보고서 생성",
						icon: "📊",
						path: "/financial/dashboard",
					},
				];
			case "settings":
				return [
					{
						id: "user-settings",
						label: "사용자 설정",
						icon: "👤",
						path: "/settings",
					},
					{
						id: "system-settings",
						label: "시스템 설정",
						icon: "⚙️",
						path: "/settings",
					},
				];
			default:
				return [
					{
						id: "purchase",
						label: "매입 관리",
						icon: "📦",
						path: "/purchase/dashboard",
					},
					{
						id: "production",
						label: "생산 관리",
						icon: "🏭",
						path: "/production/dashboard",
					},
					{
						id: "orders",
						label: "수주/출고 관리",
						icon: "📋",
						path: "/orders/dashboard",
					},
					{
						id: "financial",
						label: "수금/지급 관리",
						icon: "💰",
						path: "/financial/dashboard",
					},
				];
		}
	};

	// Handle action click
	const handleActionClick = (action) => {
		navigate(action.path);
		setIsOpen(false);

		showNotification({
			title: "Quick Action",
			message: `이동: ${action.label}`,
			type: "info",
		});
	};

	// Toggle quick action menu
	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	// Get available actions for current module
	const actions = getActionsForModule();

	return (
		<div className="quick-actions">
			{isOpen && (
				<div className="quick-action-menu">
					{actions.map((action) => (
						<button
							key={action.id}
							className="quick-action-item"
							onClick={() => handleActionClick(action)}
							aria-label={action.label}>
							<span className="quick-action-icon">{action.icon}</span>
							{action.label}
						</button>
					))}
				</div>
			)}
			<button
				className={`quick-action-main ${isOpen ? "active" : ""}`}
				onClick={toggleMenu}
				aria-label={isOpen ? "Close quick actions" : "Open quick actions"}
				aria-expanded={isOpen}>
				{isOpen ? "×" : "+"}
			</button>
		</div>
	);
};

QuickActions.propTypes = {
	activeModule: PropTypes.oneOf([
		"dashboard",
		"purchase",
		"production",
		"orders",
		"financial",
		"settings",
	]).isRequired,
};

export default QuickActions;

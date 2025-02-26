import React, { useState } from "react";
import PropTypes from "prop-types";

/**
 * QuickActions Component
 *
 * Provides a floating action button menu for quick access to common actions
 * based on the current active module.
 */
const QuickActions = ({ activeModule }) => {
	const [expanded, setExpanded] = useState(false);

	// Toggle the expanded state of the quick actions menu
	const toggleExpanded = () => {
		setExpanded(!expanded);
	};

	// Get actions based on active module
	const getActions = () => {
		switch (activeModule) {
			case "purchase":
				return [
					{
						id: "add-vendor",
						icon: "🏢",
						label: "매입사 추가",
						action: () => console.log("매입사 추가 액션 실행"),
					},
					{
						id: "add-material",
						icon: "📦",
						label: "자재 입고",
						action: () => console.log("자재 입고 액션 실행"),
					},
					{
						id: "inventory-check",
						icon: "🔍",
						label: "재고 조사",
						action: () => console.log("재고 조사 액션 실행"),
					},
				];
			case "production":
				return [
					{
						id: "add-production",
						icon: "🏭",
						label: "생산 요청",
						action: () => console.log("생산 요청 액션 실행"),
					},
					{
						id: "quality-check",
						icon: "✓",
						label: "품질 검수",
						action: () => console.log("품질 검수 액션 실행"),
					},
					{
						id: "material-allocation",
						icon: "🔄",
						label: "자재 할당",
						action: () => console.log("자재 할당 액션 실행"),
					},
				];
			case "orders":
				return [
					{
						id: "add-order",
						icon: "📋",
						label: "주문 추가",
						action: () => console.log("주문 추가 액션 실행"),
					},
					{
						id: "shipping",
						icon: "🚚",
						label: "출고 처리",
						action: () => console.log("출고 처리 액션 실행"),
					},
					{
						id: "invoice",
						icon: "📃",
						label: "거래명세서",
						action: () => console.log("거래명세서 액션 실행"),
					},
				];
			case "financial":
				return [
					{
						id: "add-payment",
						icon: "💰",
						label: "수금 등록",
						action: () => console.log("수금 등록 액션 실행"),
					},
					{
						id: "add-expense",
						icon: "💸",
						label: "지출 등록",
						action: () => console.log("지출 등록 액션 실행"),
					},
					{
						id: "finance-report",
						icon: "📊",
						label: "재무 보고서",
						action: () => console.log("재무 보고서 액션 실행"),
					},
				];
			default:
				return [
					{
						id: "help",
						icon: "❓",
						label: "도움말",
						action: () => console.log("도움말 액션 실행"),
					},
					{
						id: "feedback",
						icon: "💬",
						label: "피드백",
						action: () => console.log("피드백 액션 실행"),
					},
				];
		}
	};

	const actions = getActions();

	return (
		<div className="quick-actions">
			{expanded && (
				<div className="quick-action-menu">
					{actions.map((action) => (
						<button
							key={action.id}
							className="quick-action-item"
							onClick={() => {
								action.action();
								setExpanded(false);
							}}
							aria-label={action.label}
							title={action.label}>
							<span className="quick-action-icon">{action.icon}</span>
							<span className="quick-action-label">{action.label}</span>
						</button>
					))}
				</div>
			)}

			<button
				className={`quick-action-main ${expanded ? "active" : ""}`}
				onClick={toggleExpanded}
				aria-label={expanded ? "빠른 액션 닫기" : "빠른 액션 메뉴 열기"}
				aria-expanded={expanded}>
				{expanded ? "✕" : "+"}
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
	]),
};

export default QuickActions;

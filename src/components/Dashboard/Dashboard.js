import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "./Dashboard.css";

/**
 * Dashboard Component
 *
 * Displays metrics, charts and quick access cards for different modules of the ERP system
 * Includes quick access buttons for common actions and comprehensive data visualization
 * Can be contextualized based on the current module
 */
const Dashboard = ({ module = "dashboard" }) => {
	const [metrics, setMetrics] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [recentActivities, setRecentActivities] = useState([]);
	const [notifications, setNotifications] = useState([]);
	const location = useLocation();
	const navigate = useNavigate();

	// Mock data for different module dashboards
	const mockMetricsData = {
		dashboard: {
			totalSales: 172450000,
			totalPurchase: 128450000,
			operatingProfit: 44000000,
			totalOrders: 245,
			pendingOrders: 12,
			lowStockItems: 3,
			monthlyGrowth: 15.2,
		},
		purchase: {
			totalPurchase: 128450000,
			orderCount: 87,
			lowStockAlerts: 3,
			monthlyGrowth: 12.5,
			pendingDeliveries: 5,
			topVendors: [
				{ name: "동화기업", amount: 22400000 },
				{ name: "한솔홈데코", amount: 12300000 },
				{ name: "성창기업", amount: 9800000 },
			],
		},
		production: {
			totalProduction: 5280,
			woodestyProduction: 124,
			activeProcessors: 7,
			monthlyGrowth: 8.3,
			pendingProduction: 2,
			inProgressProduction: 3,
		},
		orders: {
			totalSales: 172450000,
			orderCount: 245,
			deliveryCount: 12,
			monthlyGrowth: 15.2,
			pendingOrders: 5,
			processingOrders: 8,
		},
		financial: {
			totalCollection: 165230000,
			totalPayment: 130450000,
			outstandingAmount: 28350000,
			monthlyGrowth: 10.2,
			monthlyPaymentGrowth: 7.8,
			outstandingReduction: 5.1,
		},
	};

	// Mock data for recent activities
	const mockRecentActivities = [
		{
			id: 1,
			type: "주문",
			name: "우성목재 SO-2025022501",
			date: "2025-02-25",
			status: "접수",
		},
		{
			id: 2,
			type: "발주",
			name: "동화기업 PO-2025022501",
			date: "2025-02-25",
			status: "발주진행",
		},
		{
			id: 3,
			type: "생산",
			name: "우드에스티 PR-2025022501",
			date: "2025-02-25",
			status: "작업중",
		},
		{
			id: 4,
			type: "수금",
			name: "대림가구 RC-2025022502",
			date: "2025-02-25",
			status: "완료",
		},
		{
			id: 5,
			type: "입고",
			name: "한솔홈데코 입고",
			date: "2025-02-24",
			status: "입고완료",
		},
	];

	// Mock data for notifications
	const mockNotifications = [
		{ id: 1, type: "warning", message: "원재료 부족 알림: PB E1 15mm (3건)" },
		{ id: 2, type: "warning", message: "임가공업체 B 원재료 부족 (1건)" },
		{ id: 3, type: "warning", message: "대전가구 미수금 41일 경과 (1건)" },
		{ id: 4, type: "info", message: "신규 견적 요청 (3건)" },
	];

	// Quick access buttons configuration
	const quickAccessButtons = useMemo(
		() => [
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
		[]
	);

	/**
	 * Fetch dashboard data from API
	 * In production, this would connect to a real backend
	 */
	const fetchDashboardData = useCallback(async () => {
		setLoading(true);
		try {
			// In a real app, we would fetch from an API:
			// const response = await api.getDashboardMetrics(module);
			// setMetrics(response.data);

			// Simulating API calls with timeouts
			setTimeout(() => {
				setMetrics(mockMetricsData[module] || mockMetricsData.dashboard);
				setRecentActivities(mockRecentActivities);
				setNotifications(mockNotifications);
				setLoading(false);
			}, 600);
		} catch (err) {
			setError("Failed to load dashboard data");
			setLoading(false);
		}
	}, [module, mockMetricsData, mockRecentActivities, mockNotifications]);

	// Load dashboard data on module change
	useEffect(() => {
		fetchDashboardData();
	}, [fetchDashboardData, module]);

	// Handle refresh when location changes
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [location.pathname]);

	/**
	 * Format currency for display
	 * @param {number} amount - The amount to format
	 * @returns {string} Formatted currency string
	 */
	const formatCurrency = (amount) => {
		return amount.toLocaleString("ko-KR") + "원";
	};

	/**
	 * Get the dashboard title based on the current module
	 * @returns {string} Appropriate title for the current module
	 */
	const getDashboardTitle = useCallback(() => {
		switch (module) {
			case "purchase":
				return "매입 관리 대시보드";
			case "production":
				return "생산 및 임가공 관리 대시보드";
			case "orders":
				return "수주 및 출고 관리 대시보드";
			case "financial":
				return "수금 및 지급 관리 대시보드";
			default:
				return "통합 대시보드";
		}
	}, [module]);

	/**
	 * Handle quick access button click
	 * @param {string} path - The path to navigate to
	 */
	const handleQuickAccessButtonClick = useCallback(
		(path) => {
			navigate(path);
		},
		[navigate]
	);

	/**
	 * Render metrics cards based on the current module
	 * @returns {JSX.Element} The appropriate metrics cards for the current module
	 */
	const renderMetricsCards = () => {
		if (loading) {
			return <div className="loading-spinner">데이터를 불러오는 중...</div>;
		}

		if (error) {
			return <div className="error-message">{error}</div>;
		}

		switch (module) {
			case "purchase":
				return (
					<>
						<div className="metric-card primary">
							<div className="metric-title">이번 달 총 매입액</div>
							<div className="metric-value">
								{formatCurrency(metrics.totalPurchase)}
							</div>
							<div className="metric-change increase">
								<span>↑</span> 전월 대비 {metrics.monthlyGrowth}% 증가
							</div>
						</div>
						<div className="metric-card secondary">
							<div className="metric-title">이번 달 발주 건수</div>
							<div className="metric-value">{metrics.orderCount}건</div>
							<div className="metric-change increase">
								<span>↑</span> 전월 대비 5.2% 증가
							</div>
						</div>
						<div className="metric-card warning">
							<div className="metric-title">원재료 부족 알림</div>
							<div className="metric-value">{metrics.lowStockAlerts}건</div>
							<div className="metric-change">
								<span>⚠️</span> 조치 필요
							</div>
						</div>
					</>
				);
			case "production":
				return (
					<>
						<div className="metric-card primary">
							<div className="metric-title">이번 달 총 생산량</div>
							<div className="metric-value">{metrics.totalProduction}장</div>
							<div className="metric-change increase">
								<span>↑</span> 전월 대비 {metrics.monthlyGrowth}% 증가
							</div>
						</div>
						<div className="metric-card secondary">
							<div className="metric-title">우드에스티 생산 건수</div>
							<div className="metric-value">{metrics.woodestyProduction}건</div>
							<div className="metric-change increase">
								<span>↑</span> 전월 대비 6.9% 증가
							</div>
						</div>
						<div className="metric-card success">
							<div className="metric-title">임가공업체 현황</div>
							<div className="metric-value">{metrics.activeProcessors}개</div>
							<div className="metric-change">
								<span>✓</span> 모두 정상 가동 중
							</div>
						</div>
					</>
				);
			case "orders":
				return (
					<>
						<div className="metric-card primary">
							<div className="metric-title">이번 달 총 수주액</div>
							<div className="metric-value">
								{formatCurrency(metrics.totalSales)}
							</div>
							<div className="metric-change increase">
								<span>↑</span> 전월 대비 {metrics.monthlyGrowth}% 증가
							</div>
						</div>
						<div className="metric-card secondary">
							<div className="metric-title">이번 달 출고 건수</div>
							<div className="metric-value">{metrics.orderCount}건</div>
							<div className="metric-change increase">
								<span>↑</span> 전월 대비 8.7% 증가
							</div>
						</div>
						<div className="metric-card info">
							<div className="metric-title">오늘 배달 예정</div>
							<div className="metric-value">{metrics.deliveryCount}건</div>
							<div className="metric-change">
								<span>🚚</span> 배달 진행 중
							</div>
						</div>
					</>
				);
			case "financial":
				return (
					<>
						<div className="metric-card primary">
							<div className="metric-title">이번 달 총 수금액</div>
							<div className="metric-value">
								{formatCurrency(metrics.totalCollection)}
							</div>
							<div className="metric-change increase">
								<span>↑</span> 전월 대비 {metrics.monthlyGrowth}% 증가
							</div>
						</div>
						<div className="metric-card secondary">
							<div className="metric-title">이번 달 총 지급액</div>
							<div className="metric-value">
								{formatCurrency(metrics.totalPayment)}
							</div>
							<div className="metric-change increase">
								<span>↑</span> 전월 대비 {metrics.monthlyPaymentGrowth}% 증가
							</div>
						</div>
						<div className="metric-card success">
							<div className="metric-title">미수금 현황</div>
							<div className="metric-value">
								{formatCurrency(metrics.outstandingAmount)}
							</div>
							<div className="metric-change decrease">
								<span>↓</span> 전월 대비 {metrics.outstandingReduction}% 감소
							</div>
						</div>
					</>
				);
			default:
				return (
					<>
						<div className="metric-card primary">
							<div className="metric-title">이번 달 총 매출액</div>
							<div className="metric-value">
								{formatCurrency(metrics.totalSales)}
							</div>
							<div className="metric-change increase">
								<span>↑</span> 전월 대비 {metrics.monthlyGrowth}% 증가
							</div>
						</div>
						<div className="metric-card secondary">
							<div className="metric-title">이번 달 총 매입액</div>
							<div className="metric-value">
								{formatCurrency(metrics.totalPurchase)}
							</div>
							<div className="metric-change increase">
								<span>↑</span> 전월 대비 12.5% 증가
							</div>
						</div>
						<div className="metric-card success">
							<div className="metric-title">이번 달 영업이익</div>
							<div className="metric-value">
								{formatCurrency(metrics.operatingProfit)}
							</div>
							<div className="metric-change increase">
								<span>↑</span> 전월 대비 22.8% 증가
							</div>
						</div>
					</>
				);
		}
	};

	/**
	 * Render quick access buttons
	 * @returns {JSX.Element} Grid of quick access buttons
	 */
	const renderQuickAccessButtons = useCallback(() => {
		return (
			<div className="quick-access-section">
				<h3 className="section-title">빠른 액세스</h3>
				<div className="quick-access-grid">
					{quickAccessButtons.map((button) => (
						<button
							key={button.id}
							className="quick-access-button"
							onClick={() => handleQuickAccessButtonClick(button.path)}
							aria-label={button.label}>
							<div className="quick-access-icon">{button.icon}</div>
							<div className="quick-access-label">{button.label}</div>
						</button>
					))}
				</div>
			</div>
		);
	}, [quickAccessButtons, handleQuickAccessButtonClick]);

	/**
	 * Render recent activity list
	 * @returns {JSX.Element} Table with recent activities
	 */
	const renderRecentActivity = useCallback(() => {
		const getStatusClassName = (status) => {
			switch (status) {
				case "접수":
				case "발주진행":
					return "status-pending";
				case "작업중":
				case "배송중":
					return "status-processing";
				case "완료":
				case "입고완료":
					return "status-completed";
				default:
					return "";
			}
		};

		return (
			<div className="table-container">
				<table className="data-table">
					<thead>
						<tr>
							<th>구분</th>
							<th>내용</th>
							<th>일자</th>
							<th>상태</th>
						</tr>
					</thead>
					<tbody>
						{recentActivities.map((activity) => (
							<tr key={activity.id}>
								<td>{activity.type}</td>
								<td>{activity.name}</td>
								<td>{activity.date}</td>
								<td>
									<span
										className={`status-badge ${getStatusClassName(
											activity.status
										)}`}>
										{activity.status}
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	}, [recentActivities]);

	/**
	 * Render notifications
	 * @returns {JSX.Element} List of notifications
	 */
	const renderNotifications = useCallback(() => {
		return (
			<div className="notifications-list">
				{notifications.map((notification) => (
					<div
						key={notification.id}
						className={`notification-item ${notification.type}`}>
						<span className="notification-icon">
							{notification.type === "warning" ? "⚠️" : "📬"}
						</span>
						<span className="notification-message">{notification.message}</span>
					</div>
				))}
			</div>
		);
	}, [notifications]);

	/**
	 * Render chart section with placeholder data
	 * @returns {JSX.Element} Chart visualization
	 */
	const renderChart = useCallback(() => {
		return (
			<div className="chart-container">
				{/* Chart placeholder - in a real app, this would be populated with a chart library */}
				<div className="chart-placeholder">
					<p>월별 매출/매입 차트가 이 곳에 표시됩니다</p>
					<div className="placeholder-bars">
						<div className="bar-wrapper">
							<div
								className="bar revenue"
								style={{ height: "70%" }}></div>
							<div
								className="bar purchase"
								style={{ height: "55%" }}></div>
							<div className="month-label">1월</div>
						</div>
						<div className="bar-wrapper">
							<div
								className="bar revenue"
								style={{ height: "80%" }}></div>
							<div
								className="bar purchase"
								style={{ height: "65%" }}></div>
							<div className="month-label">2월</div>
						</div>
						<div className="bar-wrapper">
							<div
								className="bar revenue"
								style={{ height: "65%" }}></div>
							<div
								className="bar purchase"
								style={{ height: "60%" }}></div>
							<div className="month-label">3월</div>
						</div>
						<div className="bar-wrapper">
							<div
								className="bar revenue"
								style={{ height: "90%" }}></div>
							<div
								className="bar purchase"
								style={{ height: "75%" }}></div>
							<div className="month-label">4월</div>
						</div>
						<div className="bar-wrapper">
							<div
								className="bar revenue"
								style={{ height: "85%" }}></div>
							<div
								className="bar purchase"
								style={{ height: "70%" }}></div>
							<div className="month-label">5월</div>
						</div>
						<div className="bar-wrapper">
							<div
								className="bar revenue"
								style={{ height: "100%" }}></div>
							<div
								className="bar purchase"
								style={{ height: "80%" }}></div>
							<div className="month-label">6월</div>
						</div>
					</div>
					<div className="chart-legend">
						<div className="legend-item">
							<div className="legend-color revenue"></div>
							<div className="legend-label">매출</div>
						</div>
						<div className="legend-item">
							<div className="legend-color purchase"></div>
							<div className="legend-label">매입</div>
						</div>
					</div>
				</div>
			</div>
		);
	}, []);

	return (
		<div className="dashboard">
			<h2 className="page-title">{getDashboardTitle()}</h2>

			<div className="metrics-container">{renderMetricsCards()}</div>

			{renderQuickAccessButtons()}

			<div className="dashboard-grid">
				<div className="dashboard-card">
					<div className="card-header">
						<h3 className="card-title">최근 활동</h3>
						<div className="card-actions">
							<button className="btn btn-primary">전체 보기</button>
						</div>
					</div>
					{renderRecentActivity()}
				</div>

				<div className="dashboard-card">
					<div className="card-header">
						<h3 className="card-title">알림 사항</h3>
					</div>
					{renderNotifications()}
				</div>
			</div>

			<div className="dashboard-card">
				<div className="card-header">
					<h3 className="card-title">매출/매입 추이</h3>
					<div className="card-actions">
						<button className="btn btn-primary">상세 분석</button>
					</div>
				</div>
				{renderChart()}
			</div>
		</div>
	);
};

Dashboard.propTypes = {
	module: PropTypes.oneOf([
		"dashboard",
		"purchase",
		"production",
		"orders",
		"financial",
	]),
};

export default React.memo(Dashboard);

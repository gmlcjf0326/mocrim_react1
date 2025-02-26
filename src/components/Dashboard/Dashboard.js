import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import "./Dashboard.css";
/**
 * Dashboard Component
 *
 * A comprehensive dashboard component that displays statistics and key metrics
 * for different modules of the ERP system.
 */
const Dashboard = ({ module = "dashboard" }) => {
	const [stats, setStats] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchDashboardData = async () => {
			setLoading(true);
			try {
				// In a real application, this would be an API call
				// const response = await api.getDashboardData(module);
				// setStats(response.data);

				// Mock data for demonstration
				setTimeout(() => {
					// Simulate API delay
					setStats(getMockDashboardData(module));
					setError(null);
					setLoading(false);
				}, 500);
			} catch (err) {
				setError("Failed to load dashboard data");
				setLoading(false);
			}
		};

		fetchDashboardData();
	}, [module]);

	// Mock dashboard data based on module
	const getMockDashboardData = (moduleType) => {
		switch (moduleType) {
			case "purchase":
				return {
					title: "매입 관리 대시보드",
					stats: [
						{
							id: 1,
							title: "이번 달 총 매입액",
							value: "₩75,430,000",
							change: "+12.5%",
						},
						{
							id: 2,
							title: "이번 달 매입 건수",
							value: "158건",
							change: "+5.2%",
						},
						{ id: 3, title: "요주의 재고 항목", value: "12건", change: "-3건" },
					],
					recentOrders: [
						{
							id: 1,
							date: "2025-02-25",
							vendor: "동화기업",
							amount: "₩4,320,000",
							status: "completed",
						},
						{
							id: 2,
							date: "2025-02-24",
							vendor: "한솔홈데코",
							amount: "₩2,850,000",
							status: "pending",
						},
					],
				};
			case "production":
				return {
					title: "생산 관리 대시보드",
					stats: [
						{ id: 1, title: "진행중인 생산", value: "23건", change: "+3건" },
						{ id: 2, title: "금주 생산완료", value: "45건", change: "+12.8%" },
						{ id: 3, title: "평균 생산기간", value: "2.3일", change: "-0.5일" },
					],
					recentOrders: [
						{
							id: 1,
							date: "2025-02-25",
							product: "3808-3/양면 E0 18mm",
							quantity: "120장",
							status: "processing",
						},
						{
							id: 2,
							date: "2025-02-24",
							product: "UV무늬목 15mm",
							quantity: "80장",
							status: "completed",
						},
					],
				};
			case "orders":
				return {
					title: "수주 및 출고 대시보드",
					stats: [
						{
							id: 1,
							title: "이번 달 총 출고액",
							value: "₩92,750,000",
							change: "+8.3%",
						},
						{
							id: 2,
							title: "이번 달 출고 건수",
							value: "132건",
							change: "+4.7%",
						},
						{ id: 3, title: "출하 대기 건수", value: "15건", change: "+2건" },
					],
					recentOrders: [
						{
							id: 1,
							date: "2025-02-25",
							customer: "우성목재",
							amount: "₩3,680,000",
							status: "processing",
						},
						{
							id: 2,
							date: "2025-02-24",
							customer: "대림가구",
							amount: "₩4,260,000",
							status: "completed",
						},
					],
				};
			case "financial":
				return {
					title: "수금 및 지급 대시보드",
					stats: [
						{
							id: 1,
							title: "이번 달 총 수금액",
							value: "₩87,250,000",
							change: "+5.8%",
						},
						{
							id: 2,
							title: "이번 달 총 지출액",
							value: "₩65,430,000",
							change: "+3.2%",
						},
						{
							id: 3,
							title: "미수금 총액",
							value: "₩12,840,000",
							change: "-8.5%",
						},
					],
					recentOrders: [
						{
							id: 1,
							date: "2025-02-25",
							account: "우성목재",
							amount: "₩3,680,000",
							type: "수금",
						},
						{
							id: 2,
							date: "2025-02-24",
							account: "동화기업",
							amount: "₩4,320,000",
							type: "지급",
						},
					],
				};
			default:
				return {
					title: "목림상사 ERP 대시보드",
					stats: [
						{
							id: 1,
							title: "이번 달 총 매출",
							value: "₩92,750,000",
							change: "+8.3%",
						},
						{
							id: 2,
							title: "이번 달 총 매입",
							value: "₩75,430,000",
							change: "+12.5%",
						},
						{ id: 3, title: "진행중인 생산", value: "23건", change: "+3건" },
					],
					recentOrders: [
						{
							id: 1,
							date: "2025-02-25",
							customer: "우성목재",
							amount: "₩3,680,000",
							status: "processing",
						},
						{
							id: 2,
							date: "2025-02-24",
							vendor: "동화기업",
							amount: "₩4,320,000",
							status: "completed",
						},
					],
				};
		}
	};

	if (loading) {
		return <div className="loading-indicator">Loading dashboard data...</div>;
	}

	if (error) {
		return <div className="error-message">{error}</div>;
	}

	return (
		<div className={`dashboard-container ${module}-theme`}>
			<h2 className="module-title">{stats.title}</h2>

			<div className="stats-grid">
				{stats.stats &&
					stats.stats.map((stat) => (
						<div
							key={stat.id}
							className="stat-card">
							<div className="stat-title">{stat.title}</div>
							<div className="stat-value">{stat.value}</div>
							<div
								className={`stat-change ${
									stat.change.startsWith("+")
										? "stat-increase"
										: "stat-decrease"
								}`}>
								{stat.change.startsWith("+") ? "↑" : "↓"} {stat.change}
							</div>
						</div>
					))}
			</div>

			<div className="dashboard-content">
				<div className="card">
					<div className="card-header">
						<h3 className="card-title">최근 거래 내역</h3>
					</div>
					<table className="data-table">
						<thead>
							<tr>
								<th>날짜</th>
								<th>거래처</th>
								<th>금액</th>
								<th>상태</th>
							</tr>
						</thead>
						<tbody>
							{stats.recentOrders &&
								stats.recentOrders.map((order) => (
									<tr key={order.id}>
										<td>{order.date}</td>
										<td>{order.customer || order.vendor || order.account}</td>
										<td>{order.amount}</td>
										<td>
											{order.status && (
												<span className={`status status-${order.status}`}>
													{order.status === "completed"
														? "완료"
														: order.status === "processing"
														? "진행중"
														: "대기중"}
												</span>
											)}
											{order.type && (
												<span
													className={`status ${
														order.type === "수금"
															? "status-completed"
															: "status-pending"
													}`}>
													{order.type}
												</span>
											)}
										</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
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

export default Dashboard;

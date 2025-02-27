import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import {
	FaIndustry,
	FaShoppingCart,
	FaBoxes,
	FaShoppingBag,
	FaChartLine,
	FaExclamationTriangle,
	FaCheckCircle,
	FaClipboardList,
	FaCalendarAlt,
	FaUserFriends,
} from "react-icons/fa";

const Dashboard = () => {
	const [loading, setLoading] = useState(true);
	const [dashboardData, setDashboardData] = useState(null);
	const [selectedPeriod, setSelectedPeriod] = useState("today");

	useEffect(() => {
		// 실제 구현에서는 API 호출로 대체
		const fetchDashboardData = async () => {
			try {
				setLoading(true);
				// 모의 데이터 생성
				const mockData = {
					summary: {
						totalOrders: 152,
						pendingOrders: 28,
						totalRevenue: 45680000,
						averageOrderValue: 300000,
						lowStockItems: 12,
						outOfStockItems: 5,
						productionEfficiency: 87,
						onTimeDelivery: 94,
					},
					recentOrders: [
						{
							id: "ORD-2023-125",
							customer: "테크솔루션 주식회사",
							date: "2023-10-20",
							amount: 1250000,
							status: "completed",
						},
						{
							id: "ORD-2023-124",
							customer: "스마트디바이스 주식회사",
							date: "2023-10-19",
							amount: 850000,
							status: "processing",
						},
						{
							id: "ORD-2023-123",
							customer: "모바일월드 주식회사",
							date: "2023-10-19",
							amount: 1750000,
							status: "pending",
						},
						{
							id: "ORD-2023-122",
							customer: "디지털라이프 주식회사",
							date: "2023-10-18",
							amount: 450000,
							status: "completed",
						},
						{
							id: "ORD-2023-121",
							customer: "테크스토어 주식회사",
							date: "2023-10-18",
							amount: 950000,
							status: "completed",
						},
					],
					inventoryAlerts: [
						{
							id: "INV-003",
							name: "보호필름",
							quantity: 10,
							minStockLevel: 50,
							status: "low-stock",
						},
						{
							id: "INV-004",
							name: "무선 충전기",
							quantity: 0,
							minStockLevel: 15,
							status: "out-of-stock",
						},
						{
							id: "INV-006",
							name: "태블릿 케이스",
							quantity: 5,
							minStockLevel: 25,
							status: "low-stock",
						},
						{
							id: "INV-009",
							name: "웹캠",
							quantity: 0,
							minStockLevel: 15,
							status: "on-order",
						},
					],
					productionStatus: [
						{
							id: "PRD-2023-045",
							product: "스마트폰 모델 A",
							quantity: 500,
							progress: 75,
							dueDate: "2023-10-25",
						},
						{
							id: "PRD-2023-044",
							product: "태블릿 모델 B",
							quantity: 200,
							progress: 90,
							dueDate: "2023-10-22",
						},
						{
							id: "PRD-2023-043",
							product: "스마트워치 모델 C",
							quantity: 300,
							progress: 40,
							dueDate: "2023-10-30",
						},
					],
					salesTrend: {
						labels: [
							"1월",
							"2월",
							"3월",
							"4월",
							"5월",
							"6월",
							"7월",
							"8월",
							"9월",
							"10월",
						],
						data: [
							12500000, 15800000, 14200000, 16500000, 18900000, 17500000,
							19200000, 21500000, 20800000, 22500000,
						],
					},
				};

				setDashboardData(mockData);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching dashboard data:", error);
				setLoading(false);
			}
		};

		fetchDashboardData();
	}, []);

	// 금액 포맷팅 함수
	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("ko-KR", {
			style: "currency",
			currency: "KRW",
		}).format(amount);
	};

	// 날짜 포맷팅 함수
	const formatDate = (dateString) => {
		const options = { year: "numeric", month: "2-digit", day: "2-digit" };
		return new Date(dateString).toLocaleDateString("ko-KR", options);
	};

	// 주문 상태 텍스트 변환 함수
	const getOrderStatusText = (status) => {
		switch (status) {
			case "completed":
				return "완료";
			case "processing":
				return "처리 중";
			case "pending":
				return "대기 중";
			case "cancelled":
				return "취소됨";
			default:
				return status;
		}
	};

	// 주문 상태 클래스 변환 함수
	const getOrderStatusClass = (status) => {
		switch (status) {
			case "completed":
				return "status-completed";
			case "processing":
				return "status-processing";
			case "pending":
				return "status-pending";
			case "cancelled":
				return "status-cancelled";
			default:
				return "";
		}
	};

	// 재고 상태 텍스트 변환 함수
	const getInventoryStatusText = (status) => {
		switch (status) {
			case "in-stock":
				return "재고 있음";
			case "low-stock":
				return "재고 부족";
			case "out-of-stock":
				return "재고 없음";
			case "on-order":
				return "발주 중";
			default:
				return status;
		}
	};

	// 재고 상태 클래스 변환 함수
	const getInventoryStatusClass = (status) => {
		switch (status) {
			case "in-stock":
				return "status-in-stock";
			case "low-stock":
				return "status-low-stock";
			case "out-of-stock":
				return "status-out-of-stock";
			case "on-order":
				return "status-on-order";
			default:
				return "";
		}
	};

	return (
		<div className="dashboard">
			<div className="dashboard-header">
				<h1 className="dashboard-title">대시보드</h1>
				<div className="period-selector">
					<select
						value={selectedPeriod}
						onChange={(e) => setSelectedPeriod(e.target.value)}
						className="period-select">
						<option value="today">오늘</option>
						<option value="yesterday">어제</option>
						<option value="week">이번 주</option>
						<option value="month">이번 달</option>
						<option value="quarter">이번 분기</option>
						<option value="year">올해</option>
					</select>
				</div>
			</div>

			{loading ? (
				<div className="loading-container">
					<div className="loading-spinner"></div>
					<p>데이터를 불러오는 중...</p>
				</div>
			) : dashboardData ? (
				<>
					{/* 요약 카드 섹션 */}
					<div className="summary-cards">
						<div className="summary-card">
							<div className="card-icon orders-icon">
								<FaShoppingCart />
							</div>
							<div className="card-content">
								<h3 className="card-title">총 주문</h3>
								<p className="card-value">
									{dashboardData.summary.totalOrders}
								</p>
								<p className="card-subtitle">
									대기 중: {dashboardData.summary.pendingOrders}
								</p>
							</div>
						</div>

						<div className="summary-card">
							<div className="card-icon revenue-icon">
								<FaChartLine />
							</div>
							<div className="card-content">
								<h3 className="card-title">총 매출</h3>
								<p className="card-value">
									{formatCurrency(dashboardData.summary.totalRevenue)}
								</p>
								<p className="card-subtitle">
									평균 주문액:{" "}
									{formatCurrency(dashboardData.summary.averageOrderValue)}
								</p>
							</div>
						</div>

						<div className="summary-card">
							<div className="card-icon inventory-icon">
								<FaBoxes />
							</div>
							<div className="card-content">
								<h3 className="card-title">재고 알림</h3>
								<p className="card-value">
									{dashboardData.summary.lowStockItems +
										dashboardData.summary.outOfStockItems}
								</p>
								<p className="card-subtitle">
									재고 없음: {dashboardData.summary.outOfStockItems}
								</p>
							</div>
						</div>

						<div className="summary-card">
							<div className="card-icon production-icon">
								<FaIndustry />
							</div>
							<div className="card-content">
								<h3 className="card-title">생산 효율</h3>
								<p className="card-value">
									{dashboardData.summary.productionEfficiency}%
								</p>
								<p className="card-subtitle">
									정시 배송률: {dashboardData.summary.onTimeDelivery}%
								</p>
							</div>
						</div>
					</div>

					<div className="dashboard-content">
						<div className="dashboard-column">
							{/* 최근 주문 섹션 */}
							<div className="dashboard-section">
								<div className="section-header">
									<h2 className="section-title">
										<FaClipboardList className="section-icon" />
										최근 주문
									</h2>
									<Link
										to="/orders"
										className="view-all-link">
										모두 보기
									</Link>
								</div>
								<div className="section-content">
									<table className="dashboard-table">
										<thead>
											<tr>
												<th>주문 ID</th>
												<th>고객</th>
												<th>날짜</th>
												<th>금액</th>
												<th>상태</th>
											</tr>
										</thead>
										<tbody>
											{dashboardData.recentOrders.map((order) => (
												<tr key={order.id}>
													<td>{order.id}</td>
													<td>{order.customer}</td>
													<td>{formatDate(order.date)}</td>
													<td>{formatCurrency(order.amount)}</td>
													<td>
														<span
															className={`status-badge ${getOrderStatusClass(
																order.status
															)}`}>
															{getOrderStatusText(order.status)}
														</span>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>

							{/* 생산 현황 섹션 */}
							<div className="dashboard-section">
								<div className="section-header">
									<h2 className="section-title">
										<FaIndustry className="section-icon" />
										생산 현황
									</h2>
									<Link
										to="/production"
										className="view-all-link">
										모두 보기
									</Link>
								</div>
								<div className="section-content">
									{dashboardData.productionStatus.map((item) => (
										<div
											key={item.id}
											className="production-item">
											<div className="production-info">
												<h3 className="production-title">{item.product}</h3>
												<p className="production-details">
													<span className="production-id">{item.id}</span>
													<span className="production-quantity">
														수량: {item.quantity}
													</span>
													<span className="production-due">
														납기일: {formatDate(item.dueDate)}
													</span>
												</p>
											</div>
											<div className="production-progress-container">
												<div className="production-progress-bar">
													<div
														className="production-progress-fill"
														style={{ width: `${item.progress}%` }}></div>
												</div>
												<span className="production-progress-text">
													{item.progress}%
												</span>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>

						<div className="dashboard-column">
							{/* 재고 알림 섹션 */}
							<div className="dashboard-section">
								<div className="section-header">
									<h2 className="section-title">
										<FaExclamationTriangle className="section-icon" />
										재고 알림
									</h2>
									<Link
										to="/inventory"
										className="view-all-link">
										모두 보기
									</Link>
								</div>
								<div className="section-content">
									<table className="dashboard-table">
										<thead>
											<tr>
												<th>ID</th>
												<th>품목</th>
												<th>수량</th>
												<th>최소 수량</th>
												<th>상태</th>
											</tr>
										</thead>
										<tbody>
											{dashboardData.inventoryAlerts.map((item) => (
												<tr key={item.id}>
													<td>{item.id}</td>
													<td>{item.name}</td>
													<td>{item.quantity}</td>
													<td>{item.minStockLevel}</td>
													<td>
														<span
															className={`status-badge ${getInventoryStatusClass(
																item.status
															)}`}>
															{getInventoryStatusText(item.status)}
														</span>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>

							{/* 매출 추이 차트 */}
							<div className="dashboard-section">
								<div className="section-header">
									<h2 className="section-title">
										<FaChartLine className="section-icon" />
										매출 추이
									</h2>
								</div>
								<div className="section-content">
									<div className="chart-container">
										<div
											className="chart-placeholder"
											style={{
												height: "250px",
												background: "#f5f6fa",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												borderRadius: "8px",
											}}>
											<p>여기에 매출 추이 차트가 표시됩니다.</p>
										</div>
										<div className="chart-legend">
											{dashboardData.salesTrend.labels.map((month, index) => (
												<div
													key={month}
													className="legend-item">
													<div className="legend-month">{month}</div>
													<div className="legend-value">
														{formatCurrency(
															dashboardData.salesTrend.data[index]
														)}
													</div>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>

							{/* 예정된 일정 섹션 */}
							<div className="dashboard-section">
								<div className="section-header">
									<h2 className="section-title">
										<FaCalendarAlt className="section-icon" />
										예정된 일정
									</h2>
								</div>
								<div className="section-content">
									<div className="schedule-list">
										<div className="schedule-item">
											<div className="schedule-date">2023-10-22</div>
											<div className="schedule-content">
												<div className="schedule-title">주간 생산 회의</div>
												<div className="schedule-details">
													오전 10:00 - 회의실 A
												</div>
											</div>
										</div>
										<div className="schedule-item">
											<div className="schedule-date">2023-10-23</div>
											<div className="schedule-content">
												<div className="schedule-title">공급업체 미팅</div>
												<div className="schedule-details">
													오후 2:00 - 화상 회의
												</div>
											</div>
										</div>
										<div className="schedule-item">
											<div className="schedule-date">2023-10-25</div>
											<div className="schedule-content">
												<div className="schedule-title">재고 실사</div>
												<div className="schedule-details">오전 9:00 - 창고</div>
											</div>
										</div>
										<div className="schedule-item">
											<div className="schedule-date">2023-10-27</div>
											<div className="schedule-content">
												<div className="schedule-title">월간 성과 보고</div>
												<div className="schedule-details">
													오후 3:00 - 회의실 B
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* 빠른 액세스 섹션 */}
					<div className="quick-access-section">
						<h2 className="section-title">빠른 액세스</h2>
						<div className="quick-access-buttons">
							<Link
								to="/orders/create"
								className="quick-access-button">
								<FaShoppingCart className="quick-access-icon" />
								<span className="quick-access-text">새 주문 생성</span>
							</Link>
							<Link
								to="/inventory/create"
								className="quick-access-button">
								<FaBoxes className="quick-access-icon" />
								<span className="quick-access-text">재고 항목 추가</span>
							</Link>
							<Link
								to="/production/create"
								className="quick-access-button">
								<FaIndustry className="quick-access-icon" />
								<span className="quick-access-text">생산 계획 생성</span>
							</Link>
							<Link
								to="/purchase/create"
								className="quick-access-button">
								<FaShoppingBag className="quick-access-icon" />
								<span className="quick-access-text">발주서 생성</span>
							</Link>
							<Link
								to="/customers/create"
								className="quick-access-button">
								<FaUserFriends className="quick-access-icon" />
								<span className="quick-access-text">고객 추가</span>
							</Link>
							<Link
								to="/reports/generate"
								className="quick-access-button">
								<FaClipboardList className="quick-access-icon" />
								<span className="quick-access-text">보고서 생성</span>
							</Link>
						</div>
					</div>
				</>
			) : (
				<div className="error-container">
					<p>데이터를 불러오는 중 오류가 발생했습니다.</p>
					<button
						className="btn btn-primary"
						onClick={() => window.location.reload()}>
						다시 시도
					</button>
				</div>
			)}
		</div>
	);
};

export default Dashboard;

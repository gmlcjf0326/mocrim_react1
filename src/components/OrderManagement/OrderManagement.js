import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import "./OrderManagement.css";

/**
 * OrderManagement Component
 *
 * Comprehensive component for managing customer orders, shipping, and fulfillment
 * with real-time status tracking and inventory integration.
 */
const OrderManagement = () => {
	const [orders, setOrders] = useState([]);
	const [filteredOrders, setFilteredOrders] = useState([]);
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [orderDetails, setOrderDetails] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [dateRange, setDateRange] = useState({
		start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
			.toISOString()
			.split("T")[0], // 30 days ago
		end: new Date().toISOString().split("T")[0], // today
	});
	const [loading, setLoading] = useState({
		orders: false,
		details: false,
		inventory: false,
	});
	const [error, setError] = useState({
		orders: null,
		details: null,
		inventory: null,
	});
	const [showNewOrderModal, setShowNewOrderModal] = useState(false);
	const [productsInventory, setProductsInventory] = useState([]);

	// Mock data for orders
	const mockOrders = [
		{
			id: 1,
			orderNumber: "SO-2025022501",
			customer: "우성목재",
			orderDate: "2025-02-25",
			dueDate: "2025-03-02",
			totalAmount: 3680000,
			status: "pending",
		},
		{
			id: 2,
			orderNumber: "SO-2025022401",
			customer: "대림가구",
			orderDate: "2025-02-24",
			dueDate: "2025-03-01",
			totalAmount: 4260000,
			status: "processing",
		},
		{
			id: 3,
			orderNumber: "SO-2025022301",
			customer: "LG하우시스",
			orderDate: "2025-02-23",
			dueDate: "2025-02-28",
			totalAmount: 5120000,
			status: "shipped",
		},
		{
			id: 4,
			orderNumber: "SO-2025022201",
			customer: "삼성인테리어",
			orderDate: "2025-02-22",
			dueDate: "2025-02-27",
			totalAmount: 2950000,
			status: "completed",
		},
	];

	// Mock data for order details
	const mockOrderDetails = {
		1: {
			id: 1,
			orderNumber: "SO-2025022501",
			customer: "우성목재",
			customerContact: "042-123-4567",
			customerEmail: "sales@woosung.co.kr",
			shippingAddress: "대전시 서구 갈마동 123",
			billingAddress: "대전시 서구 갈마동 123",
			orderDate: "2025-02-25",
			dueDate: "2025-03-02",
			status: "pending",
			paymentMethod: "계좌이체",
			paymentStatus: "미결제",
			totalAmount: 3680000,
			taxAmount: 368000,
			shippingAmount: 50000,
			discountAmount: 0,
			notes: "배송 전 연락 요망",
			items: [
				{
					id: 1,
					productCode: "P001",
					name: "3808-3/양면 E0 18mm",
					quantity: 50,
					unitPrice: 45000,
					amount: 2250000,
				},
				{
					id: 2,
					productCode: "P002",
					name: "UV무늬목 15mm",
					quantity: 25,
					unitPrice: 55000,
					amount: 1375000,
				},
			],
			history: [
				{
					id: 1,
					date: "2025-02-25 09:30",
					user: "김판매",
					action: "주문 접수",
					notes: "고객 주문 접수",
				},
			],
		},
		2: {
			id: 2,
			orderNumber: "SO-2025022401",
			customer: "대림가구",
			customerContact: "02-234-5678",
			customerEmail: "purchase@daelim.co.kr",
			shippingAddress: "서울시 금천구 가산로 456",
			billingAddress: "서울시 금천구 가산로 456",
			orderDate: "2025-02-24",
			dueDate: "2025-03-01",
			status: "processing",
			paymentMethod: "법인카드",
			paymentStatus: "결제완료",
			totalAmount: 4260000,
			taxAmount: 426000,
			shippingAmount: 60000,
			discountAmount: 100000,
			notes: "품질검수 필요",
			items: [
				{
					id: 3,
					productCode: "P003",
					name: "방염합판 9mm",
					quantity: 30,
					unitPrice: 62000,
					amount: 1860000,
				},
				{
					id: 4,
					productCode: "P004",
					name: "씽크대문짝 W600",
					quantity: 60,
					unitPrice: 38000,
					amount: 2280000,
				},
			],
			history: [
				{
					id: 2,
					date: "2025-02-24 10:15",
					user: "김판매",
					action: "주문 접수",
					notes: "고객 주문 접수",
				},
				{
					id: 3,
					date: "2025-02-24 14:30",
					user: "이경리",
					action: "결제 확인",
					notes: "법인카드 결제 확인",
				},
				{
					id: 4,
					date: "2025-02-25 09:10",
					user: "박생산",
					action: "생산 시작",
					notes: "생산 작업 시작",
				},
			],
		},
	};

	// Mock inventory data
	const mockInventory = [
		{
			id: 1,
			code: "P001",
			name: "3808-3/양면 E0 18mm",
			stock: 120,
			unit: "장",
			status: "normal",
		},
		{
			id: 2,
			code: "P002",
			name: "UV무늬목 15mm",
			stock: 80,
			unit: "장",
			status: "normal",
		},
		{
			id: 3,
			code: "P003",
			name: "방염합판 9mm",
			stock: 30,
			unit: "장",
			status: "warning",
		},
		{
			id: 4,
			code: "P004",
			name: "씽크대문짝 W600",
			stock: 35,
			unit: "개",
			status: "normal",
		},
	];

	// Status options for filtering
	const statusOptions = [
		{ id: "all", name: "전체" },
		{ id: "pending", name: "접수" },
		{ id: "processing", name: "처리중" },
		{ id: "shipped", name: "출고완료" },
		{ id: "completed", name: "완료" },
		{ id: "cancelled", name: "취소" },
	];

	// Load orders on mount
	useEffect(() => {
		const fetchOrders = async () => {
			setLoading((prev) => ({ ...prev, orders: true }));
			try {
				// In a real application, this would be an API call
				// const response = await api.getOrders();
				// setOrders(response.data);

				// Using mock data for demonstration
				setTimeout(() => {
					setOrders(mockOrders);
					setError((prev) => ({ ...prev, orders: null }));
					setLoading((prev) => ({ ...prev, orders: false }));
				}, 500);
			} catch (err) {
				setError((prev) => ({ ...prev, orders: "Failed to load orders" }));
				setLoading((prev) => ({ ...prev, orders: false }));
			}
		};

		fetchOrders();
	}, []);

	// Load inventory data
	useEffect(() => {
		const fetchInventory = async () => {
			setLoading((prev) => ({ ...prev, inventory: true }));
			try {
				// In a real application, this would be an API call
				// const response = await api.getProductsInventory();
				// setProductsInventory(response.data);

				// Using mock data for demonstration
				setTimeout(() => {
					setProductsInventory(mockInventory);
					setError((prev) => ({ ...prev, inventory: null }));
					setLoading((prev) => ({ ...prev, inventory: false }));
				}, 500);
			} catch (err) {
				setError((prev) => ({
					...prev,
					inventory: "Failed to load inventory data",
				}));
				setLoading((prev) => ({ ...prev, inventory: false }));
			}
		};

		fetchInventory();
	}, []);

	// Filter orders based on search term, date range, and status
	useEffect(() => {
		if (!orders || orders.length === 0) return;

		let filtered = [...orders];

		// Apply search term filter
		if (searchTerm) {
			filtered = filtered.filter(
				(order) =>
					order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
					order.customer.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// Apply date range filter
		if (dateRange.start && dateRange.end) {
			filtered = filtered.filter((order) => {
				const orderDate = new Date(order.orderDate);
				const startDate = new Date(dateRange.start);
				const endDate = new Date(dateRange.end);
				endDate.setHours(23, 59, 59); // Include the end date fully

				return orderDate >= startDate && orderDate <= endDate;
			});
		}

		// Apply status filter
		if (statusFilter !== "all") {
			filtered = filtered.filter((order) => order.status === statusFilter);
		}

		setFilteredOrders(filtered);

		// Auto-select first order if available and none selected
		if (filtered.length > 0 && !selectedOrder) {
			handleOrderSelect(filtered[0]);
		}
	}, [searchTerm, dateRange, statusFilter, orders, selectedOrder]);

	// Load order details when an order is selected
	useEffect(() => {
		if (!selectedOrder) return;

		const fetchOrderDetails = async () => {
			setLoading((prev) => ({ ...prev, details: true }));
			try {
				// In a real application, this would be an API call
				// const response = await api.getOrderDetails(selectedOrder.id);
				// setOrderDetails(response.data);

				// Using mock data for demonstration
				setTimeout(() => {
					setOrderDetails(mockOrderDetails[selectedOrder.id] || null);
					setError((prev) => ({ ...prev, details: null }));
					setLoading((prev) => ({ ...prev, details: false }));
				}, 300);
			} catch (err) {
				setError((prev) => ({
					...prev,
					details: "Failed to load order details",
				}));
				setLoading((prev) => ({ ...prev, details: false }));
			}
		};

		fetchOrderDetails();
	}, [selectedOrder]);

	// Handle order selection
	const handleOrderSelect = useCallback((order) => {
		setSelectedOrder(order);
	}, []);

	// Handle search input change
	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};

	// Handle search form submit
	const handleSearchSubmit = (e) => {
		e.preventDefault();
		// Current implementation already filters as the user types
	};

	// Handle date range change
	const handleDateRangeChange = (field, value) => {
		setDateRange((prev) => ({ ...prev, [field]: value }));
	};

	// Handle status filter change
	const handleStatusFilterChange = (e) => {
		setStatusFilter(e.target.value);
	};

	// Format currency for display
	const formatCurrency = (amount) => {
		return amount.toLocaleString("ko-KR") + "원";
	};

	// Format date for display
	const formatDate = (dateString) => {
		const options = { year: "numeric", month: "2-digit", day: "2-digit" };
		return new Date(dateString).toLocaleDateString("ko-KR", options);
	};

	// Get status badge for rendering
	const getStatusBadge = (status) => {
		switch (status) {
			case "pending":
				return <span className="status-badge status-pending">접수</span>;
			case "processing":
				return <span className="status-badge status-processing">처리중</span>;
			case "shipped":
				return <span className="status-badge status-shipped">출고완료</span>;
			case "completed":
				return <span className="status-badge status-completed">완료</span>;
			case "cancelled":
				return <span className="status-badge status-cancelled">취소</span>;
			default:
				return <span className="status-badge">{status}</span>;
		}
	};

	// Check if item is in stock
	const checkStockStatus = (productCode, quantity) => {
		const product = productsInventory.find((p) => p.code === productCode);

		if (!product) return { inStock: false, status: "unknown" };

		if (product.stock >= quantity) {
			return { inStock: true, status: "normal" };
		} else if (product.stock > 0) {
			return { inStock: false, status: "partial", available: product.stock };
		} else {
			return { inStock: false, status: "outOfStock" };
		}
	};

	// Render order list table
	const renderOrderList = () => {
		if (loading.orders) {
			return <div className="loading-indicator">Loading orders...</div>;
		}

		if (error.orders) {
			return <div className="error-message">{error.orders}</div>;
		}

		if (filteredOrders.length === 0) {
			return <div className="no-data">검색 결과가 없습니다.</div>;
		}

		return (
			<table className="order-table">
				<thead>
					<tr>
						<th>주문번호</th>
						<th>거래처</th>
						<th>주문일자</th>
						<th>납기일</th>
						<th>금액</th>
						<th>상태</th>
					</tr>
				</thead>
				<tbody>
					{filteredOrders.map((order) => (
						<tr
							key={order.id}
							className={`order-item ${
								selectedOrder?.id === order.id ? "selected" : ""
							}`}
							onClick={() => handleOrderSelect(order)}>
							<td>{order.orderNumber}</td>
							<td>{order.customer}</td>
							<td>{formatDate(order.orderDate)}</td>
							<td>{formatDate(order.dueDate)}</td>
							<td>{formatCurrency(order.totalAmount)}</td>
							<td>{getStatusBadge(order.status)}</td>
						</tr>
					))}
				</tbody>
			</table>
		);
	};

	// Render order details section
	const renderOrderDetails = () => {
		if (!selectedOrder) {
			return (
				<div className="no-data">주문 정보를 확인하려면 주문을 선택하세요.</div>
			);
		}

		if (loading.details) {
			return <div className="loading-indicator">Loading order details...</div>;
		}

		if (error.details) {
			return <div className="error-message">{error.details}</div>;
		}

		if (!orderDetails) {
			return <div className="no-data">상세 정보가 없습니다.</div>;
		}

		return (
			<div className="order-details">
				<h3 className="details-title">주문 상세 정보</h3>

				<div className="details-section">
					<h4 className="section-subtitle">기본 정보</h4>
					<div className="details-grid">
						<div className="details-item">
							<span className="details-label">주문번호:</span>
							<span className="details-value">{orderDetails.orderNumber}</span>
						</div>
						<div className="details-item">
							<span className="details-label">거래처:</span>
							<span className="details-value">{orderDetails.customer}</span>
						</div>
						<div className="details-item">
							<span className="details-label">연락처:</span>
							<span className="details-value">
								{orderDetails.customerContact}
							</span>
						</div>
						<div className="details-item">
							<span className="details-label">이메일:</span>
							<span className="details-value">
								{orderDetails.customerEmail}
							</span>
						</div>
						<div className="details-item">
							<span className="details-label">주문일자:</span>
							<span className="details-value">
								{formatDate(orderDetails.orderDate)}
							</span>
						</div>
						<div className="details-item">
							<span className="details-label">납기일:</span>
							<span className="details-value">
								{formatDate(orderDetails.dueDate)}
							</span>
						</div>
						<div className="details-item">
							<span className="details-label">상태:</span>
							<span className="details-value">
								{getStatusBadge(orderDetails.status)}
							</span>
						</div>
						<div className="details-item">
							<span className="details-label">특이사항:</span>
							<span className="details-value">{orderDetails.notes || "-"}</span>
						</div>
					</div>
				</div>

				<div className="details-section">
					<h4 className="section-subtitle">배송 및 결제 정보</h4>
					<div className="details-grid">
						<div className="details-item">
							<span className="details-label">배송지:</span>
							<span className="details-value">
								{orderDetails.shippingAddress}
							</span>
						</div>
						<div className="details-item">
							<span className="details-label">청구지:</span>
							<span className="details-value">
								{orderDetails.billingAddress}
							</span>
						</div>
						<div className="details-item">
							<span className="details-label">결제방법:</span>
							<span className="details-value">
								{orderDetails.paymentMethod}
							</span>
						</div>
						<div className="details-item">
							<span className="details-label">결제상태:</span>
							<span className="details-value">
								{orderDetails.paymentStatus}
							</span>
						</div>
					</div>
				</div>

				<div className="details-section">
					<h4 className="section-subtitle">주문 상품</h4>
					<table className="order-items-table">
						<thead>
							<tr>
								<th>제품코드</th>
								<th>제품명</th>
								<th>수량</th>
								<th>단가</th>
								<th>금액</th>
								<th>재고상태</th>
							</tr>
						</thead>
						<tbody>
							{orderDetails.items.map((item) => {
								const stockStatus = checkStockStatus(
									item.productCode,
									item.quantity
								);
								return (
									<tr key={item.id}>
										<td>{item.productCode}</td>
										<td>{item.name}</td>
										<td>{item.quantity}</td>
										<td>{formatCurrency(item.unitPrice)}</td>
										<td>{formatCurrency(item.amount)}</td>
										<td>
											{stockStatus.inStock ? (
												<span className="stock-status in-stock">재고 있음</span>
											) : stockStatus.status === "partial" ? (
												<span className="stock-status partial-stock">
													일부 재고 ({stockStatus.available})
												</span>
											) : stockStatus.status === "outOfStock" ? (
												<span className="stock-status out-of-stock">
													재고 없음
												</span>
											) : (
												<span className="stock-status unknown">확인 필요</span>
											)}
										</td>
									</tr>
								);
							})}
						</tbody>
						<tfoot>
							<tr>
								<td
									colSpan="4"
									className="summary-label">
									소계
								</td>
								<td
									colSpan="2"
									className="summary-value">
									{formatCurrency(
										orderDetails.totalAmount -
											orderDetails.taxAmount -
											orderDetails.shippingAmount +
											orderDetails.discountAmount
									)}
								</td>
							</tr>
							<tr>
								<td
									colSpan="4"
									className="summary-label">
									부가세
								</td>
								<td
									colSpan="2"
									className="summary-value">
									{formatCurrency(orderDetails.taxAmount)}
								</td>
							</tr>
							<tr>
								<td
									colSpan="4"
									className="summary-label">
									배송비
								</td>
								<td
									colSpan="2"
									className="summary-value">
									{formatCurrency(orderDetails.shippingAmount)}
								</td>
							</tr>
							{orderDetails.discountAmount > 0 && (
								<tr>
									<td
										colSpan="4"
										className="summary-label">
										할인
									</td>
									<td
										colSpan="2"
										className="summary-value">
										- {formatCurrency(orderDetails.discountAmount)}
									</td>
								</tr>
							)}
							<tr className="total-row">
								<td
									colSpan="4"
									className="summary-label">
									총 금액
								</td>
								<td
									colSpan="2"
									className="summary-value">
									{formatCurrency(orderDetails.totalAmount)}
								</td>
							</tr>
						</tfoot>
					</table>
				</div>

				<div className="details-section">
					<h4 className="section-subtitle">주문 처리 내역</h4>
					{orderDetails.history && orderDetails.history.length > 0 ? (
						<table className="order-history-table">
							<thead>
								<tr>
									<th>날짜</th>
									<th>담당자</th>
									<th>처리내용</th>
									<th>비고</th>
								</tr>
							</thead>
							<tbody>
								{orderDetails.history.map((history) => (
									<tr key={history.id}>
										<td>{history.date}</td>
										<td>{history.user}</td>
										<td>{history.action}</td>
										<td>{history.notes}</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<div className="no-data">처리 내역이 없습니다.</div>
					)}
				</div>
			</div>
		);
	};

	// Render inventory status
	const renderInventoryStatus = () => {
		if (loading.inventory) {
			return (
				<div className="loading-indicator">Loading inventory status...</div>
			);
		}

		if (error.inventory) {
			return <div className="error-message">{error.inventory}</div>;
		}

		if (!productsInventory || productsInventory.length === 0) {
			return <div className="no-data">재고 정보가 없습니다.</div>;
		}

		return (
			<div className="inventory-status">
				<h3 className="section-title">재고 현황</h3>
				<table className="inventory-table">
					<thead>
						<tr>
							<th>제품코드</th>
							<th>제품명</th>
							<th>재고</th>
							<th>상태</th>
						</tr>
					</thead>
					<tbody>
						{productsInventory.map((product) => (
							<tr key={product.id}>
								<td>{product.code}</td>
								<td>{product.name}</td>
								<td>
									{product.stock} {product.unit}
								</td>
								<td>
									<span className={`status-badge status-${product.status}`}>
										{product.status === "normal"
											? "정상"
											: product.status === "warning"
											? "요주의"
											: "부족"}
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	};

	return (
		<div className="order-management">
			{/* Header section with filters */}
			<div className="order-header">
				<h2 className="module-title">수주 관리</h2>

				<div className="order-filters">
					<form
						onSubmit={handleSearchSubmit}
						className="search-form">
						<input
							type="text"
							className="search-input"
							placeholder="주문번호, 거래처명 검색"
							value={searchTerm}
							onChange={handleSearchChange}
						/>
						<button
							type="submit"
							className="search-button">
							검색
						</button>
					</form>

					<div className="filter-selects">
						<div className="filter-group date-range">
							<label>기간:</label>
							<input
								type="date"
								className="date-input"
								value={dateRange.start}
								onChange={(e) => handleDateRangeChange("start", e.target.value)}
							/>
							<span className="date-separator">~</span>
							<input
								type="date"
								className="date-input"
								value={dateRange.end}
								onChange={(e) => handleDateRangeChange("end", e.target.value)}
							/>
						</div>

						<div className="filter-group">
							<label htmlFor="status-filter">상태:</label>
							<select
								id="status-filter"
								className="filter-select"
								value={statusFilter}
								onChange={handleStatusFilterChange}>
								{statusOptions.map((option) => (
									<option
										key={option.id}
										value={option.id}>
										{option.name}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>

				<div className="order-actions">
					<button
						className="btn btn-primary"
						onClick={() => setShowNewOrderModal(true)}>
						새 주문 등록
					</button>
				</div>
			</div>

			{/* Main content area */}
			<div className="order-content">
				{/* Order list section */}
				<div className="order-list-section">{renderOrderList()}</div>

				{/* Order details section */}
				<div className="order-details-section">{renderOrderDetails()}</div>
			</div>

			{/* Inventory status section */}
			<div className="inventory-section">{renderInventoryStatus()}</div>

			{/* Action buttons for selected order */}
			{selectedOrder && (
				<div className="action-buttons">
					{selectedOrder.status === "pending" && (
						<button className="action-button process-button">주문 처리</button>
					)}
					{selectedOrder.status === "processing" && (
						<button className="action-button ship-button">출고 처리</button>
					)}
					{selectedOrder.status === "shipped" && (
						<button className="action-button complete-button">완료 처리</button>
					)}
					<button className="action-button edit-button">정보 수정</button>
					<button className="action-button print-button">
						거래명세서 출력
					</button>
					{selectedOrder.status === "pending" && (
						<button className="action-button cancel-button">주문 취소</button>
					)}
				</div>
			)}
		</div>
	);
};

export default OrderManagement;

import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import "./ProductionManagement.css";

/**
 * ProductionManagement Component
 *
 * A comprehensive component for managing production processes, including
 * in-house manufacturing at WoodEsty and outsourced processing at partner facilities.
 */
const ProductionManagement = ({ initialProductionType = "woodesty" }) => {
	// State management
	const [productionType, setProductionType] = useState(initialProductionType);
	const [productionOrders, setProductionOrders] = useState([]);
	const [filteredOrders, setFilteredOrders] = useState([]);
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [dateRange, setDateRange] = useState({
		start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
			.toISOString()
			.split("T")[0], // 7 days ago
		end: new Date().toISOString().split("T")[0], // today
	});
	const [orderDetails, setOrderDetails] = useState(null);
	const [materials, setMaterials] = useState([]);
	const [processorInventory, setProcessorInventory] = useState([]);
	const [loading, setLoading] = useState({
		orders: false,
		details: false,
		materials: false,
		inventory: false,
	});
	const [error, setError] = useState({
		orders: null,
		details: null,
		materials: null,
		inventory: null,
	});
	const [showNewOrderModal, setShowNewOrderModal] = useState(false);
	const [newOrderForm, setNewOrderForm] = useState({
		productType: "",
		quantity: "",
		dueDate: "",
		processor: productionType,
		materials: [],
	});

	// Mock data for production orders
	const mockProductionOrders = {
		woodesty: [
			{
				id: 1,
				orderNumber: "PR-2025022501",
				productType: "3808-3/양면 E0 18mm",
				quantity: 120,
				orderDate: "2025-02-25",
				dueDate: "2025-02-28",
				status: "processing",
				customer: "우성목재",
			},
			{
				id: 2,
				orderNumber: "PR-2025022401",
				productType: "UV무늬목 15mm",
				quantity: 80,
				orderDate: "2025-02-24",
				dueDate: "2025-02-27",
				status: "completed",
				customer: "대림가구",
			},
			{
				id: 3,
				orderNumber: "PR-2025022301",
				productType: "3808-3/양면 E0 18mm",
				quantity: 100,
				orderDate: "2025-02-23",
				dueDate: "2025-02-26",
				status: "completed",
				customer: "LG하우시스",
			},
		],
		outsourced: [
			{
				id: 4,
				orderNumber: "PR-2025022502",
				productType: "방염합판 9mm",
				quantity: 200,
				orderDate: "2025-02-25",
				dueDate: "2025-03-02",
				status: "processing",
				processor: "A임가공",
				customer: "삼성인테리어",
			},
			{
				id: 5,
				orderNumber: "PR-2025022402",
				productType: "방염합판 9mm",
				quantity: 150,
				orderDate: "2025-02-24",
				dueDate: "2025-03-01",
				status: "processing",
				processor: "A임가공",
				customer: "LG하우시스",
			},
			{
				id: 6,
				orderNumber: "PR-2025022302",
				productType: "PB E1 양면",
				quantity: 180,
				orderDate: "2025-02-23",
				dueDate: "2025-02-28",
				status: "completed",
				processor: "B임가공",
				customer: "현대리빙",
			},
		],
		daehwadong: [
			{
				id: 7,
				orderNumber: "PR-2025022503",
				productType: "씽크대문짝 W600",
				quantity: 35,
				orderDate: "2025-02-25",
				dueDate: "2025-02-27",
				status: "pending",
				customer: "대림가구",
			},
			{
				id: 8,
				orderNumber: "PR-2025022303",
				productType: "씽크대문짝 W450",
				quantity: 50,
				orderDate: "2025-02-23",
				dueDate: "2025-02-26",
				status: "completed",
				customer: "현대리빙",
			},
		],
	};

	// Mock data for order details
	const mockOrderDetails = {
		1: {
			id: 1,
			orderNumber: "PR-2025022501",
			productType: "3808-3/양면 E0 18mm",
			category: "laminated-board",
			quantity: 120,
			unit: "장",
			orderDate: "2025-02-25",
			dueDate: "2025-02-28",
			status: "processing",
			customer: "우성목재",
			customerContact: "042-123-4567",
			deliveryAddress: "대전시 서구 갈마동 123",
			specialInstructions: "모서리 마감 처리 필요",
			assignedStaff: "김생산",
			estimatedCompletionTime: "2025-02-27 14:00",
			productionStage: "코팅",
			qualityCheck: false,
			packagingRequirements: "표준 포장",
			materials: [
				{
					id: 1,
					code: "RM-1001",
					name: "PB E0 18mm",
					quantity: 120,
					unit: "장",
					status: "allocated",
				},
				{
					id: 2,
					code: "RM-2001",
					name: "TL-400(친환경)",
					quantity: 43.2,
					unit: "통",
					status: "allocated",
				},
				{
					id: 3,
					code: "RM-3001",
					name: "3808-3(DH-JO-11) O/L",
					quantity: 240,
					unit: "장",
					status: "allocated",
				},
			],
			history: [
				{
					id: 1,
					date: "2025-02-25 09:30",
					staff: "이지원",
					stage: "접수",
					notes: "생산 주문 접수",
				},
				{
					id: 2,
					date: "2025-02-25 10:15",
					staff: "김생산",
					stage: "자재확인",
					notes: "원자재 할당 완료",
				},
				{
					id: 3,
					date: "2025-02-25 11:00",
					staff: "김생산",
					stage: "생산시작",
					notes: "원목 재단 작업 시작",
				},
				{
					id: 4,
					date: "2025-02-25 15:30",
					staff: "김생산",
					stage: "코팅",
					notes: "양면 코팅 작업 중",
				},
			],
		},
		4: {
			id: 4,
			orderNumber: "PR-2025022502",
			productType: "방염합판 9mm",
			category: "fire-resistant-board",
			quantity: 200,
			unit: "장",
			orderDate: "2025-02-25",
			dueDate: "2025-03-02",
			status: "processing",
			processor: "A임가공",
			processorContact: "031-456-7890",
			processorAddress: "경기도 시흥시 공단로 123",
			customer: "삼성인테리어",
			customerContact: "02-345-6789",
			deliveryAddress: "서울시 강남구 삼성동 456",
			specialInstructions: "방염 처리 필수",
			assignedStaff: "박외주",
			estimatedCompletionTime: "2025-03-01 16:00",
			productionStage: "생산중",
			qualityCheck: false,
			packagingRequirements: "방수 포장",
			materials: [
				{
					id: 4,
					code: "RM-1003",
					name: "PB 9mm",
					quantity: 200,
					unit: "장",
					status: "allocated",
				},
				{
					id: 5,
					code: "RM-2002",
					name: "방염제 FR-100",
					quantity: 40,
					unit: "통",
					status: "allocated",
				},
			],
			history: [
				{
					id: 5,
					date: "2025-02-25 10:00",
					staff: "박외주",
					stage: "접수",
					notes: "외주 생산 주문 접수",
				},
				{
					id: 6,
					date: "2025-02-25 11:30",
					staff: "박외주",
					stage: "자재배분",
					notes: "A임가공업체에 원자재 배분 완료",
				},
				{
					id: 7,
					date: "2025-02-25 14:00",
					staff: "김임가",
					stage: "생산시작",
					notes: "A임가공업체 생산 시작",
				},
			],
		},
		7: {
			id: 7,
			orderNumber: "PR-2025022503",
			productType: "씽크대문짝 W600",
			category: "door",
			quantity: 35,
			unit: "개",
			orderDate: "2025-02-25",
			dueDate: "2025-02-27",
			status: "pending",
			customer: "대림가구",
			customerContact: "02-567-8901",
			deliveryAddress: "서울시 구로구 디지털로 789",
			specialInstructions: "손잡이 구멍 없이 제작",
			assignedStaff: "최문짝",
			productionStage: "대기중",
			qualityCheck: false,
			packagingRequirements: "개별 포장",
			materials: [
				{
					id: 6,
					code: "RM-1004",
					name: "MDF 18mm",
					quantity: 35,
					unit: "장",
					status: "pending",
				},
				{
					id: 7,
					code: "RM-3002",
					name: "백색 시트지",
					quantity: 70,
					unit: "장",
					status: "pending",
				},
			],
			history: [
				{
					id: 8,
					date: "2025-02-25 11:00",
					staff: "최문짝",
					stage: "접수",
					notes: "문짝 생산 주문 접수",
				},
			],
		},
	};

	// Mock data for materials
	const mockMaterials = {
		woodesty: [
			{
				id: 1,
				code: "RM-1001",
				name: "PB E0 18mm",
				stock: 850,
				unit: "장",
				minStock: 500,
				status: "normal",
			},
			{
				id: 2,
				code: "RM-2001",
				name: "TL-400(친환경)",
				stock: 120,
				unit: "통",
				minStock: 100,
				status: "normal",
			},
			{
				id: 3,
				code: "RM-3001",
				name: "3808-3(DH-JO-11) O/L",
				stock: 150,
				unit: "장",
				minStock: 200,
				status: "warning",
			},
		],
		outsourced: {
			A임가공: [
				{
					id: 4,
					code: "RM-1003",
					name: "PB 9mm",
					stock: 200,
					unit: "장",
					minStock: 150,
					status: "normal",
				},
				{
					id: 5,
					code: "RM-2002",
					name: "방염제 FR-100",
					stock: 40,
					unit: "통",
					minStock: 30,
					status: "normal",
				},
			],
			B임가공: [
				{
					id: 8,
					code: "RM-1002",
					name: "PB E1 15mm",
					stock: 120,
					unit: "장",
					minStock: 100,
					status: "normal",
				},
				{
					id: 9,
					code: "RM-3003",
					name: "UV코팅지",
					stock: 80,
					unit: "장",
					minStock: 100,
					status: "warning",
				},
			],
		},
		daehwadong: [
			{
				id: 6,
				code: "RM-1004",
				name: "MDF 18mm",
				stock: 150,
				unit: "장",
				minStock: 100,
				status: "normal",
			},
			{
				id: 7,
				code: "RM-3002",
				name: "백색 시트지",
				stock: 300,
				unit: "장",
				minStock: 200,
				status: "normal",
			},
		],
	};

	// Status options for filtering
	const statusOptions = [
		{ id: "all", name: "전체" },
		{ id: "pending", name: "대기중" },
		{ id: "processing", name: "작업중" },
		{ id: "completed", name: "완료" },
	];

	// Production type options
	const productionTypeOptions = [
		{ id: "woodesty", name: "우드에스티" },
		{ id: "outsourced", name: "외부임가공" },
		{ id: "daehwadong", name: "대화동공장" },
	];

	// Load production orders based on production type
	useEffect(() => {
		const fetchProductionOrders = async () => {
			setLoading((prev) => ({ ...prev, orders: true }));
			try {
				// In a real application, this would be an API call
				// const response = await api.getProductionOrders(productionType);
				// setProductionOrders(response.data);

				// Using mock data for demonstration
				setProductionOrders(mockProductionOrders[productionType] || []);
				setError((prev) => ({ ...prev, orders: null }));
			} catch (err) {
				setError((prev) => ({
					...prev,
					orders: "Failed to load production orders",
				}));
			} finally {
				setLoading((prev) => ({ ...prev, orders: false }));
			}
		};

		fetchProductionOrders();
		// Reset selections when production type changes
		setSelectedOrder(null);
		setOrderDetails(null);
	}, [productionType]);

	// Load materials based on production type
	useEffect(() => {
		const fetchMaterials = async () => {
			setLoading((prev) => ({ ...prev, materials: true }));
			try {
				// In a real application, this would be an API call
				// const response = await api.getMaterials(productionType);
				// setMaterials(response.data);

				// Using mock data for demonstration
				setMaterials(mockMaterials[productionType] || []);
				setError((prev) => ({ ...prev, materials: null }));
			} catch (err) {
				setError((prev) => ({
					...prev,
					materials: "Failed to load materials",
				}));
			} finally {
				setLoading((prev) => ({ ...prev, materials: false }));
			}
		};

		fetchMaterials();
	}, [productionType]);

	// Filter orders based on search term, date range, and status
	useEffect(() => {
		if (!productionOrders || productionOrders.length === 0) return;

		let filtered = [...productionOrders];

		// Apply search term filter
		if (searchTerm) {
			filtered = filtered.filter(
				(order) =>
					order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
					order.productType.toLowerCase().includes(searchTerm.toLowerCase()) ||
					(order.customer &&
						order.customer.toLowerCase().includes(searchTerm.toLowerCase())) ||
					(order.processor &&
						order.processor.toLowerCase().includes(searchTerm.toLowerCase()))
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
	}, [searchTerm, dateRange, statusFilter, productionOrders, selectedOrder]);

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
				setOrderDetails(mockOrderDetails[selectedOrder.id] || null);
				setError((prev) => ({ ...prev, details: null }));
			} catch (err) {
				setError((prev) => ({
					...prev,
					details: "Failed to load order details",
				}));
			} finally {
				setLoading((prev) => ({ ...prev, details: false }));
			}
		};

		// Load processor inventory for outsourced production orders
		const fetchProcessorInventory = async () => {
			if (productionType !== "outsourced" || !selectedOrder.processor) return;

			setLoading((prev) => ({ ...prev, inventory: true }));
			try {
				// In a real application, this would be an API call
				// const response = await api.getProcessorInventory(selectedOrder.processor);
				// setProcessorInventory(response.data);

				// Using mock data for demonstration
				setProcessorInventory(
					mockMaterials.outsourced[selectedOrder.processor] || []
				);
				setError((prev) => ({ ...prev, inventory: null }));
			} catch (err) {
				setError((prev) => ({
					...prev,
					inventory: "Failed to load processor inventory",
				}));
			} finally {
				setLoading((prev) => ({ ...prev, inventory: false }));
			}
		};

		fetchOrderDetails();
		fetchProcessorInventory();
	}, [selectedOrder, productionType]);

	// Toggle production type
	const handleProductionTypeToggle = (type) => {
		if (type !== productionType) {
			setProductionType(type);
			// Reset filters
			setSearchTerm("");
			setStatusFilter("all");
		}
	};

	// Handle order selection
	const handleOrderSelect = (order) => {
		setSelectedOrder(order);
	};

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

	// Handle new order form change
	const handleNewOrderFormChange = (field, value) => {
		setNewOrderForm((prev) => ({ ...prev, [field]: value }));
	};

	// Handle new order form submit
	const handleNewOrderFormSubmit = (e) => {
		e.preventDefault();
		// In a real application, this would submit the form to an API
		console.log("New order form submitted:", newOrderForm);
		// Close the modal
		setShowNewOrderModal(false);
		// Reset the form
		setNewOrderForm({
			productType: "",
			quantity: "",
			dueDate: "",
			processor: productionType,
			materials: [],
		});
	};

	// Handle new order button click
	const handleNewOrderClick = () => {
		setShowNewOrderModal(true);
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
				return <span className="status-badge status-pending">대기중</span>;
			case "processing":
				return <span className="status-badge status-processing">작업중</span>;
			case "completed":
				return <span className="status-badge status-completed">완료</span>;
			default:
				return <span className="status-badge">{status}</span>;
		}
	};

	// Format material status for display
	const getMaterialStatusBadge = (status) => {
		switch (status) {
			case "allocated":
				return <span className="status-badge status-allocated">할당됨</span>;
			case "pending":
				return <span className="status-badge status-pending">대기중</span>;
			case "used":
				return <span className="status-badge status-used">사용됨</span>;
			default:
				return <span className="status-badge">{status}</span>;
		}
	};

	// Render production order list
	const renderProductionOrderList = () => {
		if (loading.orders) {
			return (
				<div className="loading-indicator">Loading production orders...</div>
			);
		}

		if (error.orders) {
			return <div className="error-message">{error.orders}</div>;
		}

		if (filteredOrders.length === 0) {
			return <div className="no-data">검색 결과가 없습니다.</div>;
		}

		return (
			<table className="production-table">
				<thead>
					<tr>
						<th>주문번호</th>
						<th>제품</th>
						<th>수량</th>
						<th>납기일</th>
						<th>상태</th>
						{productionType === "outsourced" && <th>임가공업체</th>}
						<th>거래처</th>
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
							<td>{order.productType}</td>
							<td>{order.quantity}</td>
							<td>{formatDate(order.dueDate)}</td>
							<td>{getStatusBadge(order.status)}</td>
							{productionType === "outsourced" && <td>{order.processor}</td>}
							<td>{order.customer}</td>
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
				<div className="no-data">
					상세 정보를 확인하려면 생산 주문을 선택하세요.
				</div>
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
				<h3 className="details-title">생산 주문 상세 정보</h3>

				<div className="details-section">
					<h4 className="section-subtitle">기본 정보</h4>
					<div className="details-grid">
						<div className="details-item">
							<span className="details-label">주문번호:</span>
							<span className="details-value">{orderDetails.orderNumber}</span>
						</div>
						<div className="details-item">
							<span className="details-label">제품:</span>
							<span className="details-value">{orderDetails.productType}</span>
						</div>
						<div className="details-item">
							<span className="details-label">분류:</span>
							<span className="details-value">{orderDetails.category}</span>
						</div>
						<div className="details-item">
							<span className="details-label">수량:</span>
							<span className="details-value">
								{orderDetails.quantity} {orderDetails.unit}
							</span>
						</div>
						<div className="details-item">
							<span className="details-label">주문일:</span>
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
							<span className="details-label">담당자:</span>
							<span className="details-value">
								{orderDetails.assignedStaff}
							</span>
						</div>
					</div>
				</div>

				{productionType === "outsourced" && (
					<div className="details-section">
						<h4 className="section-subtitle">임가공업체 정보</h4>
						<div className="details-grid">
							<div className="details-item">
								<span className="details-label">업체명:</span>
								<span className="details-value">{orderDetails.processor}</span>
							</div>
							<div className="details-item">
								<span className="details-label">연락처:</span>
								<span className="details-value">
									{orderDetails.processorContact}
								</span>
							</div>
							<div className="details-item">
								<span className="details-label">주소:</span>
								<span className="details-value">
									{orderDetails.processorAddress}
								</span>
							</div>
						</div>
					</div>
				)}

				<div className="details-section">
					<h4 className="section-subtitle">거래처 정보</h4>
					<div className="details-grid">
						<div className="details-item">
							<span className="details-label">업체명:</span>
							<span className="details-value">{orderDetails.customer}</span>
						</div>
						<div className="details-item">
							<span className="details-label">연락처:</span>
							<span className="details-value">
								{orderDetails.customerContact}
							</span>
						</div>
						<div className="details-item">
							<span className="details-label">배송지:</span>
							<span className="details-value">
								{orderDetails.deliveryAddress}
							</span>
						</div>
						<div className="details-item">
							<span className="details-label">특이사항:</span>
							<span className="details-value">
								{orderDetails.specialInstructions}
							</span>
						</div>
					</div>
				</div>

				<div className="details-section">
					<h4 className="section-subtitle">생산 정보</h4>
					<div className="details-grid">
						<div className="details-item">
							<span className="details-label">현재 단계:</span>
							<span className="details-value">
								{orderDetails.productionStage}
							</span>
						</div>
						{orderDetails.estimatedCompletionTime && (
							<div className="details-item">
								<span className="details-label">예상 완료 시간:</span>
								<span className="details-value">
									{orderDetails.estimatedCompletionTime}
								</span>
							</div>
						)}
						<div className="details-item">
							<span className="details-label">품질 검수:</span>
							<span className="details-value">
								{orderDetails.qualityCheck ? "완료" : "미완료"}
							</span>
						</div>
						<div className="details-item">
							<span className="details-label">포장 요구사항:</span>
							<span className="details-value">
								{orderDetails.packagingRequirements}
							</span>
						</div>
					</div>
				</div>

				<div className="details-section materials-section">
					<h4 className="section-subtitle">필요 자재</h4>
					{orderDetails.materials && orderDetails.materials.length > 0 ? (
						<table className="materials-table">
							<thead>
								<tr>
									<th>코드</th>
									<th>자재명</th>
									<th>수량</th>
									<th>상태</th>
								</tr>
							</thead>
							<tbody>
								{orderDetails.materials.map((material) => (
									<tr key={material.id}>
										<td>{material.code}</td>
										<td>{material.name}</td>
										<td>
											{material.quantity} {material.unit}
										</td>
										<td>{getMaterialStatusBadge(material.status)}</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<div className="no-data">자재 정보가 없습니다.</div>
					)}
				</div>

				<div className="details-section history-section">
					<h4 className="section-subtitle">작업 이력</h4>
					{orderDetails.history && orderDetails.history.length > 0 ? (
						<table className="history-table">
							<thead>
								<tr>
									<th>일시</th>
									<th>담당자</th>
									<th>단계</th>
									<th>비고</th>
								</tr>
							</thead>
							<tbody>
								{orderDetails.history.map((history) => (
									<tr key={history.id}>
										<td>{history.date}</td>
										<td>{history.staff}</td>
										<td>{history.stage}</td>
										<td>{history.notes}</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<div className="no-data">작업 이력이 없습니다.</div>
					)}
				</div>
			</div>
		);
	};

	// Render materials inventory section
	const renderMaterialsInventory = () => {
		const materialsToShow =
			productionType === "outsourced" && selectedOrder?.processor
				? processorInventory
				: materials;

		if (!materialsToShow || materialsToShow.length === 0) {
			return <div className="no-data">자재 정보가 없습니다.</div>;
		}

		if (loading.materials || loading.inventory) {
			return (
				<div className="loading-indicator">Loading materials inventory...</div>
			);
		}

		if (error.materials || error.inventory) {
			return (
				<div className="error-message">
					{error.materials || error.inventory}
				</div>
			);
		}

		return (
			<div className="materials-inventory">
				<h3 className="section-title">
					{productionType === "outsourced" && selectedOrder?.processor
						? `${selectedOrder.processor} 보유 자재`
						: "보유 자재 현황"}
				</h3>

				<table className="inventory-table">
					<thead>
						<tr>
							<th>코드</th>
							<th>자재명</th>
							<th>재고</th>
							<th>상태</th>
						</tr>
					</thead>
					<tbody>
						{materialsToShow.map((material) => (
							<tr key={material.id}>
								<td>{material.code}</td>
								<td>{material.name}</td>
								<td>
									{material.stock} {material.unit}
								</td>
								<td>
									<span
										className={`status-badge ${
											material.status === "normal"
												? "status-normal"
												: material.status === "warning"
												? "status-warning"
												: "status-danger"
										}`}>
										{material.status === "normal"
											? "정상"
											: material.status === "warning"
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

	// Render new order modal
	const renderNewOrderModal = () => {
		if (!showNewOrderModal) return null;

		return (
			<div className="modal-overlay">
				<div className="modal">
					<div className="modal-header">
						<h3 className="modal-title">신규 생산 요청</h3>
						<button
							className="modal-close"
							onClick={() => setShowNewOrderModal(false)}>
							×
						</button>
					</div>

					<form
						onSubmit={handleNewOrderFormSubmit}
						className="modal-body">
						<div className="form-group">
							<label className="form-label">생산 유형</label>
							<select
								className="form-control"
								value={newOrderForm.processor}
								onChange={(e) =>
									handleNewOrderFormChange("processor", e.target.value)
								}
								required>
								{productionTypeOptions.map((option) => (
									<option
										key={option.id}
										value={option.id}>
										{option.name}
									</option>
								))}
							</select>
						</div>

						<div className="form-group">
							<label className="form-label">제품 유형</label>
							<input
								type="text"
								className="form-control"
								value={newOrderForm.productType}
								onChange={(e) =>
									handleNewOrderFormChange("productType", e.target.value)
								}
								placeholder="제품명 입력"
								required
							/>
						</div>

						<div className="form-row">
							<div className="form-col">
								<div className="form-group">
									<label className="form-label">수량</label>
									<input
										type="number"
										className="form-control"
										value={newOrderForm.quantity}
										onChange={(e) =>
											handleNewOrderFormChange("quantity", e.target.value)
										}
										placeholder="수량 입력"
										min="1"
										required
									/>
								</div>
							</div>
							<div className="form-col">
								<div className="form-group">
									<label className="form-label">납기일</label>
									<input
										type="date"
										className="form-control"
										value={newOrderForm.dueDate}
										onChange={(e) =>
											handleNewOrderFormChange("dueDate", e.target.value)
										}
										min={new Date().toISOString().split("T")[0]}
										required
									/>
								</div>
							</div>
						</div>

						<div className="form-group">
							<label className="form-label">필요 자재</label>
							<div className="materials-selector">
								{/* In a real application, this would be a dynamic material selector */}
								<p className="note">자재는 저장 후 자동으로 할당됩니다.</p>
							</div>
						</div>

						<div className="form-group">
							<label className="form-label">특이사항</label>
							<textarea
								className="form-control"
								rows="3"
								placeholder="특이사항이나 추가 요청사항을 입력하세요"></textarea>
						</div>

						<div className="modal-footer">
							<button
								type="submit"
								className="btn btn-primary">
								생산 요청
							</button>
							<button
								type="button"
								className="btn btn-secondary"
								onClick={() => setShowNewOrderModal(false)}>
								취소
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	};

	// Main render
	return (
		<div className="production-management">
			{/* Header section with type selector and filters */}
			<div className="production-header">
				<div className="production-type-selector">
					{productionTypeOptions.map((option) => (
						<button
							key={option.id}
							className={`production-type-btn ${
								productionType === option.id ? "active" : ""
							}`}
							onClick={() => handleProductionTypeToggle(option.id)}>
							{option.name}
						</button>
					))}
				</div>

				<div className="production-filters">
					<form
						onSubmit={handleSearchSubmit}
						className="search-form">
						<input
							type="text"
							className="search-input"
							placeholder="주문번호, 제품명, 거래처 검색"
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
			</div>

			{/* Main content area */}
			<div className="production-content">
				{/* Production order list section */}
				<div className="order-list-section">
					<h3 className="section-title">
						{productionType === "woodesty"
							? "우드에스티 생산 목록"
							: productionType === "outsourced"
							? "외부임가공 생산 목록"
							: "대화동공장 생산 목록"}
						<span className="item-count">
							({filteredOrders.length}/{productionOrders.length})
						</span>
						<button
							className="btn btn-primary new-order-btn"
							onClick={handleNewOrderClick}>
							신규 생산 요청
						</button>
					</h3>
					{renderProductionOrderList()}
				</div>

				{/* Order details and materials section */}
				<div className="details-and-materials">
					{/* Order details section */}
					<div className="order-details-section">{renderOrderDetails()}</div>

					{/* Materials inventory section */}
					<div className="materials-inventory-section">
						{renderMaterialsInventory()}
					</div>
				</div>
			</div>

			{/* Action buttons */}
			{selectedOrder && (
				<div className="action-buttons">
					{selectedOrder.status === "pending" && (
						<button className="action-button start-button">생산 시작</button>
					)}
					{selectedOrder.status === "processing" && (
						<button className="action-button update-button">
							진행 상태 업데이트
						</button>
					)}
					{selectedOrder.status === "processing" && (
						<button className="action-button complete-button">생산 완료</button>
					)}
					<button className="action-button edit-button">정보 수정</button>
					<button className="action-button print-button">
						작업지시서 출력
					</button>
					{productionType === "outsourced" && (
						<button className="action-button material-button">
							원자재 배분
						</button>
					)}
				</div>
			)}

			{/* New order modal */}
			{renderNewOrderModal()}
		</div>
	);
};

ProductionManagement.propTypes = {
	initialProductionType: PropTypes.oneOf([
		"woodesty",
		"outsourced",
		"daehwadong",
	]),
};

export default ProductionManagement;

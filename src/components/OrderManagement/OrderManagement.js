import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useNotification } from "../../contexts/NotificationContext";
import "./OrderManagement.css";

/**
 * OrderManagement 컴포넌트
 *
 * 주문 접수, 확인, 처리 및 자재부/생산부 요청 관리
 * view 타입: list, create, details, process
 */
const OrderManagement = ({ view = "list" }) => {
	// 라우터 훅
	const { orderId } = useParams();
	const navigate = useNavigate();
	const { showNotification } = useNotification();

	// 상태 관리
	const [activeTab, setActiveTab] = useState("all");
	const [orders, setOrders] = useState([]);
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// 필터 상태
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [dateRangeFilter, setDateRangeFilter] = useState("all");
	const [sortBy, setSortBy] = useState("newest");

	// 새 주문 폼 데이터
	const [formData, setFormData] = useState({
		customerName: "",
		customerContact: "",
		customerEmail: "",
		deliveryAddress: "",
		requestedDate: "",
		orderItems: [],
		notes: "",
	});

	// 주문 데이터 불러오기 (목업 데이터)
	useEffect(() => {
		const fetchOrders = async () => {
			try {
				setLoading(true);
				// 실제 구현에서는 API 호출로 대체됨
				const mockOrders = [
					{
						id: "ORD-20230001",
						customerName: "대한건설",
						orderDate: "2023-09-15",
						requestedDate: "2023-09-30",
						status: "completed",
						totalAmount: 4250000,
						items: [
							{
								id: 1,
								name: "강화마루 KF153",
								quantity: 50,
								unit: "박스",
								price: 55000,
							},
							{
								id: 2,
								name: "몰딩 M203",
								quantity: 100,
								unit: "개",
								price: 12000,
							},
						],
						customerContact: "010-1234-5678",
						customerEmail: "contact@daehan.co.kr",
						deliveryAddress: "서울시 강남구 테헤란로 123",
						notes: "배송 전 연락 부탁드립니다.",
						processSteps: [
							{
								id: 1,
								name: "주문 접수",
								status: "completed",
								date: "2023-09-15",
							},
							{
								id: 2,
								name: "재고 확인",
								status: "completed",
								date: "2023-09-16",
							},
							{
								id: 3,
								name: "자재부 요청",
								status: "completed",
								date: "2023-09-17",
							},
							{
								id: 4,
								name: "생산부 요청",
								status: "completed",
								date: "2023-09-18",
							},
							{
								id: 5,
								name: "출고 준비",
								status: "completed",
								date: "2023-09-25",
							},
							{
								id: 6,
								name: "출고 완료",
								status: "completed",
								date: "2023-09-28",
							},
						],
					},
					{
						id: "ORD-20230002",
						customerName: "미래인테리어",
						orderDate: "2023-09-20",
						requestedDate: "2023-10-10",
						status: "processing",
						totalAmount: 3180000,
						items: [
							{
								id: 1,
								name: "강화마루 KF201",
								quantity: 30,
								unit: "박스",
								price: 60000,
							},
							{
								id: 2,
								name: "몰딩 M101",
								quantity: 80,
								unit: "개",
								price: 11000,
							},
						],
						customerContact: "010-9876-5432",
						customerEmail: "order@mirae.co.kr",
						deliveryAddress: "경기도 성남시 분당구 판교로 234",
						notes: "오전 배송 요청",
						processSteps: [
							{
								id: 1,
								name: "주문 접수",
								status: "completed",
								date: "2023-09-20",
							},
							{
								id: 2,
								name: "재고 확인",
								status: "completed",
								date: "2023-09-21",
							},
							{
								id: 3,
								name: "자재부 요청",
								status: "completed",
								date: "2023-09-22",
							},
							{
								id: 4,
								name: "생산부 요청",
								status: "completed",
								date: "2023-09-23",
							},
							{ id: 5, name: "출고 준비", status: "in-progress", date: null },
							{ id: 6, name: "출고 완료", status: "pending", date: null },
						],
					},
					{
						id: "ORD-20230003",
						customerName: "한솔건업",
						orderDate: "2023-09-25",
						requestedDate: "2023-10-15",
						status: "confirmed",
						totalAmount: 5620000,
						items: [
							{
								id: 1,
								name: "강화마루 KF305",
								quantity: 70,
								unit: "박스",
								price: 65000,
							},
							{
								id: 2,
								name: "몰딩 M305",
								quantity: 120,
								unit: "개",
								price: 13000,
							},
						],
						customerContact: "010-2345-6789",
						customerEmail: "info@hansol.co.kr",
						deliveryAddress: "서울시 송파구 올림픽로 345",
						notes: "하자 없는 제품으로 부탁드립니다.",
						processSteps: [
							{
								id: 1,
								name: "주문 접수",
								status: "completed",
								date: "2023-09-25",
							},
							{
								id: 2,
								name: "재고 확인",
								status: "completed",
								date: "2023-09-26",
							},
							{ id: 3, name: "자재부 요청", status: "in-progress", date: null },
							{ id: 4, name: "생산부 요청", status: "pending", date: null },
							{ id: 5, name: "출고 준비", status: "pending", date: null },
							{ id: 6, name: "출고 완료", status: "pending", date: null },
						],
					},
					{
						id: "ORD-20230004",
						customerName: "우성건설",
						orderDate: "2023-09-28",
						requestedDate: "2023-10-20",
						status: "new",
						totalAmount: 2870000,
						items: [
							{
								id: 1,
								name: "강화마루 KF120",
								quantity: 35,
								unit: "박스",
								price: 52000,
							},
							{
								id: 2,
								name: "몰딩 M120",
								quantity: 90,
								unit: "개",
								price: 9800,
							},
						],
						customerContact: "010-3456-7890",
						customerEmail: "order@woosung.co.kr",
						deliveryAddress: "경기도 고양시 일산동구 중앙로 456",
						notes: "",
						processSteps: [
							{
								id: 1,
								name: "주문 접수",
								status: "completed",
								date: "2023-09-28",
							},
							{ id: 2, name: "재고 확인", status: "pending", date: null },
							{ id: 3, name: "자재부 요청", status: "pending", date: null },
							{ id: 4, name: "생산부 요청", status: "pending", date: null },
							{ id: 5, name: "출고 준비", status: "pending", date: null },
							{ id: 6, name: "출고 완료", status: "pending", date: null },
						],
					},
					{
						id: "ORD-20230005",
						customerName: "청담인테리어",
						orderDate: "2023-10-01",
						requestedDate: "2023-10-25",
						status: "cancelled",
						totalAmount: 3450000,
						items: [
							{
								id: 1,
								name: "강화마루 KF210",
								quantity: 40,
								unit: "박스",
								price: 58000,
							},
							{
								id: 2,
								name: "몰딩 M210",
								quantity: 100,
								unit: "개",
								price: 11500,
							},
						],
						customerContact: "010-4567-8901",
						customerEmail: "design@cheongdam.co.kr",
						deliveryAddress: "서울시 강남구 청담동 123-45",
						notes: "고객 요청으로 인한 취소",
						processSteps: [
							{
								id: 1,
								name: "주문 접수",
								status: "completed",
								date: "2023-10-01",
							},
							{
								id: 2,
								name: "재고 확인",
								status: "completed",
								date: "2023-10-02",
							},
							{
								id: 3,
								name: "자재부 요청",
								status: "cancelled",
								date: "2023-10-03",
							},
							{ id: 4, name: "생산부 요청", status: "cancelled", date: null },
							{ id: 5, name: "출고 준비", status: "cancelled", date: null },
							{ id: 6, name: "출고 완료", status: "cancelled", date: null },
						],
					},
				];

				// 특정 주문 상세 조회 시 해당 주문 저장
				if (view === "details" || view === "process") {
					const foundOrder = mockOrders.find((order) => order.id === orderId);
					if (foundOrder) {
						setSelectedOrder(foundOrder);
					} else {
						setError("요청하신 주문을 찾을 수 없습니다.");
					}
				}

				// 모든 주문 데이터 저장
				setOrders(mockOrders);
				setLoading(false);
			} catch (err) {
				console.error("주문 데이터 로딩 중 오류:", err);
				setError("주문 데이터를 불러오는 데 실패했습니다.");
				setLoading(false);
			}
		};

		fetchOrders();
	}, [view, orderId]);

	// 필터링된 주문 목록
	const filteredOrders = orders
		.filter((order) => {
			// 검색어 필터링
			const searchMatches =
				order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
				order.customerName.toLowerCase().includes(searchQuery.toLowerCase());

			// 상태 필터링
			const statusMatches =
				statusFilter === "all" || order.status === statusFilter;

			// 날짜 범위 필터링
			let dateMatches = true;
			const orderDate = new Date(order.orderDate);
			const today = new Date();

			if (dateRangeFilter === "today") {
				dateMatches = orderDate.toDateString() === today.toDateString();
			} else if (dateRangeFilter === "week") {
				const weekAgo = new Date();
				weekAgo.setDate(today.getDate() - 7);
				dateMatches = orderDate >= weekAgo;
			} else if (dateRangeFilter === "month") {
				const monthAgo = new Date();
				monthAgo.setMonth(today.getMonth() - 1);
				dateMatches = orderDate >= monthAgo;
			}

			return searchMatches && statusMatches && dateMatches;
		})
		.sort((a, b) => {
			// 정렬
			if (sortBy === "newest") {
				return new Date(b.orderDate) - new Date(a.orderDate);
			} else if (sortBy === "oldest") {
				return new Date(a.orderDate) - new Date(b.orderDate);
			} else if (sortBy === "amount-high") {
				return b.totalAmount - a.totalAmount;
			} else if (sortBy === "amount-low") {
				return a.totalAmount - b.totalAmount;
			}
			return 0;
		});

	// 상태에 따른 배지 클래스
	const getStatusBadgeClass = (status) => {
		const classes = {
			new: "status-new",
			confirmed: "status-confirmed",
			processing: "status-processing",
			ready: "status-ready",
			completed: "status-completed",
			cancelled: "status-cancelled",
		};
		return `status-badge ${classes[status] || ""}`;
	};

	// 상태 텍스트 변환
	const getStatusText = (status) => {
		const statuses = {
			new: "신규",
			confirmed: "확인됨",
			processing: "처리중",
			ready: "출고준비",
			completed: "완료됨",
			cancelled: "취소됨",
		};
		return statuses[status] || status;
	};

	// 날짜 포맷팅
	const formatDate = (dateString) => {
		if (!dateString) return "-";
		const options = { year: "numeric", month: "2-digit", day: "2-digit" };
		return new Date(dateString).toLocaleDateString("ko-KR", options);
	};

	// 금액 포맷팅
	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("ko-KR", {
			style: "currency",
			currency: "KRW",
		}).format(amount);
	};

	// 주문 상세 보기로 이동
	const handleViewDetails = (order) => {
		navigate(`/orders/details/${order.id}`);
	};

	// 주문 처리 페이지로 이동
	const handleProcessOrder = (order) => {
		navigate(`/orders/process/${order.id}`);
	};

	// 주문 아이템 추가
	const handleAddOrderItem = () => {
		const newItem = {
			id: Date.now(),
			name: "",
			quantity: 1,
			unit: "개",
			price: 0,
		};

		setFormData({
			...formData,
			orderItems: [...formData.orderItems, newItem],
		});
	};

	// 주문 아이템 수정
	const handleOrderItemChange = (itemId, field, value) => {
		setFormData({
			...formData,
			orderItems: formData.orderItems.map((item) =>
				item.id === itemId ? { ...item, [field]: value } : item
			),
		});
	};

	// 주문 아이템 삭제
	const handleRemoveOrderItem = (itemId) => {
		setFormData({
			...formData,
			orderItems: formData.orderItems.filter((item) => item.id !== itemId),
		});
	};

	// 폼 필드 수정
	const handleFormChange = (field, value) => {
		setFormData({
			...formData,
			[field]: value,
		});
	};

	// 주문 제출
	const handleSubmitOrder = (e) => {
		e.preventDefault();

		// 필수 필드 검증
		if (
			!formData.customerName ||
			!formData.customerContact ||
			!formData.deliveryAddress ||
			formData.orderItems.length === 0
		) {
			alert("필수 필드를 모두 입력해주세요.");
			return;
		}

		// 아이템 검증
		const invalidItems = formData.orderItems.filter(
			(item) => !item.name || item.quantity <= 0 || item.price <= 0
		);
		if (invalidItems.length > 0) {
			alert("모든 주문 항목을 올바르게 입력해주세요.");
			return;
		}

		// 실제 구현에서는 API 호출로 주문 생성
		showNotification({
			title: "주문 생성",
			message: "새 주문이 성공적으로 생성되었습니다.",
			type: "success",
		});

		// 주문 목록으로 리다이렉트
		navigate("/orders/list");
	};

	// 주문 처리 상태 업데이트
	const handleUpdateProcessStep = (stepId, status) => {
		if (!selectedOrder) return;

		// 실제 구현에서는 API 호출로 상태 업데이트
		const updatedSteps = selectedOrder.processSteps.map((step) => {
			if (step.id === stepId) {
				return {
					...step,
					status: status,
					date:
						status === "completed"
							? new Date().toISOString().split("T")[0]
							: step.date,
				};
			}
			return step;
		});

		// 상태 업데이트
		setSelectedOrder({
			...selectedOrder,
			processSteps: updatedSteps,
		});

		// 알림 표시
		showNotification({
			title: "처리 상태 업데이트",
			message: `주문 ${selectedOrder.id}의 처리 단계가 업데이트되었습니다.`,
			type: "success",
		});
	};

	// 최종 주문 상태 업데이트 (모든 단계 완료 시)
	const handleFinalizeOrder = () => {
		if (!selectedOrder) return;

		// 실제 구현에서는 API 호출로 상태 업데이트
		const allStepsCompleted = selectedOrder.processSteps.every(
			(step) => step.status === "completed"
		);

		if (allStepsCompleted) {
			setSelectedOrder({
				...selectedOrder,
				status: "completed",
			});

			showNotification({
				title: "주문 완료",
				message: `주문 ${selectedOrder.id}가 성공적으로 완료되었습니다.`,
				type: "success",
			});

			// 주문 목록으로 리다이렉트
			navigate("/orders/list");
		} else {
			alert("모든 처리 단계를 완료해야 합니다.");
		}
	};

	// 주문 목록 뷰 렌더링
	const renderOrderListView = () => {
		return (
			<>
				<div className="order-header">
					<h1 className="module-title">주문 관리</h1>
					<p className="order-subtitle">주문 접수, 확인 및 처리 관리</p>

					<div className="tab-navigation">
						<button
							className={`tab-button ${activeTab === "all" ? "active" : ""}`}
							onClick={() => setActiveTab("all")}>
							전체 주문
						</button>
						<button
							className={`tab-button ${activeTab === "new" ? "active" : ""}`}
							onClick={() => setActiveTab("new")}>
							신규 주문
						</button>
						<button
							className={`tab-button ${
								activeTab === "processing" ? "active" : ""
							}`}
							onClick={() => setActiveTab("processing")}>
							처리중
						</button>
						<button
							className={`tab-button ${
								activeTab === "completed" ? "active" : ""
							}`}
							onClick={() => setActiveTab("completed")}>
							완료 주문
						</button>
						<button
							className={`tab-button ${
								activeTab === "cancelled" ? "active" : ""
							}`}
							onClick={() => setActiveTab("cancelled")}>
							취소 주문
						</button>
					</div>
				</div>

				<div className="filter-section">
					<h2 className="filter-title">필터</h2>
					<div className="filter-row">
						<div className="filter-group">
							<label className="filter-label">검색어</label>
							<input
								type="text"
								className="filter-input"
								placeholder="주문번호 또는 고객명"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
						<div className="filter-group">
							<label className="filter-label">주문 상태</label>
							<select
								className="filter-select"
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value)}>
								<option value="all">전체 상태</option>
								<option value="new">신규</option>
								<option value="confirmed">확인됨</option>
								<option value="processing">처리중</option>
								<option value="ready">출고준비</option>
								<option value="completed">완료됨</option>
								<option value="cancelled">취소됨</option>
							</select>
						</div>
						<div className="filter-group">
							<label className="filter-label">날짜 범위</label>
							<select
								className="filter-select"
								value={dateRangeFilter}
								onChange={(e) => setDateRangeFilter(e.target.value)}>
								<option value="all">전체 기간</option>
								<option value="today">오늘</option>
								<option value="week">최근 7일</option>
								<option value="month">최근 30일</option>
							</select>
						</div>
						<div className="filter-group">
							<label className="filter-label">정렬 기준</label>
							<select
								className="filter-select"
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}>
								<option value="newest">최신순</option>
								<option value="oldest">오래된순</option>
								<option value="amount-high">금액 높은순</option>
								<option value="amount-low">금액 낮은순</option>
							</select>
						</div>
					</div>
				</div>

				<div className="order-list-section">
					<div className="section-title">
						<span>주문 목록</span>
						<span className="item-count">{filteredOrders.length}개 항목</span>
					</div>

					{loading ? (
						<div className="loading-indicator">
							주문 데이터를 불러오는 중...
						</div>
					) : error ? (
						<div className="error-message">{error}</div>
					) : filteredOrders.length > 0 ? (
						<table className="order-table">
							<thead>
								<tr>
									<th>주문번호</th>
									<th>고객명</th>
									<th>주문일자</th>
									<th>납기일자</th>
									<th>주문상태</th>
									<th>주문금액</th>
									<th>작업</th>
								</tr>
							</thead>
							<tbody>
								{filteredOrders.map((order) => (
									<tr key={order.id}>
										<td>{order.id}</td>
										<td>{order.customerName}</td>
										<td>{formatDate(order.orderDate)}</td>
										<td>{formatDate(order.requestedDate)}</td>
										<td>
											<span className={getStatusBadgeClass(order.status)}>
												{getStatusText(order.status)}
											</span>
										</td>
										<td>{formatCurrency(order.totalAmount)}</td>
										<td className="action-buttons">
											<button
												className="btn btn-secondary"
												onClick={() => handleViewDetails(order)}>
												상세보기
											</button>
											{(order.status === "new" ||
												order.status === "confirmed" ||
												order.status === "processing") && (
												<button
													className="btn btn-primary"
													onClick={() => handleProcessOrder(order)}>
													처리하기
												</button>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<div className="no-data">검색 조건에 맞는 주문이 없습니다.</div>
					)}

					<div style={{ marginTop: "20px" }}>
						<Link to="/orders/create">
							<button className="btn btn-primary">새 주문 생성</button>
						</Link>
					</div>
				</div>
			</>
		);
	};

	// 주문 생성 뷰 렌더링
	const renderOrderCreateView = () => {
		return (
			<div className="order-form">
				<h1 className="module-title">새 주문 생성</h1>

				<form onSubmit={handleSubmitOrder}>
					<div className="form-section">
						<h2 className="form-section-title">고객 정보</h2>
						<div className="form-row">
							<div className="form-group">
								<label className="form-label">고객명 *</label>
								<input
									type="text"
									className="form-input"
									value={formData.customerName}
									onChange={(e) =>
										handleFormChange("customerName", e.target.value)
									}
									required
								/>
							</div>
							<div className="form-group">
								<label className="form-label">연락처 *</label>
								<input
									type="text"
									className="form-input"
									value={formData.customerContact}
									onChange={(e) =>
										handleFormChange("customerContact", e.target.value)
									}
									required
								/>
							</div>
						</div>
						<div className="form-row">
							<div className="form-group">
								<label className="form-label">이메일</label>
								<input
									type="email"
									className="form-input"
									value={formData.customerEmail}
									onChange={(e) =>
										handleFormChange("customerEmail", e.target.value)
									}
								/>
							</div>
							<div className="form-group">
								<label className="form-label">납기 요청일</label>
								<input
									type="date"
									className="form-input"
									value={formData.requestedDate}
									onChange={(e) =>
										handleFormChange("requestedDate", e.target.value)
									}
								/>
							</div>
						</div>
						<div className="form-row">
							<div className="form-group">
								<label className="form-label">배송 주소 *</label>
								<input
									type="text"
									className="form-input"
									value={formData.deliveryAddress}
									onChange={(e) =>
										handleFormChange("deliveryAddress", e.target.value)
									}
									required
								/>
							</div>
						</div>
					</div>

					<div className="form-section">
						<h2 className="form-section-title">주문 항목</h2>

						{formData.orderItems.length > 0 ? (
							<table className="order-items-table">
								<thead>
									<tr>
										<th>제품명</th>
										<th>수량</th>
										<th>단위</th>
										<th>단가</th>
										<th>금액</th>
										<th>작업</th>
									</tr>
								</thead>
								<tbody>
									{formData.orderItems.map((item) => (
										<tr key={item.id}>
											<td>
												<input
													type="text"
													className="form-input"
													value={item.name}
													onChange={(e) =>
														handleOrderItemChange(
															item.id,
															"name",
															e.target.value
														)
													}
													required
												/>
											</td>
											<td>
												<input
													type="number"
													className="form-input"
													value={item.quantity}
													onChange={(e) =>
														handleOrderItemChange(
															item.id,
															"quantity",
															parseInt(e.target.value) || 0
														)
													}
													min="1"
													required
												/>
											</td>
											<td>
												<select
													className="form-select"
													value={item.unit}
													onChange={(e) =>
														handleOrderItemChange(
															item.id,
															"unit",
															e.target.value
														)
													}>
													<option value="개">개</option>
													<option value="박스">박스</option>
													<option value="세트">세트</option>
													<option value="미터">미터</option>
												</select>
											</td>
											<td>
												<input
													type="number"
													className="form-input"
													value={item.price}
													onChange={(e) =>
														handleOrderItemChange(
															item.id,
															"price",
															parseInt(e.target.value) || 0
														)
													}
													min="0"
													required
												/>
											</td>
											<td>{formatCurrency(item.quantity * item.price)}</td>
											<td>
												<button
													type="button"
													className="btn btn-secondary"
													onClick={() => handleRemoveOrderItem(item.id)}>
													삭제
												</button>
											</td>
										</tr>
									))}
								</tbody>
								<tfoot>
									<tr>
										<td
											colSpan="4"
											align="right">
											<strong>총 금액:</strong>
										</td>
										<td colSpan="2">
											<strong>
												{formatCurrency(
													formData.orderItems.reduce(
														(sum, item) => sum + item.quantity * item.price,
														0
													)
												)}
											</strong>
										</td>
									</tr>
								</tfoot>
							</table>
						) : (
							<div className="no-data">주문 항목이 없습니다.</div>
						)}

						<button
							type="button"
							className="add-item-btn"
							onClick={handleAddOrderItem}>
							+ 항목 추가
						</button>
					</div>

					<div className="form-section">
						<h2 className="form-section-title">추가 정보</h2>
						<div className="form-row">
							<div className="form-group">
								<label className="form-label">비고</label>
								<textarea
									className="form-textarea"
									value={formData.notes}
									onChange={(e) => handleFormChange("notes", e.target.value)}
									placeholder="추가 요청사항이나 참고사항을 입력해주세요."
								/>
							</div>
						</div>
					</div>

					<div
						className="form-section"
						style={{
							display: "flex",
							gap: "10px",
							justifyContent: "flex-end",
						}}>
						<Link to="/orders/list">
							<button
								type="button"
								className="btn btn-secondary">
								취소
							</button>
						</Link>
						<button
							type="submit"
							className="btn btn-primary">
							주문 생성
						</button>
					</div>
				</form>
			</div>
		);
	};

	// 주문 상세 뷰 렌더링
	const renderOrderDetailsView = () => {
		if (loading) {
			return (
				<div className="loading-indicator">주문 정보를 불러오는 중...</div>
			);
		}

		if (error || !selectedOrder) {
			return (
				<div className="error-message">
					{error || "주문 정보를 찾을 수 없습니다."}
				</div>
			);
		}

		return (
			<div className="order-details">
				<div className="order-details-header">
					<div>
						<h1 className="module-title">주문 상세 정보</h1>
						<div className="order-id">주문번호: {selectedOrder.id}</div>
						<div className="order-date">
							주문일: {formatDate(selectedOrder.orderDate)}
						</div>
					</div>
					<div>
						<span className={getStatusBadgeClass(selectedOrder.status)}>
							{getStatusText(selectedOrder.status)}
						</span>
					</div>
				</div>

				<div className="details-row">
					<div className="details-col">
						<h2 className="form-section-title">고객 정보</h2>
						<div className="details-group">
							<div className="details-label">고객명</div>
							<div className="details-value">{selectedOrder.customerName}</div>
						</div>
						<div className="details-group">
							<div className="details-label">연락처</div>
							<div className="details-value">
								{selectedOrder.customerContact}
							</div>
						</div>
						<div className="details-group">
							<div className="details-label">이메일</div>
							<div className="details-value">
								{selectedOrder.customerEmail || "-"}
							</div>
						</div>
					</div>

					<div className="details-col">
						<h2 className="form-section-title">배송 정보</h2>
						<div className="details-group">
							<div className="details-label">배송 주소</div>
							<div className="details-value">
								{selectedOrder.deliveryAddress}
							</div>
						</div>
						<div className="details-group">
							<div className="details-label">납기 요청일</div>
							<div className="details-value">
								{formatDate(selectedOrder.requestedDate)}
							</div>
						</div>
					</div>
				</div>

				<div className="divider"></div>

				<h2 className="form-section-title">주문 항목</h2>
				<table className="order-items-table">
					<thead>
						<tr>
							<th>제품명</th>
							<th>수량</th>
							<th>단위</th>
							<th>단가</th>
							<th>금액</th>
						</tr>
					</thead>
					<tbody>
						{selectedOrder.items.map((item) => (
							<tr key={item.id}>
								<td>{item.name}</td>
								<td>{item.quantity}</td>
								<td>{item.unit}</td>
								<td>{formatCurrency(item.price)}</td>
								<td>{formatCurrency(item.quantity * item.price)}</td>
							</tr>
						))}
					</tbody>
					<tfoot>
						<tr>
							<td
								colSpan="4"
								align="right">
								<strong>총 금액:</strong>
							</td>
							<td>
								<strong>{formatCurrency(selectedOrder.totalAmount)}</strong>
							</td>
						</tr>
					</tfoot>
				</table>

				<div className="divider"></div>

				<h2 className="form-section-title">처리 과정</h2>
				<div className="process-steps">
					{selectedOrder.processSteps.map((step) => (
						<div
							key={step.id}
							className={`process-step ${
								step.status === "completed"
									? "completed"
									: step.status === "in-progress"
									? "active"
									: ""
							}`}>
							<div className="step-indicator">{step.id}</div>
							<div className="step-label">{step.name}</div>
							<div className="step-date">{formatDate(step.date)}</div>
						</div>
					))}
				</div>

				{selectedOrder.notes && (
					<>
						<div className="divider"></div>
						<h2 className="form-section-title">비고</h2>
						<p>{selectedOrder.notes}</p>
					</>
				)}

				<div className="divider"></div>

				<div
					style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
					<Link to="/orders/list">
						<button className="btn btn-secondary">목록으로</button>
					</Link>
					{selectedOrder.status !== "completed" &&
						selectedOrder.status !== "cancelled" && (
							<button
								className="btn btn-primary"
								onClick={() => handleProcessOrder(selectedOrder)}>
								처리하기
							</button>
						)}
				</div>
			</div>
		);
	};

	// 주문 처리 뷰 렌더링
	const renderOrderProcessView = () => {
		if (loading) {
			return (
				<div className="loading-indicator">주문 정보를 불러오는 중...</div>
			);
		}

		if (error || !selectedOrder) {
			return (
				<div className="error-message">
					{error || "주문 정보를 찾을 수 없습니다."}
				</div>
			);
		}

		return (
			<div className="order-details">
				<div className="order-details-header">
					<div>
						<h1 className="module-title">주문 처리</h1>
						<div className="order-id">주문번호: {selectedOrder.id}</div>
						<div className="order-date">
							주문일: {formatDate(selectedOrder.orderDate)}
						</div>
					</div>
					<div>
						<span className={getStatusBadgeClass(selectedOrder.status)}>
							{getStatusText(selectedOrder.status)}
						</span>
					</div>
				</div>

				<div className="divider"></div>

				<h2 className="form-section-title">처리 과정</h2>
				<div className="process-steps">
					{selectedOrder.processSteps.map((step) => (
						<div
							key={step.id}
							className={`process-step ${
								step.status === "completed"
									? "completed"
									: step.status === "in-progress"
									? "active"
									: ""
							}`}>
							<div className="step-indicator">{step.id}</div>
							<div className="step-label">{step.name}</div>
							<div className="step-date">{formatDate(step.date)}</div>
						</div>
					))}
				</div>

				<div className="divider"></div>

				<h2 className="form-section-title">단계별 처리</h2>
				<table className="order-table">
					<thead>
						<tr>
							<th>단계</th>
							<th>상태</th>
							<th>완료일</th>
							<th>작업</th>
						</tr>
					</thead>
					<tbody>
						{selectedOrder.processSteps.map((step) => (
							<tr key={step.id}>
								<td>{step.name}</td>
								<td>
									<span
										className={`status-badge ${
											step.status === "completed"
												? "status-completed"
												: step.status === "in-progress"
												? "status-processing"
												: step.status === "pending"
												? "status-new"
												: step.status === "cancelled"
												? "status-cancelled"
												: ""
										}`}>
										{step.status === "completed"
											? "완료"
											: step.status === "in-progress"
											? "진행중"
											: step.status === "pending"
											? "대기중"
											: step.status === "cancelled"
											? "취소됨"
											: step.status}
									</span>
								</td>
								<td>{formatDate(step.date)}</td>
								<td>
									{(step.status === "pending" ||
										step.status === "in-progress") && (
										<div className="action-buttons">
											{step.status === "pending" && (
												<button
													className="btn btn-secondary"
													onClick={() =>
														handleUpdateProcessStep(step.id, "in-progress")
													}>
													시작
												</button>
											)}
											<button
												className="btn btn-primary"
												onClick={() =>
													handleUpdateProcessStep(step.id, "completed")
												}>
												완료
											</button>
										</div>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>

				<div className="divider"></div>

				<div
					style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
					<Link to={`/orders/details/${selectedOrder.id}`}>
						<button className="btn btn-secondary">상세보기</button>
					</Link>
					<button
						className="btn btn-primary"
						onClick={handleFinalizeOrder}
						disabled={
							!selectedOrder.processSteps.every(
								(step) => step.status === "completed"
							)
						}>
						주문 완료 처리
					</button>
				</div>
			</div>
		);
	};

	// 현재 뷰에 맞는 컴포넌트 렌더링
	const renderContent = () => {
		switch (view) {
			case "list":
				return renderOrderListView();
			case "create":
				return renderOrderCreateView();
			case "details":
				return renderOrderDetailsView();
			case "process":
				return renderOrderProcessView();
			default:
				return renderOrderListView();
		}
	};

	return <div className="order-management">{renderContent()}</div>;
};

export default OrderManagement;

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import "./FloorInventoryManagement.css";

const FloorInventoryManagement = () => {
	const [inventoryItems, setInventoryItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedItem, setSelectedItem] = useState(null);
	const [scanMode, setScanMode] = useState("scan");
	const [searchTerm, setSearchTerm] = useState("");
	const [filter, setFilter] = useState("all");
	const [showOrderModal, setShowOrderModal] = useState(false);
	const [scannedOrder, setScannedOrder] = useState(null);
	const [estimatedTime, setEstimatedTime] = useState(30);
	const [qrValue, setQrValue] = useState("");
	const [scanError, setScanError] = useState("");
	const navigate = useNavigate();

	// 모의 재고 데이터
	const mockInventoryItems = [
		{
			productId: "P001",
			productName: "원목 테이블 A형",
			category: "가구",
			totalStock: 15,
			availableStock: 12,
			reservedStock: 3,
			location: "3층-A12",
			status: "정상",
		},
		{
			productId: "P002",
			productName: "원목 의자 B형",
			category: "가구",
			totalStock: 30,
			availableStock: 25,
			reservedStock: 5,
			location: "3층-A13",
			status: "정상",
		},
		{
			productId: "P003",
			productName: "책장 C형",
			category: "가구",
			totalStock: 8,
			availableStock: 5,
			reservedStock: 3,
			location: "3층-B21",
			status: "부족",
		},
		{
			productId: "P004",
			productName: "수납장 D형",
			category: "가구",
			totalStock: 10,
			availableStock: 8,
			reservedStock: 2,
			location: "3층-B22",
			status: "정상",
		},
	];

	// 모의 주문 데이터
	const mockOrders = [
		{
			id: "ORD-2F-001",
			customerName: "김주문",
			customerPhone: "010-1234-5678",
			orderDate: "2025-02-28",
			items: [
				{
					productId: "P001",
					productName: "원목 테이블 A형",
					quantity: 1,
				},
			],
			deliveryMethod: "pickup",
			priority: "high",
			floorOrigin: 2,
			status: "접수완료",
		},
		{
			id: "ORD-4F-001",
			customerName: "이메일",
			customerPhone: "010-9876-5432",
			orderDate: "2025-02-28",
			items: [
				{
					productId: "P003",
					productName: "책장 C형",
					quantity: 1,
				},
				{
					productId: "P004",
					productName: "수납장 D형",
					quantity: 1,
				},
			],
			deliveryMethod: "delivery",
			priority: "normal",
			floorOrigin: 4,
			status: "접수완료",
		},
	];

	// 데이터 로드
	useEffect(() => {
		setLoading(true);
		// 실제로는 API 호출
		setTimeout(() => {
			setInventoryItems(mockInventoryItems);
			setLoading(false);
		}, 500);
	}, []);

	// QR 코드 스캔 처리
	const handleQRScan = () => {
		setScanError("");
		// 실제로는 QR 스캐너 연동
		// 여기서는 모의 데이터 사용
		const orderId = qrValue.trim();

		if (!orderId) {
			setScanError("QR 코드 또는 주문번호를 입력해주세요.");
			return;
		}

		const order = mockOrders.find((o) => o.id === orderId);

		if (!order) {
			setScanError("해당 주문을 찾을 수 없습니다.");
			return;
		}

		if (order.status !== "접수완료") {
			setScanError("처리할 수 없는 주문 상태입니다.");
			return;
		}

		setScannedOrder(order);
		setShowOrderModal(true);
		setQrValue("");
	};

	// 주문 확인 및 재고 차감
	const confirmOrder = () => {
		// 재고 차감 처리
		const updatedInventory = inventoryItems.map((item) => {
			const orderItem = scannedOrder.items.find(
				(oi) => oi.productId === item.productId
			);
			if (orderItem) {
				return {
					...item,
					availableStock: item.availableStock - orderItem.quantity,
					reservedStock: item.reservedStock + orderItem.quantity,
				};
			}
			return item;
		});

		setInventoryItems(updatedInventory);

		// 주문 상태 업데이트 (실제로는 API 호출)
		// 여기서는 모의 데이터만 업데이트

		setShowOrderModal(false);

		// 성공 메시지 표시
		alert(
			`주문 ${scannedOrder.id}이(가) 처리되었습니다. 예상 준비 시간: ${estimatedTime}분`
		);
	};

	// 뒤로 가기 처리
	const handleGoBack = () => {
		navigate(-1);
	};

	// 필터링된 재고 항목
	const filteredItems = inventoryItems.filter((item) => {
		// 검색어 필터링
		const matchesSearch =
			item.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.productName.toLowerCase().includes(searchTerm.toLowerCase());

		// 상태 필터링
		const matchesFilter =
			filter === "all" ||
			(filter === "normal" && item.status === "정상") ||
			(filter === "low" && item.status === "부족") ||
			(filter === "critical" && item.status === "위험");

		return matchesSearch && matchesFilter;
	});

	// 상태에 따른 클래스 반환
	const getStatusClass = (status) => {
		switch (status) {
			case "정상":
				return "status-normal";
			case "부족":
				return "status-low";
			case "위험":
				return "status-critical";
			default:
				return "";
		}
	};

	return (
		<div className="floor-inventory-management">
			<div className="inventory-header">
				<div className="header-navigation">
					<button
						className="btn btn-secondary back-button"
						onClick={handleGoBack}>
						&larr; 뒤로 가기
					</button>
					<h1 className="module-title">자재부 재고 관리</h1>
				</div>

				<div className="inventory-controls">
					<div className="scan-mode-selector">
						<button
							className={`scan-mode-btn ${scanMode === "scan" ? "active" : ""}`}
							onClick={() => setScanMode("scan")}>
							QR 스캔 모드
						</button>
						<button
							className={`scan-mode-btn ${
								scanMode === "inventory" ? "active" : ""
							}`}
							onClick={() => setScanMode("inventory")}>
							재고 관리 모드
						</button>
					</div>

					<div className="inventory-search">
						<input
							type="text"
							placeholder="제품 코드 또는 이름으로 검색"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
						<select
							value={filter}
							onChange={(e) => setFilter(e.target.value)}>
							<option value="all">모든 상태</option>
							<option value="normal">정상 재고</option>
							<option value="low">부족 재고</option>
							<option value="critical">위험 재고</option>
						</select>
					</div>
				</div>
			</div>

			<div className="inventory-content">
				{scanMode === "scan" ? (
					<div className="scan-section">
						<div className="qr-scan-container">
							<h2 className="section-title">QR 코드 스캔</h2>
							<p className="scan-instructions">
								주문 QR 코드를 스캔하거나 주문번호를 직접 입력하세요.
							</p>

							<div className="qr-input-container">
								<input
									type="text"
									placeholder="주문번호 입력 (예: ORD-2F-001)"
									value={qrValue}
									onChange={(e) => setQrValue(e.target.value)}
								/>
								<button
									className="btn btn-primary"
									onClick={handleQRScan}>
									확인
								</button>
							</div>

							{scanError && <div className="scan-error">{scanError}</div>}

							<div className="recent-scans">
								<h3>최근 처리 내역</h3>
								<div className="scan-history">
									{/* 최근 스캔 내역 표시 */}
									<div className="scan-history-empty">
										최근 처리 내역이 없습니다.
									</div>
								</div>
							</div>
						</div>
					</div>
				) : (
					<div className="inventory-section">
						<h2 className="section-title">재고 현황</h2>

						{loading ? (
							<div className="loading">데이터를 불러오는 중...</div>
						) : (
							<table className="inventory-table">
								<thead>
									<tr>
										<th>제품코드</th>
										<th>제품명</th>
										<th>카테고리</th>
										<th>총 재고</th>
										<th>가용 재고</th>
										<th>예약 재고</th>
										<th>위치</th>
										<th>상태</th>
									</tr>
								</thead>
								<tbody>
									{filteredItems.map((item) => (
										<tr
											key={item.productId}
											onClick={() => setSelectedItem(item)}
											className={
												selectedItem &&
												selectedItem.productId === item.productId
													? "selected"
													: ""
											}>
											<td>{item.productId}</td>
											<td>{item.productName}</td>
											<td>{item.category}</td>
											<td>{item.totalStock}</td>
											<td>{item.availableStock}</td>
											<td>{item.reservedStock}</td>
											<td>{item.location}</td>
											<td>
												<span
													className={`status-badge ${getStatusClass(
														item.status
													)}`}>
													{item.status}
												</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						)}
					</div>
				)}
			</div>

			{/* 주문 상세 모달 */}
			{showOrderModal && scannedOrder && (
				<div className="modal-overlay">
					<div className="modal-content">
						<div className="modal-header">
							<h2 className="modal-title">주문 상세 정보</h2>
							<button
								className="modal-close"
								onClick={() => setShowOrderModal(false)}>
								&times;
							</button>
						</div>

						<div className="order-details">
							<div className="order-info">
								<div className="info-group">
									<div className="info-label">주문번호</div>
									<div className="info-value">{scannedOrder.id}</div>
								</div>

								<div className="info-group">
									<div className="info-label">고객명</div>
									<div className="info-value">{scannedOrder.customerName}</div>
								</div>

								<div className="info-group">
									<div className="info-label">연락처</div>
									<div className="info-value">{scannedOrder.customerPhone}</div>
								</div>

								<div className="info-group">
									<div className="info-label">주문일자</div>
									<div className="info-value">{scannedOrder.orderDate}</div>
								</div>

								<div className="info-group">
									<div className="info-label">발생층</div>
									<div className="info-value">{scannedOrder.floorOrigin}층</div>
								</div>

								<div className="info-group">
									<div className="info-label">우선순위</div>
									<div className="info-value">
										<span
											className={`priority-badge ${
												scannedOrder.priority === "high"
													? "priority-high"
													: "priority-normal"
											}`}>
											{scannedOrder.priority === "high" ? "우선" : "일반"}
										</span>
									</div>
								</div>

								<div className="info-group">
									<div className="info-label">배송방법</div>
									<div className="info-value">
										{scannedOrder.deliveryMethod === "pickup"
											? "직접수령"
											: "택배"}
									</div>
								</div>
							</div>

							<h3 className="items-title">주문 항목</h3>
							<table className="items-table">
								<thead>
									<tr>
										<th>제품코드</th>
										<th>제품명</th>
										<th>수량</th>
										<th>재고상태</th>
									</tr>
								</thead>
								<tbody>
									{scannedOrder.items.map((item, index) => {
										const inventoryItem = inventoryItems.find(
											(inv) => inv.productId === item.productId
										);
										const isAvailable =
											inventoryItem &&
											inventoryItem.availableStock >= item.quantity;

										return (
											<tr key={index}>
												<td>{item.productId}</td>
												<td>{item.productName}</td>
												<td>{item.quantity}</td>
												<td>
													<span
														className={`status-badge ${
															isAvailable ? "status-normal" : "status-critical"
														}`}>
														{isAvailable ? "가용" : "부족"}
													</span>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>

							<div className="estimated-time">
								<h3>예상 준비 시간 설정</h3>
								<div className="time-input">
									<input
										type="number"
										value={estimatedTime}
										onChange={(e) => setEstimatedTime(Number(e.target.value))}
										min="10"
										max="180"
									/>
									<span className="time-unit">분</span>
								</div>
							</div>
						</div>

						<div className="modal-actions">
							<button
								className="btn btn-secondary"
								onClick={() => setShowOrderModal(false)}>
								취소
							</button>
							<button
								className="btn btn-primary"
								onClick={confirmOrder}>
								주문 확인 및 재고 차감
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default FloorInventoryManagement;

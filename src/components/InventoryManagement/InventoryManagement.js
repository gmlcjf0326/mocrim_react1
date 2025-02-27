import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useNotification } from "../../contexts/NotificationContext";
import { QRCodeCanvas } from "qrcode.react";
import "./InventoryManagement.css";

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
	const options = { year: "numeric", month: "2-digit", day: "2-digit" };
	return new Date(dateString).toLocaleDateString(undefined, options);
};

// 수량 배지 클래스 함수
const getQuantityBadgeClass = (item) => {
	if (item.quantity <= item.minQuantity) {
		return "low-stock";
	}
	return "sufficient-stock";
};
/**
 * InventoryManagement 컴포넌트
 *
 * 자재 관리, QR 코드 스캔 및 처리
 * view 타입: list, scan, details, transaction
 */
const InventoryManagement = ({ view = "list" }) => {
	// 라우터 훅
	const { itemId } = useParams();
	const navigate = useNavigate();
	const { showNotification } = useNotification();

	// 상태 관리
	const [activeTab, setActiveTab] = useState("all");
	const [inventoryItems, setInventoryItems] = useState([]);
	const [selectedItem, setSelectedItem] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// QR 코드 스캔 관련 상태
	const [scannedCode, setScannedCode] = useState(null);
	const [isScanning, setIsScanning] = useState(false);
	const scannerIntervalRef = useRef(null);

	// 입출고 폼 데이터
	const [transactionForm, setTransactionForm] = useState({
		type: "out", // 'in' 또는 'out'
		quantity: 1,
		location: "",
		notes: "",
	});

	// 자재 데이터 불러오기 (목업 데이터)
	useEffect(() => {
		const fetchInventoryItems = async () => {
			try {
				setLoading(true);
				// 실제 구현에서는 API 호출로 대체됨
				const mockInventoryItems = [
					{
						id: "INV-KF153",
						name: "강화마루 KF153",
						category: "마루",
						location: "2층 쇼케이스",
						quantity: 120,
						unit: "박스",
						minQuantity: 20,
						qrCode: "INV-KF153-QR",
						lastUpdated: "2023-09-28",
						movements: [
							{
								id: 1,
								type: "in",
								quantity: 50,
								date: "2023-09-15",
								location: "3층 창고",
								notes: "발주 입고",
							},
							{
								id: 2,
								type: "out",
								quantity: 10,
								date: "2023-09-20",
								location: "2층 쇼케이스",
								notes: "주문 ORD-20230001",
							},
							{
								id: 3,
								type: "in",
								quantity: 80,
								date: "2023-09-25",
								location: "3층 창고",
								notes: "발주 입고",
							},
						],
					},
					{
						id: "INV-KF201",
						name: "강화마루 KF201",
						category: "마루",
						location: "2층 쇼케이스",
						quantity: 85,
						unit: "박스",
						minQuantity: 30,
						qrCode: "INV-KF201-QR",
						lastUpdated: "2023-09-26",
						movements: [
							{
								id: 1,
								type: "in",
								quantity: 100,
								date: "2023-09-10",
								location: "3층 창고",
								notes: "발주 입고",
							},
							{
								id: 2,
								type: "out",
								quantity: 15,
								date: "2023-09-26",
								location: "2층 쇼케이스",
								notes: "주문 ORD-20230002",
							},
						],
					},
					{
						id: "INV-KF305",
						name: "강화마루 KF305",
						category: "마루",
						location: "3층 창고",
						quantity: 210,
						unit: "박스",
						minQuantity: 50,
						qrCode: "INV-KF305-QR",
						lastUpdated: "2023-09-18",
						movements: [
							{
								id: 1,
								type: "in",
								quantity: 150,
								date: "2023-09-05",
								location: "3층 창고",
								notes: "발주 입고",
							},
							{
								id: 2,
								type: "in",
								quantity: 60,
								date: "2023-09-18",
								location: "3층 창고",
								notes: "발주 입고",
							},
						],
					},
					{
						id: "INV-M101",
						name: "몰딩 M101",
						category: "몰딩",
						location: "4층 자재실",
						quantity: 350,
						unit: "개",
						minQuantity: 100,
						qrCode: "INV-M101-QR",
						lastUpdated: "2023-09-22",
						movements: [
							{
								id: 1,
								type: "in",
								quantity: 300,
								date: "2023-09-01",
								location: "4층 자재실",
								notes: "발주 입고",
							},
							{
								id: 2,
								type: "in",
								quantity: 200,
								date: "2023-09-15",
								location: "4층 자재실",
								notes: "발주 입고",
							},
							{
								id: 3,
								type: "out",
								quantity: 150,
								date: "2023-09-22",
								location: "4층 자재실",
								notes: "주문 ORD-20230002",
							},
						],
					},
					{
						id: "INV-M203",
						name: "몰딩 M203",
						category: "몰딩",
						location: "4층 자재실",
						quantity: 180,
						unit: "개",
						minQuantity: 80,
						qrCode: "INV-M203-QR",
						lastUpdated: "2023-09-20",
						movements: [
							{
								id: 1,
								type: "in",
								quantity: 200,
								date: "2023-09-10",
								location: "4층 자재실",
								notes: "발주 입고",
							},
							{
								id: 2,
								type: "out",
								quantity: 20,
								date: "2023-09-20",
								location: "4층 자재실",
								notes: "주문 ORD-20230001",
							},
						],
					},
				];

				// 특정 자재 상세 조회 시 해당 자재 저장
				if ((view === "details" || view === "transaction") && itemId) {
					const foundItem = mockInventoryItems.find(
						(item) => item.id === itemId
					);
					if (foundItem) {
						setSelectedItem(foundItem);
					} else {
						setError("요청하신 자재를 찾을 수 없습니다.");
					}
				}

				// 모든 자재 데이터 저장
				setInventoryItems(mockInventoryItems);
				setLoading(false);
			} catch (err) {
				console.error("자재 데이터 로딩 중 오류:", err);
				setError("자재 데이터를 불러오는 데 실패했습니다.");
				setLoading(false);
			}
		};

		fetchInventoryItems();
	}, [view, itemId]);

	// QR 코드 스캔 시뮬레이션
	const simulateScan = () => {
		setIsScanning(true);

		// 실제 구현에서는 카메라 스캔 기능 사용
		// 여기서는 3초 후 목업 QR 코드 결과를 반환하는 시뮬레이션
		scannerIntervalRef.current = setTimeout(() => {
			// 랜덤한 자재 선택
			const randomItem =
				inventoryItems[Math.floor(Math.random() * inventoryItems.length)];
			setScannedCode(randomItem.qrCode);
			setIsScanning(false);

			// QR 코드 스캔 결과 처리
			handleScannedQRCode(randomItem.qrCode);
		}, 3000);
	};

	// QR 코드 스캔 취소
	const cancelScan = () => {
		setIsScanning(false);
		if (scannerIntervalRef.current) {
			clearTimeout(scannerIntervalRef.current);
		}
	};

	// 컴포넌트 언마운트 시 스캔 중지
	useEffect(() => {
		return () => {
			if (scannerIntervalRef.current) {
				clearTimeout(scannerIntervalRef.current);
			}
		};
	}, []);

	// QR 코드 스캔 결과 처리
	const handleScannedQRCode = (qrCode) => {
		// QR 코드에 맞는 자재 찾기
		const foundItem = inventoryItems.find((item) => item.qrCode === qrCode);

		if (foundItem) {
			// 알림 표시
			showNotification({
				title: "QR 코드 스캔 성공",
				message: `${foundItem.name} 자재가 인식되었습니다.`,
				type: "success",
			});

			// 해당 자재의 상세 정보로 이동
			navigate(`/inventory/details/${foundItem.id}`);
		} else {
			// 알림 표시
			showNotification({
				title: "QR 코드 스캔 실패",
				message: "인식할 수 없는 QR 코드입니다.",
				type: "error",
			});
		}
	};

	// 수동으로 QR 코드 입력
	const handleManualQRCode = (e) => {
		e.preventDefault();
		const manualCode = e.target.elements.manualQrCode.value.trim();

		if (manualCode) {
			handleScannedQRCode(manualCode);
		}
	};

	// 입출고 처리 (transaction)
	const handleTransaction = (e) => {
		e.preventDefault();

		if (!selectedItem) return;

		// 출고 시 수량 확인
		if (
			transactionForm.type === "out" &&
			transactionForm.quantity > selectedItem.quantity
		) {
			alert("출고 수량이 현재 재고보다 많습니다.");
			return;
		}

		// 실제 구현에서는 API 호출로 자재 입출고 처리
		const newMovement = {
			id: Date.now(),
			type: transactionForm.type,
			quantity: parseInt(transactionForm.quantity),
			date: new Date().toISOString().split("T")[0],
			location:
				transactionForm.location ||
				(transactionForm.type === "in" ? "입고 위치" : "출고 위치"),
			notes: transactionForm.notes,
		};

		// 자재 수량 계산
		const newQuantity =
			transactionForm.type === "in"
				? selectedItem.quantity + parseInt(transactionForm.quantity)
				: selectedItem.quantity - parseInt(transactionForm.quantity);

		// 자재 정보 업데이트
		const updatedItem = {
			...selectedItem,
			quantity: newQuantity,
			lastUpdated: new Date().toISOString().split("T")[0],
			movements: [newMovement, ...selectedItem.movements],
		};

		// 상태 업데이트
		setSelectedItem(updatedItem);
		setInventoryItems((prevItems) =>
			prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
		);

		// 알림 표시
		showNotification({
			title: "입출고 처리 완료",
			message: `${selectedItem.name} 자재가 ${
				transactionForm.type === "in" ? "입고" : "출고"
			} 처리되었습니다.`,
			type: "success",
		});

		// 상세 페이지로 리다이렉트
		navigate(`/inventory/details/${selectedItem.id}`);
	};

	// 자재 목록 뷰 렌더링
	const renderInventoryListView = () => {
		return (
			<>
				<div className="inventory-header">
					<h1 className="module-title">자재 관리</h1>
					<p className="inventory-subtitle">자재 목록 및 관리</p>

					<div className="tab-navigation">
						<button
							className={`tab-button ${activeTab === "all" ? "active" : ""}`}
							onClick={() => setActiveTab("all")}>
							전체 자재
						</button>
						<button
							className={`tab-button ${
								activeTab === "low-stock" ? "active" : ""
							}`}
							onClick={() => setActiveTab("low-stock")}>
							재고 부족
						</button>
					</div>
				</div>

				<div className="inventory-list-section">
					<div className="section-title">
						<span>자재 목록</span>
						<span className="item-count">{inventoryItems.length}개 항목</span>
					</div>

					{loading ? (
						<div className="loading-indicator">
							자재 데이터를 불러오는 중...
						</div>
					) : error ? (
						<div className="error-message">{error}</div>
					) : inventoryItems.length > 0 ? (
						<table className="inventory-table">
							<thead>
								<tr>
									<th>자재번호</th>
									<th>자재명</th>
									<th>카테고리</th>
									<th>위치</th>
									<th>수량</th>
									<th>작업</th>
								</tr>
							</thead>
							<tbody>
								{inventoryItems.map((item) => (
									<tr key={item.id}>
										<td>{item.id}</td>
										<td>{item.name}</td>
										<td>{item.category}</td>
										<td>{item.location}</td>
										<td>
											<span
												className={`quantity-badge ${getQuantityBadgeClass(
													item
												)}`}>
												{item.quantity} {item.unit}
											</span>
										</td>
										<td className="action-buttons">
											<button
												className="btn btn-secondary"
												onClick={() =>
													navigate(`/inventory/details/${item.id}`)
												}>
												상세보기
											</button>
											<button
												className="btn btn-primary"
												onClick={() =>
													navigate(`/inventory/transaction/${item.id}`)
												}>
												입출고 처리
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<div className="no-data">등록된 자재가 없습니다.</div>
					)}
				</div>
			</>
		);
	};

	// QR 코드 스캔 뷰 렌더링
	const renderQRScanView = () => {
		return (
			<div className="qr-scanner-container">
				<h1 className="scanner-title">QR 코드 스캔</h1>
				<p className="scanner-description">
					자재에 부착된 QR 코드를 스캔하여 자재 정보를 확인하세요.
				</p>

				<div className="scanner-area">
					{isScanning ? (
						<div className="scanner-placeholder">
							<i className="ri-loader-4-line ri-spin"></i>
							<span>스캔 중...</span>
						</div>
					) : (
						<div className="scanner-placeholder">
							<i className="ri-qr-code-line"></i>
							<span>QR 코드를 스캔하세요</span>
						</div>
					)}
				</div>

				<div className="scanner-action">
					<button
						className="btn btn-primary"
						onClick={simulateScan}
						disabled={isScanning}>
						스캔 시작
					</button>
					<button
						className="btn btn-secondary"
						onClick={cancelScan}
						disabled={!isScanning}>
						취소
					</button>
				</div>

				<form
					onSubmit={handleManualQRCode}
					style={{ marginTop: "20px" }}>
					<input
						type="text"
						name="manualQrCode"
						placeholder="수동으로 QR 코드 입력"
						className="form-input"
					/>
					<button
						type="submit"
						className="btn btn-secondary">
						확인
					</button>
				</form>
			</div>
		);
	};

	// 자재 상세 뷰 렌더링
	const renderInventoryDetailsView = () => {
		if (loading) {
			return (
				<div className="loading-indicator">자재 정보를 불러오는 중...</div>
			);
		}

		if (error || !selectedItem) {
			return (
				<div className="error-message">
					{error || "자재 정보를 찾을 수 없습니다."}
				</div>
			);
		}

		return (
			<div className="inventory-details">
				<div className="inventory-details-header">
					<h1 className="module-title">자재 상세 정보</h1>
					<div className="qr-code-display">
						<QRCodeCanvas
							value={selectedItem.qrCode}
							size={100}
						/>
						<span>QR 코드</span>
					</div>
				</div>

				<div className="divider"></div>

				<div className="details-row">
					<div className="details-col">
						<h2 className="form-section-title">기본 정보</h2>
						<div className="details-group">
							<div className="details-label">자재명</div>
							<div className="details-value">{selectedItem.name}</div>
						</div>
						<div className="details-group">
							<div className="details-label">카테고리</div>
							<div className="details-value">{selectedItem.category}</div>
						</div>
						<div className="details-group">
							<div className="details-label">위치</div>
							<div className="details-value">{selectedItem.location}</div>
						</div>
					</div>

					<div className="details-col">
						<h2 className="form-section-title">재고 정보</h2>
						<div className="details-group">
							<div className="details-label">현재 수량</div>
							<div className="details-value">
								<span
									className={`quantity-badge ${getQuantityBadgeClass(
										selectedItem
									)}`}>
									{selectedItem.quantity} {selectedItem.unit}
								</span>
							</div>
						</div>
						<div className="details-group">
							<div className="details-label">최소 수량</div>
							<div className="details-value">
								{selectedItem.minQuantity} {selectedItem.unit}
							</div>
						</div>
						<div className="details-group">
							<div className="details-label">마지막 업데이트</div>
							<div className="details-value">
								{formatDate(selectedItem.lastUpdated)}
							</div>
						</div>
					</div>
				</div>

				<div className="divider"></div>

				<div className="movement-history">
					<h2 className="form-section-title">입출고 이력</h2>
					<table className="movement-table">
						<thead>
							<tr>
								<th>날짜</th>
								<th>유형</th>
								<th>수량</th>
								<th>위치</th>
								<th>비고</th>
							</tr>
						</thead>
						<tbody>
							{selectedItem.movements.map((movement) => (
								<tr key={movement.id}>
									<td>{formatDate(movement.date)}</td>
									<td>
										<span
											className={`status-badge ${
												movement.type === "in"
													? "status-completed"
													: "status-cancelled"
											}`}>
											{movement.type === "in" ? "입고" : "출고"}
										</span>
									</td>
									<td>
										{movement.quantity} {selectedItem.unit}
									</td>
									<td>{movement.location}</td>
									<td>{movement.notes}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<div className="divider"></div>

				<div
					style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
					<Link to="/inventory/list">
						<button className="btn btn-secondary">목록으로</button>
					</Link>
					<Link to={`/inventory/transaction/${selectedItem.id}`}>
						<button className="btn btn-primary">입출고 처리</button>
					</Link>
				</div>
			</div>
		);
	};

	// 자재 입출고 뷰 렌더링
	const renderInventoryTransactionView = () => {
		if (loading) {
			return (
				<div className="loading-indicator">자재 정보를 불러오는 중...</div>
			);
		}

		if (error || !selectedItem) {
			return (
				<div className="error-message">
					{error || "자재 정보를 찾을 수 없습니다."}
				</div>
			);
		}

		return (
			<div className="transaction-form">
				<h1 className="module-title">자재 입출고 처리</h1>
				<p className="inventory-subtitle">
					{selectedItem.name} ({selectedItem.id})
				</p>

				<div
					className="details-group"
					style={{ marginBottom: "20px" }}>
					<div className="details-label">현재 재고</div>
					<div className="details-value">
						<span
							className={`quantity-badge ${getQuantityBadgeClass(
								selectedItem
							)}`}>
							{selectedItem.quantity} {selectedItem.unit}
						</span>
					</div>
				</div>

				<form onSubmit={handleTransaction}>
					<div className="form-section">
						<h2 className="form-section-title">입출고 정보</h2>
						<div className="form-row">
							<div className="form-group">
								<label className="form-label">처리 유형 *</label>
								<select
									className="form-select"
									value={transactionForm.type}
									onChange={(e) =>
										setTransactionForm({
											...transactionForm,
											type: e.target.value,
										})
									}
									required>
									<option value="in">입고</option>
									<option value="out">출고</option>
								</select>
							</div>
							<div className="form-group">
								<label className="form-label">수량 *</label>
								<input
									type="number"
									className="form-input"
									value={transactionForm.quantity}
									onChange={(e) =>
										setTransactionForm({
											...transactionForm,
											quantity: Math.max(1, parseInt(e.target.value) || 0),
										})
									}
									min="1"
									required
								/>
							</div>
						</div>
						<div className="form-row">
							<div className="form-group">
								<label className="form-label">위치</label>
								<input
									type="text"
									className="form-input"
									value={transactionForm.location}
									onChange={(e) =>
										setTransactionForm({
											...transactionForm,
											location: e.target.value,
										})
									}
									placeholder={
										transactionForm.type === "in" ? "입고 위치" : "출고 위치"
									}
								/>
							</div>
						</div>
						<div className="form-row">
							<div className="form-group">
								<label className="form-label">비고</label>
								<textarea
									className="form-textarea"
									value={transactionForm.notes}
									onChange={(e) =>
										setTransactionForm({
											...transactionForm,
											notes: e.target.value,
										})
									}
									placeholder="추가 정보 입력"
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
						<Link to={`/inventory/details/${selectedItem.id}`}>
							<button
								type="button"
								className="btn btn-secondary">
								취소
							</button>
						</Link>
						<button
							type="submit"
							className="btn btn-primary">
							{transactionForm.type === "in" ? "입고" : "출고"} 처리
						</button>
					</div>
				</form>
			</div>
		);
	};

	// 현재 뷰에 맞는 컴포넌트 렌더링
	const renderContent = () => {
		switch (view) {
			case "list":
				return renderInventoryListView();
			case "scan":
				return renderQRScanView();
			case "details":
				return renderInventoryDetailsView();
			case "transaction":
				return renderInventoryTransactionView();
			default:
				return renderInventoryListView();
		}
	};

	return <div className="inventory-management">{renderContent()}</div>;
};

export default InventoryManagement;

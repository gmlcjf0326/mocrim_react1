import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useNotification } from "../../contexts/NotificationContext";
import "./InventoryManagement.css";

/**
 * InventoryManagement Component
 *
 * Manages inventory for both raw materials and finished products
 * with stock level monitoring, alerts, and inventory operations
 */
const InventoryManagement = ({ inventoryType = "raw-material" }) => {
	const [inventory, setInventory] = useState([]);
	const [filteredInventory, setFilteredInventory] = useState([]);
	const [selectedItem, setSelectedItem] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [statusFilter, setStatusFilter] = useState("all");
	const [showAddModal, setShowAddModal] = useState(false);
	const [showAdjustModal, setShowAdjustModal] = useState(false);
	const [itemHistory, setItemHistory] = useState([]);
	const [loadingHistory, setLoadingHistory] = useState(false);

	const { showNotification } = useNotification();

	// Mock data for raw materials inventory
	const mockRawMaterials = [
		{
			id: 1,
			code: "RM-1001",
			name: "PB E0 18mm",
			category: "panel",
			description: "파티클보드 E0 등급 18mm",
			stock: 850,
			unit: "장",
			minStock: 500,
			maxStock: 1000,
			status: "normal",
			location: "3층-A01",
			supplier: "동화기업",
			lastUpdated: "2025-02-20",
			price: 28000,
		},
		{
			id: 2,
			code: "RM-1002",
			name: "PB E1 15mm",
			category: "panel",
			description: "파티클보드 E1 등급 15mm",
			stock: 320,
			unit: "장",
			minStock: 300,
			maxStock: 800,
			status: "warning",
			location: "3층-A02",
			supplier: "한솔홈데코",
			lastUpdated: "2025-02-22",
			price: 25000,
		},
		{
			id: 3,
			code: "RM-2001",
			name: "TL-400(친환경)",
			category: "adhesive",
			description: "친환경 접착제 TL-400",
			stock: 120,
			unit: "통",
			minStock: 100,
			maxStock: 200,
			status: "normal",
			location: "3층-B03",
			supplier: "성창기업",
			lastUpdated: "2025-02-18",
			price: 42000,
		},
		{
			id: 4,
			code: "RM-3001",
			name: "3808-3(DH-JO-11) O/L",
			category: "finish",
			description: "오버레이 시트지 3808-3 모델",
			stock: 150,
			unit: "장",
			minStock: 200,
			maxStock: 400,
			status: "warning",
			location: "3층-C02",
			supplier: "디자인월",
			lastUpdated: "2025-02-19",
			price: 15000,
		},
	];

	// Mock data for finished products inventory
	const mockProducts = [
		{
			id: 1,
			code: "P001",
			name: "3808-3/양면 E0 18mm",
			category: "laminated-board",
			description: "3808-3 양면 오버레이 E0 18mm 합판",
			stock: 120,
			unit: "장",
			minStock: 80,
			maxStock: 200,
			status: "normal",
			location: "2층-A05",
			lastUpdated: "2025-02-21",
			price: 45000,
		},
		{
			id: 2,
			code: "P002",
			name: "UV무늬목 15mm",
			category: "uv-board",
			description: "UV코팅 무늬목 15mm 합판",
			stock: 80,
			unit: "장",
			minStock: 60,
			maxStock: 150,
			status: "normal",
			location: "2층-A08",
			lastUpdated: "2025-02-20",
			price: 55000,
		},
		{
			id: 3,
			code: "P003",
			name: "방염합판 9mm",
			category: "fire-resistant",
			description: "방염처리된 9mm 합판",
			stock: 30,
			unit: "장",
			minStock: 40,
			maxStock: 100,
			status: "critical",
			location: "2층-B02",
			lastUpdated: "2025-02-22",
			price: 62000,
		},
		{
			id: 4,
			code: "P004",
			name: "씽크대문짝 W600",
			category: "cabinet-door",
			description: "W600 규격 씽크대문짝",
			stock: 35,
			unit: "개",
			minStock: 30,
			maxStock: 60,
			status: "normal",
			location: "2층-C01",
			lastUpdated: "2025-02-23",
			price: 38000,
		},
	];

	// Mock inventory history data
	const mockInventoryHistory = {
		1: [
			{
				id: 1,
				date: "2025-02-20",
				type: "입고",
				quantity: 150,
				balance: 850,
				reference: "PO-2025022001",
				user: "김창고",
				notes: "동화기업 정기 입고",
			},
			{
				id: 2,
				date: "2025-02-18",
				type: "출고",
				quantity: -50,
				balance: 700,
				reference: "WO-2025021801",
				user: "박생산",
				notes: "생산 투입",
			},
			{
				id: 3,
				date: "2025-02-15",
				type: "입고",
				quantity: 200,
				balance: 750,
				reference: "PO-2025021501",
				user: "김창고",
				notes: "동화기업 정기 입고",
			},
		],
	};

	// Category options
	const categoryOptions = {
		"raw-material": [
			{ id: "all", name: "전체" },
			{ id: "panel", name: "판재" },
			{ id: "adhesive", name: "접착제" },
			{ id: "finish", name: "마감재" },
		],
		product: [
			{ id: "all", name: "전체" },
			{ id: "laminated-board", name: "합판" },
			{ id: "uv-board", name: "UV합판" },
			{ id: "fire-resistant", name: "방염합판" },
			{ id: "cabinet-door", name: "씽크대문짝" },
		],
	};

	// Status filter options
	const statusOptions = [
		{ id: "all", name: "전체" },
		{ id: "normal", name: "정상" },
		{ id: "warning", name: "요주의" },
		{ id: "critical", name: "부족" },
	];

	// Load inventory data
	useEffect(() => {
		const fetchInventory = async () => {
			setLoading(true);
			try {
				// In a real app, this would be an API call
				// const response = await api.getInventory(inventoryType);
				// setInventory(response.data);

				// Using mock data for demonstration
				setTimeout(() => {
					setInventory(
						inventoryType === "raw-material" ? mockRawMaterials : mockProducts
					);
					setError(null);
					setLoading(false);
				}, 600);
			} catch (err) {
				setError("Failed to load inventory data");
				setLoading(false);
			}
		};

		fetchInventory();
	}, [inventoryType]);

	// Filter inventory data based on search, category, and status
	useEffect(() => {
		if (!inventory || inventory.length === 0) return;

		let filtered = [...inventory];

		// Apply search filter
		if (searchTerm) {
			filtered = filtered.filter(
				(item) =>
					item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
					item.name.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// Apply category filter
		if (categoryFilter !== "all") {
			filtered = filtered.filter((item) => item.category === categoryFilter);
		}

		// Apply status filter
		if (statusFilter !== "all") {
			filtered = filtered.filter((item) => item.status === statusFilter);
		}

		setFilteredInventory(filtered);

		// Auto-select first item if available and none selected
		if (filtered.length > 0 && !selectedItem) {
			setSelectedItem(filtered[0]);
		} else if (filtered.length === 0) {
			setSelectedItem(null);
		} else if (
			selectedItem &&
			!filtered.some((item) => item.id === selectedItem.id)
		) {
			// If currently selected item is not in filtered results
			setSelectedItem(filtered[0]);
		}
	}, [searchTerm, categoryFilter, statusFilter, inventory, selectedItem]);

	// Load item history when an item is selected
	useEffect(() => {
		if (!selectedItem) return;

		const fetchItemHistory = async () => {
			setLoadingHistory(true);
			try {
				// In a real app, this would be an API call
				// const response = await api.getInventoryItemHistory(selectedItem.id);
				// setItemHistory(response.data);

				// Using mock data for demonstration
				setTimeout(() => {
					setItemHistory(mockInventoryHistory[selectedItem.id] || []);
					setLoadingHistory(false);
				}, 400);
			} catch (err) {
				setLoadingHistory(false);
			}
		};

		fetchItemHistory();
	}, [selectedItem]);

	// Handle item selection
	const handleItemSelect = useCallback((item) => {
		setSelectedItem(item);
	}, []);

	// Handle search input change
	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};

	// Handle category filter change
	const handleCategoryFilterChange = (e) => {
		setCategoryFilter(e.target.value);
	};

	// Handle status filter change
	const handleStatusFilterChange = (e) => {
		setStatusFilter(e.target.value);
	};

	// Format currency for display
	const formatCurrency = (amount) => {
		return amount.toLocaleString("ko-KR") + "원";
	};

	// Get status badge for display
	const getStatusBadge = (status) => {
		switch (status) {
			case "normal":
				return <span className="status-badge status-normal">정상</span>;
			case "warning":
				return <span className="status-badge status-warning">요주의</span>;
			case "critical":
				return <span className="status-badge status-critical">부족</span>;
			default:
				return <span className="status-badge">{status}</span>;
		}
	};

	// Show add item modal
	const handleAddItem = () => {
		setShowAddModal(true);
	};

	// Show adjust stock modal
	const handleAdjustStock = () => {
		if (!selectedItem) {
			showNotification({
				title: "재고 조정 오류",
				message: "재고를 조정할 항목을 선택해주세요.",
				type: "warning",
			});
			return;
		}

		setShowAdjustModal(true);
	};

	// Mock function to adjust stock
	const adjustStock = (id, quantity, reason) => {
		// In a real app, this would be an API call
		// await api.adjustInventoryStock(id, quantity, reason);

		const itemIndex = inventory.findIndex((item) => item.id === id);
		if (itemIndex === -1) return;

		const updatedInventory = [...inventory];
		const updatedItem = { ...updatedInventory[itemIndex] };

		updatedItem.stock += parseInt(quantity, 10);

		// Update status based on new stock level
		if (updatedItem.stock <= updatedItem.minStock * 0.5) {
			updatedItem.status = "critical";
		} else if (updatedItem.stock <= updatedItem.minStock) {
			updatedItem.status = "warning";
		} else {
			updatedItem.status = "normal";
		}

		updatedItem.lastUpdated = new Date().toISOString().split("T")[0];

		updatedInventory[itemIndex] = updatedItem;
		setInventory(updatedInventory);
		setSelectedItem(updatedItem);

		setShowAdjustModal(false);

		showNotification({
			title: "재고 조정 완료",
			message: `${updatedItem.name} 재고가 ${
				quantity > 0 ? "증가" : "감소"
			}했습니다.`,
			type: "success",
		});
	};

	// Handle stock adjustment form submission
	const handleStockAdjustmentSubmit = (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const quantity = formData.get("quantity");
		const reason = formData.get("reason");

		adjustStock(selectedItem.id, parseInt(quantity, 10), reason);
	};

	// Handle add item form submission
	const handleAddItemSubmit = (e) => {
		e.preventDefault();
		// Implementation for adding a new inventory item
		// In a real app, this would be an API call

		setShowAddModal(false);

		showNotification({
			title: "항목 추가 완료",
			message: "새로운 재고 항목이 추가되었습니다.",
			type: "success",
		});
	};

	// Render inventory list
	const renderInventoryList = () => {
		if (loading) {
			return (
				<div className="loading-indicator">재고 정보를 불러오는 중...</div>
			);
		}

		if (error) {
			return <div className="error-message">{error}</div>;
		}

		if (filteredInventory.length === 0) {
			return <div className="no-data">검색 결과가 없습니다.</div>;
		}

		return (
			<table className="inventory-table">
				<thead>
					<tr>
						<th>코드</th>
						<th>제품명</th>
						<th>카테고리</th>
						<th>재고</th>
						<th>위치</th>
						<th>상태</th>
					</tr>
				</thead>
				<tbody>
					{filteredInventory.map((item) => (
						<tr
							key={item.id}
							className={`inventory-item ${
								selectedItem?.id === item.id ? "selected" : ""
							}`}
							onClick={() => handleItemSelect(item)}>
							<td>{item.code}</td>
							<td>{item.name}</td>
							<td>
								{categoryOptions[inventoryType].find(
									(cat) => cat.id === item.category
								)?.name || item.category}
							</td>
							<td>
								{item.stock} {item.unit}
							</td>
							<td>{item.location}</td>
							<td>{getStatusBadge(item.status)}</td>
						</tr>
					))}
				</tbody>
			</table>
		);
	};

	// Render item details
	const renderItemDetails = () => {
		if (!selectedItem) {
			return (
				<div className="no-data">상세 정보를 확인하려면 항목을 선택하세요.</div>
			);
		}

		return (
			<div className="item-details">
				<h3 className="details-title">{selectedItem.name}</h3>

				<div className="details-grid">
					<div className="details-section basic-details">
						<h4 className="section-subtitle">기본 정보</h4>
						<div className="details-columns">
							<div className="details-column">
								<div className="details-item">
									<div className="details-label">코드</div>
									<div className="details-value">{selectedItem.code}</div>
								</div>
								<div className="details-item">
									<div className="details-label">제품명</div>
									<div className="details-value">{selectedItem.name}</div>
								</div>
								<div className="details-item">
									<div className="details-label">카테고리</div>
									<div className="details-value">
										{categoryOptions[inventoryType].find(
											(cat) => cat.id === selectedItem.category
										)?.name || selectedItem.category}
									</div>
								</div>
								<div className="details-item">
									<div className="details-label">설명</div>
									<div className="details-value">
										{selectedItem.description}
									</div>
								</div>
							</div>

							<div className="details-column">
								<div className="details-item">
									<div className="details-label">단가</div>
									<div className="details-value">
										{formatCurrency(selectedItem.price)}
									</div>
								</div>
								<div className="details-item">
									<div className="details-label">위치</div>
									<div className="details-value">{selectedItem.location}</div>
								</div>
								<div className="details-item">
									<div className="details-label">최종 업데이트</div>
									<div className="details-value">
										{selectedItem.lastUpdated}
									</div>
								</div>
								{inventoryType === "raw-material" && (
									<div className="details-item">
										<div className="details-label">공급업체</div>
										<div className="details-value">{selectedItem.supplier}</div>
									</div>
								)}
							</div>
						</div>
					</div>

					<div className="details-section stock-details">
						<h4 className="section-subtitle">재고 정보</h4>
						<div className="stock-info">
							<div className="stock-metric">
								<div className="stock-label">현재 재고</div>
								<div className={`stock-value status-${selectedItem.status}`}>
									{selectedItem.stock} {selectedItem.unit}
								</div>
							</div>
							<div className="stock-metric">
								<div className="stock-label">최소 재고</div>
								<div className="stock-value">
									{selectedItem.minStock} {selectedItem.unit}
								</div>
							</div>
							<div className="stock-metric">
								<div className="stock-label">최대 재고</div>
								<div className="stock-value">
									{selectedItem.maxStock} {selectedItem.unit}
								</div>
							</div>
							<div className="stock-metric">
								<div className="stock-label">상태</div>
								<div className="stock-value">
									{getStatusBadge(selectedItem.status)}
								</div>
							</div>
						</div>

						<div className="stock-chart">
							<div className="stock-level-container">
								<div
									className="level-indicator min-level"
									style={{
										left: `${
											(selectedItem.minStock / selectedItem.maxStock) * 100
										}%`,
									}}
								/>
								<div
									className={`level-bar status-${selectedItem.status}`}
									style={{
										width: `${
											(selectedItem.stock / selectedItem.maxStock) * 100
										}%`,
									}}
								/>
							</div>
							<div className="level-labels">
								<div className="level-label">0</div>
								<div className="level-label min-label">
									{selectedItem.minStock} (최소)
								</div>
								<div className="level-label max-label">
									{selectedItem.maxStock} (최대)
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="action-buttons">
					<button
						className="action-button"
						onClick={handleAdjustStock}>
						재고 조정
					</button>
					<button className="action-button">
						{inventoryType === "raw-material" ? "발주 요청" : "생산 계획"}
					</button>
					<button className="action-button">QR 코드 생성</button>
					<button className="action-button">상세 분석</button>
				</div>

				<div className="item-history">
					<h4 className="section-subtitle">재고 이력</h4>
					{loadingHistory ? (
						<div className="loading-indicator">이력을 불러오는 중...</div>
					) : itemHistory.length === 0 ? (
						<div className="no-data">재고 이력이 없습니다.</div>
					) : (
						<table className="history-table">
							<thead>
								<tr>
									<th>일자</th>
									<th>유형</th>
									<th>수량</th>
									<th>잔고</th>
									<th>참조</th>
									<th>담당자</th>
									<th>비고</th>
								</tr>
							</thead>
							<tbody>
								{itemHistory.map((history) => (
									<tr key={history.id}>
										<td>{history.date}</td>
										<td>{history.type}</td>
										<td
											className={
												history.quantity > 0 ? "increase" : "decrease"
											}>
											{history.quantity > 0 ? "+" : ""}
											{history.quantity} {selectedItem.unit}
										</td>
										<td>
											{history.balance} {selectedItem.unit}
										</td>
										<td>{history.reference}</td>
										<td>{history.user}</td>
										<td>{history.notes}</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>
			</div>
		);
	};

	// Render stock adjustment modal
	const renderAdjustStockModal = () => {
		if (!showAdjustModal || !selectedItem) return null;

		return (
			<div className="modal-overlay">
				<div className="modal">
					<div className="modal-header">
						<h3 className="modal-title">재고 조정 - {selectedItem.name}</h3>
						<button
							className="modal-close"
							onClick={() => setShowAdjustModal(false)}
							aria-label="Close modal">
							×
						</button>
					</div>
					<form
						onSubmit={handleStockAdjustmentSubmit}
						className="modal-body">
						<div className="form-group">
							<label
								htmlFor="current-stock"
								className="form-label">
								현재 재고
							</label>
							<input
								type="text"
								id="current-stock"
								className="form-control"
								value={`${selectedItem.stock} ${selectedItem.unit}`}
								readOnly
							/>
						</div>

						<div className="form-group">
							<label
								htmlFor="quantity"
								className="form-label">
								조정 수량 (+ 증가, - 감소)
							</label>
							<input
								type="number"
								id="quantity"
								name="quantity"
								className="form-control"
								required
							/>
							<div className="form-hint">예: +10 (입고), -5 (출고)</div>
						</div>

						<div className="form-group">
							<label
								htmlFor="reason"
								className="form-label">
								조정 사유
							</label>
							<select
								id="reason"
								name="reason"
								className="form-control"
								required>
								<option value="">조정 사유 선택</option>
								<option value="purchase">구매/입고</option>
								<option value="production">생산 투입</option>
								<option value="return">반품</option>
								<option value="damaged">손상/폐기</option>
								<option value="recount">재고 실사</option>
								<option value="other">기타</option>
							</select>
						</div>

						<div className="form-group">
							<label
								htmlFor="notes"
								className="form-label">
								상세 내용
							</label>
							<textarea
								id="notes"
								name="notes"
								className="form-control"
								rows="3"
								placeholder="조정에 대한 상세 내용을 입력하세요"></textarea>
						</div>

						<div className="modal-footer">
							<button
								type="submit"
								className="btn btn-primary">
								재고 조정
							</button>
							<button
								type="button"
								className="btn btn-secondary"
								onClick={() => setShowAdjustModal(false)}>
								취소
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	};

	// Render add item modal
	const renderAddItemModal = () => {
		if (!showAddModal) return null;

		return (
			<div className="modal-overlay">
				<div className="modal">
					<div className="modal-header">
						<h3 className="modal-title">
							{inventoryType === "raw-material"
								? "새 원자재 등록"
								: "새 제품 등록"}
						</h3>
						<button
							className="modal-close"
							onClick={() => setShowAddModal(false)}
							aria-label="Close modal">
							×
						</button>
					</div>
					<form
						onSubmit={handleAddItemSubmit}
						className="modal-body">
						<div className="form-row">
							<div className="form-col">
								<div className="form-group">
									<label
										htmlFor="item-code"
										className="form-label">
										코드
									</label>
									<input
										type="text"
										id="item-code"
										name="code"
										className="form-control"
										required
									/>
								</div>
							</div>
							<div className="form-col">
								<div className="form-group">
									<label
										htmlFor="item-category"
										className="form-label">
										카테고리
									</label>
									<select
										id="item-category"
										name="category"
										className="form-control"
										required>
										<option value="">카테고리 선택</option>
										{categoryOptions[inventoryType]
											.filter((cat) => cat.id !== "all")
											.map((category) => (
												<option
													key={category.id}
													value={category.id}>
													{category.name}
												</option>
											))}
									</select>
								</div>
							</div>
						</div>

						<div className="form-group">
							<label
								htmlFor="item-name"
								className="form-label">
								이름
							</label>
							<input
								type="text"
								id="item-name"
								name="name"
								className="form-control"
								required
							/>
						</div>

						<div className="form-group">
							<label
								htmlFor="item-description"
								className="form-label">
								설명
							</label>
							<textarea
								id="item-description"
								name="description"
								className="form-control"
								rows="2"></textarea>
						</div>

						<div className="form-row">
							<div className="form-col">
								<div className="form-group">
									<label
										htmlFor="item-stock"
										className="form-label">
										초기 재고
									</label>
									<input
										type="number"
										id="item-stock"
										name="stock"
										className="form-control"
										required
										min="0"
									/>
								</div>
							</div>
							<div className="form-col">
								<div className="form-group">
									<label
										htmlFor="item-unit"
										className="form-label">
										단위
									</label>
									<input
										type="text"
										id="item-unit"
										name="unit"
										className="form-control"
										required
										placeholder="장, 개, 통 등"
									/>
								</div>
							</div>
						</div>

						<div className="form-row">
							<div className="form-col">
								<div className="form-group">
									<label
										htmlFor="item-min-stock"
										className="form-label">
										최소 재고
									</label>
									<input
										type="number"
										id="item-min-stock"
										name="minStock"
										className="form-control"
										required
										min="0"
									/>
								</div>
							</div>
							<div className="form-col">
								<div className="form-group">
									<label
										htmlFor="item-max-stock"
										className="form-label">
										최대 재고
									</label>
									<input
										type="number"
										id="item-max-stock"
										name="maxStock"
										className="form-control"
										required
										min="0"
									/>
								</div>
							</div>
						</div>

						<div className="form-row">
							<div className="form-col">
								<div className="form-group">
									<label
										htmlFor="item-price"
										className="form-label">
										단가
									</label>
									<input
										type="number"
										id="item-price"
										name="price"
										className="form-control"
										required
										min="0"
									/>
								</div>
							</div>
							<div className="form-col">
								<div className="form-group">
									<label
										htmlFor="item-location"
										className="form-label">
										보관 위치
									</label>
									<input
										type="text"
										id="item-location"
										name="location"
										className="form-control"
										required
									/>
								</div>
							</div>
						</div>

						{inventoryType === "raw-material" && (
							<div className="form-group">
								<label
									htmlFor="item-supplier"
									className="form-label">
									공급업체
								</label>
								<input
									type="text"
									id="item-supplier"
									name="supplier"
									className="form-control"
									required
								/>
							</div>
						)}

						<div className="modal-footer">
							<button
								type="submit"
								className="btn btn-primary">
								등록
							</button>
							<button
								type="button"
								className="btn btn-secondary"
								onClick={() => setShowAddModal(false)}>
								취소
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	};

	return (
		<div className="inventory-management">
			<div className="inventory-header">
				<h2 className="page-title">
					{inventoryType === "raw-material"
						? "원자재 재고 관리"
						: "제품 재고 관리"}
				</h2>

				<div className="inventory-filters">
					<div className="search-form">
						<input
							type="text"
							className="search-input"
							placeholder="코드 또는 이름으로 검색"
							value={searchTerm}
							onChange={handleSearchChange}
						/>
					</div>

					<div className="filter-selects">
						<div className="filter-group">
							<label htmlFor="category-filter">카테고리:</label>
							<select
								id="category-filter"
								className="filter-select"
								value={categoryFilter}
								onChange={handleCategoryFilterChange}>
								{categoryOptions[inventoryType].map((option) => (
									<option
										key={option.id}
										value={option.id}>
										{option.name}
									</option>
								))}
							</select>
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

					<div className="inventory-actions">
						<button
							onClick={handleAddItem}
							className="action-button add-button">
							{inventoryType === "raw-material" ? "원자재 추가" : "제품 추가"}
						</button>
					</div>
				</div>
			</div>

			<div className="inventory-content">
				<div className="inventory-list-section">
					<h3 className="section-title">
						{inventoryType === "raw-material" ? "원자재 목록" : "제품 목록"}
						<span className="item-count">
							({filteredInventory.length}/{inventory.length})
						</span>
					</h3>
					{renderInventoryList()}
				</div>

				<div className="inventory-details-section">{renderItemDetails()}</div>
			</div>

			{renderAdjustStockModal()}
			{renderAddItemModal()}
		</div>
	);
};

InventoryManagement.propTypes = {
	inventoryType: PropTypes.oneOf(["raw-material", "product"]),
};

export default InventoryManagement;

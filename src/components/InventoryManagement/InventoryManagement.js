import React, { useState, useEffect, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import "./InventoryManagement.css";

/**
 * InventoryManagement Component
 *
 * A comprehensive component for managing inventory of raw materials and finished products,
 * with features for stock tracking, alerts for low inventory, and QR code integration.
 */
const InventoryManagement = ({ inventoryType = "raw-material" }) => {
	// State management
	const [activeInventoryType, setActiveInventoryType] = useState(inventoryType);
	const [items, setItems] = useState([]);
	const [filteredItems, setFilteredItems] = useState([]);
	const [selectedItem, setSelectedItem] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [stockFilter, setStockFilter] = useState("all");
	const [inventoryHistory, setInventoryHistory] = useState([]);
	const [itemLocations, setItemLocations] = useState([]);
	const [processorInventory, setProcessorInventory] = useState([]);
	const [loading, setLoading] = useState({
		items: false,
		history: false,
		locations: false,
		processors: false,
	});
	const [error, setError] = useState({
		items: null,
		history: null,
		locations: null,
		processors: null,
	});

	// Mock data - would be replaced with API calls in production
	const mockRawMaterials = [
		{
			id: 1,
			code: "RM-1001",
			name: "PB E0 18mm",
			category: "particle-board",
			stock: 850,
			unit: "장",
			minStock: 500,
			status: "normal",
			price: 30000,
			locationCode: "A01-05",
			supplier: "동화기업",
		},
		{
			id: 2,
			code: "RM-1002",
			name: "PB E1 15mm",
			category: "particle-board",
			stock: 320,
			unit: "장",
			minStock: 300,
			status: "warning",
			price: 28000,
			locationCode: "A01-06",
			supplier: "동화기업",
		},
		{
			id: 3,
			code: "RM-2001",
			name: "TL-400(친환경)",
			category: "adhesive",
			stock: 120,
			unit: "통",
			minStock: 100,
			status: "normal",
			price: 50000,
			locationCode: "B03-02",
			supplier: "코스모텍",
		},
		{
			id: 4,
			code: "RM-3001",
			name: "3808-3(DH-JO-11) O/L",
			category: "veneer",
			stock: 150,
			unit: "장",
			minStock: 200,
			status: "warning",
			price: 15000,
			locationCode: "C02-08",
			supplier: "디자인월",
		},
	];

	const mockProducts = [
		{
			id: 1,
			code: "P001",
			name: "3808-3/양면 E0 18mm",
			category: "laminated-board",
			stock: 120,
			unit: "장",
			minStock: 50,
			status: "normal",
			price: 45000,
			locationCode: "D01-03",
			producer: "우드에스티",
		},
		{
			id: 2,
			code: "P002",
			name: "UV무늬목 15mm",
			category: "uv-board",
			stock: 80,
			unit: "장",
			minStock: 40,
			status: "normal",
			price: 55000,
			locationCode: "D02-05",
			producer: "우드에스티",
		},
		{
			id: 3,
			code: "P003",
			name: "방염합판 9mm",
			category: "fire-resistant-board",
			stock: 30,
			unit: "장",
			minStock: 50,
			status: "danger",
			price: 62000,
			locationCode: "D03-02",
			producer: "A임가공",
		},
		{
			id: 4,
			code: "P004",
			name: "씽크대문짝 W600",
			category: "door",
			stock: 35,
			unit: "개",
			minStock: 20,
			status: "normal",
			price: 38000,
			locationCode: "E01-01",
			producer: "대화동공장",
		},
	];

	const mockInventoryHistory = {
		"RM-1001": [
			{
				id: 1,
				date: "2025-02-25",
				type: "입고",
				quantity: 200,
				balance: 850,
				reference: "PO-2025022501",
				note: "동화기업 매입",
			},
			{
				id: 2,
				date: "2025-02-22",
				type: "출고",
				quantity: 50,
				balance: 650,
				reference: "PR-2025022201",
				note: "우드에스티 생산",
			},
			{
				id: 3,
				date: "2025-02-20",
				type: "출고",
				quantity: 100,
				balance: 700,
				reference: "TR-2025022001",
				note: "A임가공사 이관",
			},
			{
				id: 4,
				date: "2025-02-18",
				type: "입고",
				quantity: 300,
				balance: 800,
				reference: "PO-2025021801",
				note: "동화기업 매입",
			},
		],
		"RM-1002": [
			{
				id: 5,
				date: "2025-02-24",
				type: "입고",
				quantity: 100,
				balance: 320,
				reference: "PO-2025022402",
				note: "한솔홈데코 매입",
			},
			{
				id: 6,
				date: "2025-02-21",
				type: "출고",
				quantity: 30,
				balance: 220,
				reference: "PR-2025022101",
				note: "우드에스티 생산",
			},
			{
				id: 7,
				date: "2025-02-19",
				type: "출고",
				quantity: 50,
				balance: 250,
				reference: "TR-2025021901",
				note: "B임가공사 이관",
			},
			{
				id: 8,
				date: "2025-02-15",
				type: "입고",
				quantity: 150,
				balance: 300,
				reference: "PO-2025021501",
				note: "한솔홈데코 매입",
			},
		],
		P001: [
			{
				id: 9,
				date: "2025-02-25",
				type: "입고",
				quantity: 50,
				balance: 120,
				reference: "PR-2025022501",
				note: "우드에스티 생산",
			},
			{
				id: 10,
				date: "2025-02-23",
				type: "출고",
				quantity: 30,
				balance: 70,
				reference: "SO-2025022301",
				note: "우성목재 출고",
			},
			{
				id: 11,
				date: "2025-02-20",
				type: "입고",
				quantity: 40,
				balance: 100,
				reference: "PR-2025022001",
				note: "우드에스티 생산",
			},
			{
				id: 12,
				date: "2025-02-18",
				type: "출고",
				quantity: 20,
				balance: 60,
				reference: "SO-2025021801",
				note: "대림가구 출고",
			},
		],
		P003: [
			{
				id: 13,
				date: "2025-02-24",
				type: "입고",
				quantity: 20,
				balance: 30,
				reference: "PR-2025022401",
				note: "A임가공 생산",
			},
			{
				id: 14,
				date: "2025-02-21",
				type: "출고",
				quantity: 15,
				balance: 10,
				reference: "SO-2025022101",
				note: "LG하우시스 출고",
			},
			{
				id: 15,
				date: "2025-02-17",
				type: "입고",
				quantity: 25,
				balance: 25,
				reference: "PR-2025021701",
				note: "A임가공 생산",
			},
			{
				id: 16,
				date: "2025-02-15",
				type: "출고",
				quantity: 10,
				balance: 0,
				reference: "SO-2025021501",
				note: "삼성인테리어 출고",
			},
		],
	};

	const mockLocationData = {
		"RM-1001": [
			{
				id: 1,
				locationCode: "A01-05",
				quantity: 500,
				shelfName: "3층 A구역 1선반 5번",
			},
			{
				id: 2,
				locationCode: "A02-03",
				quantity: 350,
				shelfName: "3층 A구역 2선반 3번",
			},
		],
		"RM-1002": [
			{
				id: 3,
				locationCode: "A01-06",
				quantity: 200,
				shelfName: "3층 A구역 1선반 6번",
			},
			{
				id: 4,
				locationCode: "A02-04",
				quantity: 120,
				shelfName: "3층 A구역 2선반 4번",
			},
		],
		P001: [
			{
				id: 5,
				locationCode: "D01-03",
				quantity: 80,
				shelfName: "2층 D구역 1선반 3번",
			},
			{
				id: 6,
				locationCode: "D01-04",
				quantity: 40,
				shelfName: "2층 D구역 1선반 4번",
			},
		],
		P003: [
			{
				id: 7,
				locationCode: "D03-02",
				quantity: 30,
				shelfName: "2층 D구역 3선반 2번",
			},
		],
	};

	const mockProcessorInventory = {
		"RM-1001": [
			{ id: 1, processorName: "A임가공", quantity: 350, location: "시흥공장" },
			{ id: 2, processorName: "B임가공", quantity: 200, location: "안산공장" },
		],
		"RM-1002": [
			{ id: 3, processorName: "B임가공", quantity: 120, location: "안산공장" },
			{ id: 4, processorName: "C임가공", quantity: 80, location: "화성공장" },
		],
		"RM-3001": [
			{ id: 5, processorName: "A임가공", quantity: 180, location: "시흥공장" },
			{ id: 6, processorName: "C임가공", quantity: 120, location: "화성공장" },
		],
	};

	const categories = useMemo(() => {
		if (activeInventoryType === "raw-material") {
			return [
				{ id: "all", name: "전체" },
				{ id: "particle-board", name: "파티클보드" },
				{ id: "adhesive", name: "접착제" },
				{ id: "veneer", name: "씨티지" },
			];
		} else {
			return [
				{ id: "all", name: "전체" },
				{ id: "laminated-board", name: "양면합판" },
				{ id: "uv-board", name: "UV합판" },
				{ id: "fire-resistant-board", name: "방염합판" },
				{ id: "door", name: "문짝" },
			];
		}
	}, [activeInventoryType]);

	const stockFilterOptions = [
		{ id: "all", name: "전체" },
		{ id: "warning", name: "통보수량 이하" },
		{ id: "danger", name: "재고 부족" },
	];

	// Load items based on inventory type
	useEffect(() => {
		const fetchItems = async () => {
			setLoading((prev) => ({ ...prev, items: true }));
			try {
				// In a real application, this would be an API call
				// const response = await api.getInventoryItems(activeInventoryType);
				// setItems(response.data);

				// Using mock data for demonstration
				const mockData =
					activeInventoryType === "raw-material"
						? mockRawMaterials
						: mockProducts;
				setItems(mockData);
				setError((prev) => ({ ...prev, items: null }));
			} catch (err) {
				setError((prev) => ({
					...prev,
					items: "Failed to load inventory items",
				}));
			} finally {
				setLoading((prev) => ({ ...prev, items: false }));
			}
		};

		fetchItems();
		// Reset selections when inventory type changes
		setSelectedItem(null);
		setSearchTerm("");
		setCategoryFilter("all");
		setStockFilter("all");
	}, [activeInventoryType]);

	// Filter items based on search term and filters
	useEffect(() => {
		if (!items || items.length === 0) return;

		let filtered = [...items];

		// Apply search term filter
		if (searchTerm) {
			filtered = filtered.filter(
				(item) =>
					item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					item.code.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// Apply category filter
		if (categoryFilter !== "all") {
			filtered = filtered.filter((item) => item.category === categoryFilter);
		}

		// Apply stock filter
		if (stockFilter !== "all") {
			filtered = filtered.filter((item) => item.status === stockFilter);
		}

		setFilteredItems(filtered);

		// Auto-select first item if available and none selected
		if (filtered.length > 0 && !selectedItem) {
			handleItemSelect(filtered[0]);
		}
	}, [searchTerm, categoryFilter, stockFilter, items, selectedItem]);

	// Load inventory history when an item is selected
	useEffect(() => {
		if (!selectedItem) return;

		const fetchInventoryHistory = async () => {
			setLoading((prev) => ({ ...prev, history: true }));
			try {
				// In a real application, this would be an API call
				// const response = await api.getInventoryHistory(selectedItem.code);
				// setInventoryHistory(response.data);

				// Using mock data for demonstration
				setInventoryHistory(mockInventoryHistory[selectedItem.code] || []);
				setError((prev) => ({ ...prev, history: null }));
			} catch (err) {
				setError((prev) => ({
					...prev,
					history: "Failed to load inventory history",
				}));
			} finally {
				setLoading((prev) => ({ ...prev, history: false }));
			}
		};

		const fetchItemLocations = async () => {
			setLoading((prev) => ({ ...prev, locations: true }));
			try {
				// In a real application, this would be an API call
				// const response = await api.getItemLocations(selectedItem.code);
				// setItemLocations(response.data);

				// Using mock data for demonstration
				setItemLocations(mockLocationData[selectedItem.code] || []);
				setError((prev) => ({ ...prev, locations: null }));
			} catch (err) {
				setError((prev) => ({
					...prev,
					locations: "Failed to load item locations",
				}));
			} finally {
				setLoading((prev) => ({ ...prev, locations: false }));
			}
		};

		const fetchProcessorInventory = async () => {
			if (activeInventoryType !== "raw-material") return;

			setLoading((prev) => ({ ...prev, processors: true }));
			try {
				// In a real application, this would be an API call
				// const response = await api.getProcessorInventory(selectedItem.code);
				// setProcessorInventory(response.data);

				// Using mock data for demonstration
				setProcessorInventory(mockProcessorInventory[selectedItem.code] || []);
				setError((prev) => ({ ...prev, processors: null }));
			} catch (err) {
				setError((prev) => ({
					...prev,
					processors: "Failed to load processor inventory",
				}));
			} finally {
				setLoading((prev) => ({ ...prev, processors: false }));
			}
		};

		fetchInventoryHistory();
		fetchItemLocations();
		fetchProcessorInventory();
	}, [selectedItem, activeInventoryType]);

	// Toggle inventory type between 'raw-material' and 'product'
	const handleInventoryTypeToggle = (type) => {
		if (type !== activeInventoryType) {
			setActiveInventoryType(type);
		}
	};

	// Handle inventory item selection
	const handleItemSelect = (item) => {
		setSelectedItem(item);
	};

	// Handle search input change
	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};

	// Handle search submit
	const handleSearchSubmit = (e) => {
		e.preventDefault();
		// Current implementation already filters as the user types
	};

	// Handle category filter change
	const handleCategoryFilterChange = (e) => {
		setCategoryFilter(e.target.value);
	};

	// Handle stock filter change
	const handleStockFilterChange = (e) => {
		setStockFilter(e.target.value);
	};

	// Get status class for rendering
	const getStatusClass = (status) => {
		switch (status) {
			case "normal":
				return "status-normal";
			case "warning":
				return "status-warning";
			case "danger":
				return "status-danger";
			default:
				return "";
		}
	};

	// Format numbers with commas for display
	const formatNumber = (num) => {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};

	// Render inventory items list
	const renderInventoryList = () => {
		if (loading.items) {
			return (
				<div className="loading-indicator">Loading inventory items...</div>
			);
		}

		if (error.items) {
			return <div className="error-message">{error.items}</div>;
		}

		if (filteredItems.length === 0) {
			return <div className="no-data">검색 결과가 없습니다.</div>;
		}

		return (
			<table className="inventory-table">
				<thead>
					<tr>
						<th>코드</th>
						<th>품명</th>
						<th>재고</th>
						<th>상태</th>
						<th>위치</th>
					</tr>
				</thead>
				<tbody>
					{filteredItems.map((item) => (
						<tr
							key={item.id}
							className={`inventory-item ${
								selectedItem?.id === item.id ? "selected" : ""
							}`}
							onClick={() => handleItemSelect(item)}>
							<td>{item.code}</td>
							<td>{item.name}</td>
							<td>
								{formatNumber(item.stock)} {item.unit}
							</td>
							<td>
								<span className={`status-badge ${getStatusClass(item.status)}`}>
									{item.status === "normal"
										? "정상"
										: item.status === "warning"
										? "요주의"
										: "부족"}
								</span>
							</td>
							<td>{item.locationCode}</td>
						</tr>
					))}
				</tbody>
			</table>
		);
	};

	// Render inventory history section
	const renderInventoryHistory = () => {
		if (!selectedItem) {
			return (
				<div className="no-data">재고 내역을 확인하려면 항목을 선택하세요.</div>
			);
		}

		if (loading.history) {
			return (
				<div className="loading-indicator">Loading inventory history...</div>
			);
		}

		if (error.history) {
			return <div className="error-message">{error.history}</div>;
		}

		if (inventoryHistory.length === 0) {
			return <div className="no-data">재고 변동 내역이 없습니다.</div>;
		}

		return (
			<table className="history-table">
				<thead>
					<tr>
						<th>일자</th>
						<th>유형</th>
						<th>수량</th>
						<th>잔고</th>
						<th>참조</th>
						<th>비고</th>
					</tr>
				</thead>
				<tbody>
					{inventoryHistory.map((history) => (
						<tr key={history.id}>
							<td>{history.date}</td>
							<td className={history.type === "입고" ? "type-in" : "type-out"}>
								{history.type}
							</td>
							<td>{formatNumber(history.quantity)}</td>
							<td>{formatNumber(history.balance)}</td>
							<td>{history.reference}</td>
							<td>{history.note}</td>
						</tr>
					))}
				</tbody>
			</table>
		);
	};

	// Render item location section
	const renderItemLocations = () => {
		if (!selectedItem) {
			return null;
		}

		if (loading.locations) {
			return <div className="loading-indicator">Loading item locations...</div>;
		}

		if (error.locations) {
			return <div className="error-message">{error.locations}</div>;
		}

		if (itemLocations.length === 0) {
			return <div className="no-data">위치 정보가 없습니다.</div>;
		}

		return (
			<div className="location-section">
				<h3 className="section-title">위치 정보</h3>
				<table className="location-table">
					<thead>
						<tr>
							<th>위치 코드</th>
							<th>선반명</th>
							<th>수량</th>
						</tr>
					</thead>
					<tbody>
						{itemLocations.map((location) => (
							<tr key={location.id}>
								<td>{location.locationCode}</td>
								<td>{location.shelfName}</td>
								<td>
									{formatNumber(location.quantity)} {selectedItem.unit}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	};

	// Render processor inventory section (for raw materials only)
	const renderProcessorInventory = () => {
		if (!selectedItem || activeInventoryType !== "raw-material") {
			return null;
		}

		if (loading.processors) {
			return (
				<div className="loading-indicator">Loading processor inventory...</div>
			);
		}

		if (error.processors) {
			return <div className="error-message">{error.processors}</div>;
		}

		if (processorInventory.length === 0) {
			return <div className="no-data">임가공업체 재고 정보가 없습니다.</div>;
		}

		return (
			<div className="processor-section">
				<h3 className="section-title">임가공업체 보유 현황</h3>
				<table className="processor-table">
					<thead>
						<tr>
							<th>임가공업체</th>
							<th>위치</th>
							<th>수량</th>
						</tr>
					</thead>
					<tbody>
						{processorInventory.map((processor) => (
							<tr key={processor.id}>
								<td>{processor.processorName}</td>
								<td>{processor.location}</td>
								<td>
									{formatNumber(processor.quantity)} {selectedItem.unit}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	};

	// Render item details section
	const renderItemDetails = () => {
		if (!selectedItem) {
			return (
				<div className="no-data">제품 정보를 확인하려면 항목을 선택하세요.</div>
			);
		}

		return (
			<div className="item-details">
				<h3 className="details-title">{selectedItem.name} 상세 정보</h3>

				<div className="details-grid">
					<div className="details-item">
						<span className="details-label">코드:</span>
						<span className="details-value">{selectedItem.code}</span>
					</div>
					<div className="details-item">
						<span className="details-label">품명:</span>
						<span className="details-value">{selectedItem.name}</span>
					</div>
					<div className="details-item">
						<span className="details-label">분류:</span>
						<span className="details-value">
							{categories.find((cat) => cat.id === selectedItem.category)
								?.name || selectedItem.category}
						</span>
					</div>
					<div className="details-item">
						<span className="details-label">현재고:</span>
						<span className="details-value">
							{formatNumber(selectedItem.stock)} {selectedItem.unit}
						</span>
					</div>
					<div className="details-item">
						<span className="details-label">최소재고:</span>
						<span className="details-value">
							{formatNumber(selectedItem.minStock)} {selectedItem.unit}
						</span>
					</div>
					<div className="details-item">
						<span className="details-label">상태:</span>
						<span
							className={`details-value status-text ${getStatusClass(
								selectedItem.status
							)}`}>
							{selectedItem.status === "normal"
								? "정상"
								: selectedItem.status === "warning"
								? "요주의"
								: "부족"}
						</span>
					</div>
					<div className="details-item">
						<span className="details-label">단가:</span>
						<span className="details-value">
							{formatNumber(selectedItem.price)}원
						</span>
					</div>
					<div className="details-item">
						<span className="details-label">기본위치:</span>
						<span className="details-value">{selectedItem.locationCode}</span>
					</div>
					<div className="details-item">
						<span className="details-label">
							{activeInventoryType === "raw-material"
								? "공급업체:"
								: "생산업체:"}
						</span>
						<span className="details-value">
							{activeInventoryType === "raw-material"
								? selectedItem.supplier
								: selectedItem.producer}
						</span>
					</div>
				</div>

				{/* QR Code Section */}
				<div className="qr-section">
					<div className="qr-code-container">
						<div className="qr-code-placeholder">
							{/* In a real application, this would be an actual QR code */}
							<div className="qr-image-placeholder"></div>
							<button className="btn btn-primary print-btn">QR 출력</button>
						</div>
					</div>
					<div className="qr-instructions">
						<h4>QR 코드 사용 방법</h4>
						<ul>
							<li>재고 확인 시 QR 코드를 스캔하여 실시간 정보를 확인하세요.</li>
							<li>입출고 작업 시 QR 코드를 스캔하여 작업을 기록하세요.</li>
							<li>
								재고 이동 시 출발지와 도착지 QR을 스캔하여 위치를
								업데이트하세요.
							</li>
						</ul>
					</div>
				</div>

				{/* Render location information */}
				{renderItemLocations()}

				{/* Render processor inventory for raw materials */}
				{renderProcessorInventory()}
			</div>
		);
	};

	// Main render
	return (
		<div className="inventory-management">
			{/* Header section with type selector and filters */}
			<div className="inventory-header">
				<div className="inventory-type-selector">
					<button
						className={`inventory-type-btn ${
							activeInventoryType === "raw-material" ? "active" : ""
						}`}
						onClick={() => handleInventoryTypeToggle("raw-material")}>
						원재료
					</button>
					<button
						className={`inventory-type-btn ${
							activeInventoryType === "product" ? "active" : ""
						}`}
						onClick={() => handleInventoryTypeToggle("product")}>
						제품
					</button>
				</div>

				<div className="inventory-filters">
					<form
						onSubmit={handleSearchSubmit}
						className="search-form">
						<input
							type="text"
							className="search-input"
							placeholder="코드 또는 품명으로 검색"
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
						<div className="filter-group">
							<label htmlFor="category-filter">분류:</label>
							<select
								id="category-filter"
								className="filter-select"
								value={categoryFilter}
								onChange={handleCategoryFilterChange}>
								{categories.map((category) => (
									<option
										key={category.id}
										value={category.id}>
										{category.name}
									</option>
								))}
							</select>
						</div>

						<div className="filter-group">
							<label htmlFor="stock-filter">재고 상태:</label>
							<select
								id="stock-filter"
								className="filter-select"
								value={stockFilter}
								onChange={handleStockFilterChange}>
								{stockFilterOptions.map((option) => (
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
			<div className="inventory-content">
				{/* Inventory list section */}
				<div className="inventory-list-section">
					<h3 className="section-title">
						{activeInventoryType === "raw-material"
							? "원재료 목록"
							: "제품 목록"}
						<span className="item-count">
							({filteredItems.length}/{items.length})
						</span>
					</h3>
					{renderInventoryList()}
				</div>

				{/* Item details section */}
				<div className="item-details-section">{renderItemDetails()}</div>
			</div>

			{/* Inventory history section */}
			<div className="inventory-history-section">
				<h3 className="section-title">재고 변동 내역</h3>
				{renderInventoryHistory()}
			</div>

			{/* Action buttons */}
			<div className="action-buttons">
				<button className="action-button add-button">
					{activeInventoryType === "raw-material" ? "원재료 등록" : "제품 등록"}
				</button>

				{selectedItem && (
					<>
						<button className="action-button edit-button">정보 수정</button>
						<button className="action-button stock-button">재고 조정</button>
						<button className="action-button transfer-button">재고 이동</button>
						<button className="action-button export-button">내역 출력</button>
					</>
				)}
			</div>
		</div>
	);
};

InventoryManagement.propTypes = {
	inventoryType: PropTypes.oneOf(["raw-material", "product"]),
};

export default InventoryManagement;

import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import "./VendorManagement.css";

/**
 * VendorManagement Component
 *
 * A comprehensive component for managing vendors (suppliers) and processors
 * with detailed information display, product relationships, and transaction history.
 */
const VendorManagement = ({ initialVendorType = "vendor" }) => {
	// State management
	const [vendorType, setVendorType] = useState(initialVendorType);
	const [vendors, setVendors] = useState([]);
	const [filteredVendors, setFilteredVendors] = useState([]);
	const [selectedVendor, setSelectedVendor] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [activeTab, setActiveTab] = useState("basic");
	const [products, setProducts] = useState([]);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [productDetails, setProductDetails] = useState(null);
	const [transactionHistory, setTransactionHistory] = useState([]);
	const [loading, setLoading] = useState({
		vendors: false,
		products: false,
		details: false,
		history: false,
	});
	const [error, setError] = useState({
		vendors: null,
		products: null,
		details: null,
		history: null,
	});

	// Mock data - would be replaced with API calls in production
	const mockVendors = {
		vendor: [
			{
				id: 1,
				name: "(주)가나다 전자",
				ceo: "김철수",
				businessNumber: "123-45-67890",
				businessType: "도소매/전자제품",
				contact: "02-123-4567 / 02-123-4568",
				address: "서울시 강남구 테헤란로 123",
				paymentInfo: "월말 정산 / 담당자: 이영희",
			},
			{
				id: 2,
				name: "비트컴퓨터",
				ceo: "박지민",
				businessNumber: "234-56-78901",
				businessType: "제조/컴퓨터",
				contact: "02-234-5678 / 02-234-5679",
				address: "서울시 서초구 강남대로 456",
				paymentInfo: "15일 정산 / 담당자: 최민준",
			},
			{
				id: 3,
				name: "동화기업",
				ceo: "이동화",
				businessNumber: "345-67-89012",
				businessType: "제조/목재",
				contact: "02-345-6789 / 02-345-6780",
				address: "서울시 강동구 천호대로 789",
				paymentInfo: "주간 정산 / 담당자: 정소연",
			},
		],
		processor: [
			{
				id: 4,
				name: "A임가공",
				ceo: "윤민수",
				businessNumber: "456-78-90123",
				businessType: "제조/가공",
				contact: "02-456-7890 / 02-456-7891",
				address: "경기도 시흥시 공단로 123",
				paymentInfo: "월말 정산 / 담당자: 김철수",
			},
			{
				id: 5,
				name: "B임가공",
				ceo: "장성민",
				businessNumber: "567-89-01234",
				businessType: "제조/가공",
				contact: "031-567-8901 / 031-567-8902",
				address: "경기도 안산시 단원구 공업로 456",
				paymentInfo: "15일 정산 / 담당자: 박서연",
			},
			{
				id: 6,
				name: "우드에스티",
				ceo: "김목림",
				businessNumber: "678-90-12345",
				businessType: "제조/가공",
				contact: "02-678-9012 / 02-678-9013",
				address: "서울시 금천구 가산디지털로 123",
				paymentInfo: "내부 임가공업체",
			},
		],
	};

	const mockProducts = {
		1: [
			{
				id: 1,
				code: "P001",
				name: "LED 모니터 24인치",
				price: "150,000원",
				salesStatus: "Y",
			},
			{
				id: 2,
				code: "P002",
				name: "LED 모니터 27인치",
				price: "220,000원",
				salesStatus: "Y",
			},
		],
		2: [
			{
				id: 3,
				code: "P003",
				name: "SSD 500GB",
				price: "89,000원",
				salesStatus: "Y",
			},
			{
				id: 4,
				code: "P004",
				name: "SSD 1TB",
				price: "159,000원",
				salesStatus: "Y",
			},
		],
		3: [
			{
				id: 5,
				code: "RM-1001",
				name: "PB E0 18mm",
				price: "30,000원",
				salesStatus: "Y",
			},
			{
				id: 6,
				code: "RM-1002",
				name: "PB E1 15mm",
				price: "28,000원",
				salesStatus: "Y",
			},
		],
		4: [
			{
				id: 7,
				code: "PR-001",
				name: "3808-3/양면 E0 18mm",
				price: "45,000원",
				salesStatus: "Y",
			},
		],
		5: [
			{
				id: 8,
				code: "PR-002",
				name: "UV무늬목 15mm",
				price: "55,000원",
				salesStatus: "Y",
			},
		],
		6: [
			{
				id: 9,
				code: "PR-003",
				name: "방염합판 9mm",
				price: "62,000원",
				salesStatus: "Y",
			},
		],
	};

	const mockProductDetails = {
		1: {
			code: "P001",
			name: "LED 모니터 24인치",
			price: "150,000원",
			salesStatus: "Y",
			model: "LM-2401",
			image: "이미지 있음",
			spec: "24인치 FHD",
			qrProvided: "Y",
			options: {
				specName: "24인치 모니터",
				specItem: "FHD, 60Hz, HDMI",
				additionalPrice: "0원",
				stockAmount: "50개",
				notificationAmount: "10개",
				useStatus: "Y",
			},
			pricing: {
				consumerPrice: "180,000원",
				sellingPrice: "165,000원",
				discountPrice: "150,000원",
				costPrice: "120,000원",
				dcPrice: "135,000원",
				stockQuantity: "50개",
				stockNotification: "10개",
				useStatus: "Y",
			},
		},
		3: {
			code: "P003",
			name: "SSD 500GB",
			price: "89,000원",
			salesStatus: "Y",
			model: "SSD-500",
			image: "이미지 있음",
			spec: "500GB SATA",
			qrProvided: "N",
			options: {
				specName: "500GB SSD",
				specItem: "SATA3, 2.5인치",
				additionalPrice: "0원",
				stockAmount: "100개",
				notificationAmount: "20개",
				useStatus: "Y",
			},
			pricing: {
				consumerPrice: "110,000원",
				sellingPrice: "99,000원",
				discountPrice: "89,000원",
				costPrice: "70,000원",
				dcPrice: "80,000원",
				stockQuantity: "100개",
				stockNotification: "20개",
				useStatus: "Y",
			},
		},
		5: {
			code: "RM-1001",
			name: "PB E0 18mm",
			price: "30,000원",
			salesStatus: "Y",
			model: "PB-E0-18",
			image: "이미지 있음",
			spec: "18mm 두께",
			qrProvided: "Y",
			options: {
				specName: "파티클보드 E0 18mm",
				specItem: "방부목, 친환경",
				additionalPrice: "0원",
				stockAmount: "850장",
				notificationAmount: "500장",
				useStatus: "Y",
			},
			pricing: {
				consumerPrice: "35,000원",
				sellingPrice: "32,000원",
				discountPrice: "30,000원",
				costPrice: "25,000원",
				dcPrice: "28,000원",
				stockQuantity: "850장",
				stockNotification: "500장",
				useStatus: "Y",
			},
		},
		7: {
			code: "PR-001",
			name: "3808-3/양면 E0 18mm",
			price: "45,000원",
			salesStatus: "Y",
			model: "3808-3",
			image: "이미지 있음",
			spec: "양면 E0 18mm",
			qrProvided: "Y",
			options: {
				specName: "양면 멜라민 합판",
				specItem: "E0 18mm, 양면시공",
				additionalPrice: "0원",
				stockAmount: "120장",
				notificationAmount: "50장",
				useStatus: "Y",
			},
			pricing: {
				consumerPrice: "50,000원",
				sellingPrice: "48,000원",
				discountPrice: "45,000원",
				costPrice: "38,000원",
				dcPrice: "42,000원",
				stockQuantity: "120장",
				stockNotification: "50장",
				useStatus: "Y",
			},
		},
	};

	const mockTransactionHistory = {
		1: [
			{
				id: 1,
				date: "2025-02-25",
				type: "매입",
				amount: "20",
				price: "2,400,000원",
			},
			{
				id: 2,
				date: "2025-02-20",
				type: "매입",
				amount: "15",
				price: "1,800,000원",
			},
			{
				id: 3,
				date: "2025-02-15",
				type: "매입",
				amount: "25",
				price: "3,000,000원",
			},
			{
				id: 4,
				date: "2025-02-10",
				type: "출고",
				amount: "30",
				price: "3,600,000원",
			},
		],
		2: [
			{
				id: 5,
				date: "2025-02-24",
				type: "매입",
				amount: "10",
				price: "890,000원",
			},
			{
				id: 6,
				date: "2025-02-20",
				type: "출고",
				amount: "5",
				price: "445,000원",
			},
			{
				id: 7,
				date: "2025-02-15",
				type: "매입",
				amount: "15",
				price: "1,335,000원",
			},
		],
		3: [
			{
				id: 8,
				date: "2025-02-25",
				type: "매입",
				amount: "500",
				price: "15,000,000원",
			},
			{
				id: 9,
				date: "2025-02-20",
				type: "출고",
				amount: "200",
				price: "6,000,000원",
			},
			{
				id: 10,
				date: "2025-02-15",
				type: "매입",
				amount: "300",
				price: "9,000,000원",
			},
		],
		4: [
			{
				id: 11,
				date: "2025-02-25",
				type: "생산",
				amount: "50",
				price: "2,250,000원",
			},
			{
				id: 12,
				date: "2025-02-20",
				type: "원재료투입",
				amount: "60",
				price: "1,800,000원",
			},
			{
				id: 13,
				date: "2025-02-15",
				type: "생산",
				amount: "40",
				price: "1,800,000원",
			},
		],
		5: [
			{
				id: 14,
				date: "2025-02-24",
				type: "생산",
				amount: "30",
				price: "1,650,000원",
			},
			{
				id: 15,
				date: "2025-02-19",
				type: "원재료투입",
				amount: "40",
				price: "1,120,000원",
			},
			{
				id: 16,
				date: "2025-02-14",
				type: "생산",
				amount: "35",
				price: "1,925,000원",
			},
		],
		6: [
			{
				id: 17,
				date: "2025-02-25",
				type: "생산",
				amount: "80",
				price: "4,960,000원",
			},
			{
				id: 18,
				date: "2025-02-20",
				type: "원재료투입",
				amount: "100",
				price: "3,000,000원",
			},
			{
				id: 19,
				date: "2025-02-15",
				type: "생산",
				amount: "70",
				price: "4,340,000원",
			},
		],
	};

	// Load initial vendors based on vendorType
	useEffect(() => {
		const fetchVendors = async () => {
			setLoading((prev) => ({ ...prev, vendors: true }));
			try {
				// In a real application, this would be an API call
				// const response = await api.getVendors(vendorType);
				// setVendors(response.data);

				// Using mock data for demonstration
				setVendors(mockVendors[vendorType] || []);
				setError((prev) => ({ ...prev, vendors: null }));
			} catch (err) {
				setError((prev) => ({ ...prev, vendors: "Failed to load vendors" }));
			} finally {
				setLoading((prev) => ({ ...prev, vendors: false }));
			}
		};

		fetchVendors();
		// Reset selections when vendor type changes
		setSelectedVendor(null);
		setSelectedProduct(null);
		setProductDetails(null);
		setTransactionHistory([]);
	}, [vendorType]);

	// Filter vendors when search term changes
	useEffect(() => {
		if (!vendors || vendors.length === 0) return;

		const filtered = vendors.filter((vendor) =>
			vendor.name.toLowerCase().includes(searchTerm.toLowerCase())
		);
		setFilteredVendors(filtered);

		// Auto-select first vendor if available and none selected
		if (filtered.length > 0 && !selectedVendor) {
			handleVendorSelect(filtered[0]);
		}
	}, [searchTerm, vendors, selectedVendor]);

	// Load products when vendor selected
	useEffect(() => {
		if (!selectedVendor) return;

		const fetchProducts = async () => {
			setLoading((prev) => ({ ...prev, products: true }));
			try {
				// In a real application, this would be an API call
				// const response = await api.getVendorProducts(selectedVendor.id);
				// setProducts(response.data);

				// Using mock data for demonstration
				setProducts(mockProducts[selectedVendor.id] || []);
				setError((prev) => ({ ...prev, products: null }));
			} catch (err) {
				setError((prev) => ({ ...prev, products: "Failed to load products" }));
			} finally {
				setLoading((prev) => ({ ...prev, products: false }));
			}
		};

		fetchProducts();
		fetchTransactionHistory();
	}, [selectedVendor]);

	// Load product details when product selected
	useEffect(() => {
		if (!selectedProduct) return;

		const fetchProductDetails = async () => {
			setLoading((prev) => ({ ...prev, details: true }));
			try {
				// In a real application, this would be an API call
				// const response = await api.getProductDetails(selectedProduct.id);
				// setProductDetails(response.data);

				// Using mock data for demonstration
				setProductDetails(mockProductDetails[selectedProduct.id] || null);
				setError((prev) => ({ ...prev, details: null }));
			} catch (err) {
				setError((prev) => ({
					...prev,
					details: "Failed to load product details",
				}));
			} finally {
				setLoading((prev) => ({ ...prev, details: false }));
			}
		};

		fetchProductDetails();
	}, [selectedProduct]);

	// Fetch transaction history for selected vendor
	const fetchTransactionHistory = useCallback(async () => {
		if (!selectedVendor) return;

		setLoading((prev) => ({ ...prev, history: true }));
		try {
			// In a real application, this would be an API call
			// const response = await api.getVendorTransactionHistory(selectedVendor.id);
			// setTransactionHistory(response.data);

			// Using mock data for demonstration
			setTransactionHistory(mockTransactionHistory[selectedVendor.id] || []);
			setError((prev) => ({ ...prev, history: null }));
		} catch (err) {
			setError((prev) => ({
				...prev,
				history: "Failed to load transaction history",
			}));
		} finally {
			setLoading((prev) => ({ ...prev, history: false }));
		}
	}, [selectedVendor]);

	// Toggle vendor type between 'vendor' and 'processor'
	const handleVendorTypeToggle = (type) => {
		if (type !== vendorType) {
			setVendorType(type);
		}
	};

	// Handle vendor selection
	const handleVendorSelect = (vendor) => {
		setSelectedVendor(vendor);
		setSelectedProduct(null);
		setProductDetails(null);
		setActiveTab("basic");
	};

	// Handle product selection
	const handleProductSelect = (product) => {
		setSelectedProduct(product);
	};

	// Handle tab selection
	const handleTabSelect = (tab) => {
		setActiveTab(tab);
	};

	// Handle search input change
	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};

	// Handle search submit
	const handleSearchSubmit = (e) => {
		e.preventDefault();
		// Current implementation already filters as the user types
		// This could be expanded to perform more complex searches or API calls
	};

	// Render vendor list section
	const renderVendorList = () => {
		if (loading.vendors) {
			return <div className="loading-indicator">Loading vendors...</div>;
		}

		if (error.vendors) {
			return <div className="error-message">{error.vendors}</div>;
		}

		if (filteredVendors.length === 0) {
			return <div className="no-data">검색 결과가 없습니다.</div>;
		}

		return (
			<div className="vendor-list">
				{filteredVendors.map((vendor) => (
					<div
						key={vendor.id}
						className={`vendor-item ${
							selectedVendor?.id === vendor.id ? "selected" : ""
						}`}
						onClick={() => handleVendorSelect(vendor)}>
						{vendor.name}
					</div>
				))}
			</div>
		);
	};

	// Render basic info tab content
	const renderBasicInfo = () => {
		if (!selectedVendor) {
			return <div className="no-data">선택된 업체가 없습니다.</div>;
		}

		return (
			<>
				<div className="info-item">
					<span className="info-label">공급업체명:</span>{" "}
					<span>{selectedVendor.name}</span>
				</div>
				<div className="info-item">
					<span className="info-label">대표자명:</span>{" "}
					<span>{selectedVendor.ceo}</span>
				</div>
				<div className="info-item">
					<span className="info-label">사업자 등록번호:</span>{" "}
					<span>{selectedVendor.businessNumber}</span>
				</div>
				<div className="info-item">
					<span className="info-label">업태/업종:</span>{" "}
					<span>{selectedVendor.businessType}</span>
				</div>
				<div className="info-item">
					<span className="info-label">전화번호/팩스번호:</span>{" "}
					<span>{selectedVendor.contact}</span>
				</div>
				<div className="info-item">
					<span className="info-label">사업장 주소:</span>{" "}
					<span>{selectedVendor.address}</span>
				</div>
				<div className="info-item">
					<span className="info-label">정산 정보/담당자 정보:</span>{" "}
					<span>{selectedVendor.paymentInfo}</span>
				</div>
			</>
		);
	};

	// Render product info tab content
	const renderProductInfo = () => {
		if (!selectedVendor) {
			return <div className="no-data">선택된 업체가 없습니다.</div>;
		}

		if (loading.products) {
			return <div className="loading-indicator">Loading products...</div>;
		}

		if (error.products) {
			return <div className="error-message">{error.products}</div>;
		}

		if (products.length === 0) {
			return <div className="no-data">등록된 제품이 없습니다.</div>;
		}

		return (
			<div className="product-list">
				{products.map((product) => (
					<div
						key={product.id}
						className={`product-item ${
							selectedProduct?.id === product.id ? "selected" : ""
						}`}
						onClick={() => handleProductSelect(product)}>
						{product.code} - {product.name}
					</div>
				))}
			</div>
		);
	};

	// Render product details section
	// Render product details section
	const renderProductDetails = () => {
		if (!selectedProduct) {
			return <div className="no-data">선택된 제품이 없습니다.</div>;
		}

		if (loading.details) {
			return (
				<div className="loading-indicator">Loading product details...</div>
			);
		}

		if (error.details) {
			return <div className="error-message">{error.details}</div>;
		}

		if (!productDetails) {
			return <div className="no-data">제품 상세 정보가 없습니다.</div>;
		}

		return (
			<>
				<div className="detail-section">
					<div className="detail-heading">제품 상세 정보</div>
					<div className="info-grid">
						<div className="info-item">
							<span className="info-label">상품 코드:</span>{" "}
							<span>{productDetails.code}</span>
						</div>
						<div className="info-item">
							<span className="info-label">상품명:</span>{" "}
							<span>{productDetails.name}</span>
						</div>
						<div className="info-item">
							<span className="info-label">공급가:</span>{" "}
							<span>{productDetails.price}</span>
						</div>
						<div className="info-item">
							<span className="info-label">판매 여부:</span>{" "}
							<span>{productDetails.salesStatus}</span>
						</div>
						<div className="info-item">
							<span className="info-label">모델명:</span>{" "}
							<span>{productDetails.model}</span>
						</div>
						<div className="info-item">
							<span className="info-label">상품 이미지:</span>{" "}
							<span>{productDetails.image}</span>
						</div>
						<div className="info-item">
							<span className="info-label">규격명:</span>{" "}
							<span>{productDetails.spec}</span>
						</div>
						<div className="info-item">
							<span className="info-label">QR 제공:</span>{" "}
							<span>{productDetails.qrProvided}</span>
						</div>
					</div>
				</div>

				<div className="detail-section">
					<div className="detail-heading">옵션 정보</div>
					<div className="info-grid">
						<div className="info-item">
							<span className="info-label">규격명:</span>{" "}
							<span>{productDetails.options.specName}</span>
						</div>
						<div className="info-item">
							<span className="info-label">규격항목:</span>{" "}
							<span>{productDetails.options.specItem}</span>
						</div>
						<div className="info-item">
							<span className="info-label">추가금액:</span>{" "}
							<span>{productDetails.options.additionalPrice}</span>
						</div>
						<div className="info-item">
							<span className="info-label">재고수량:</span>{" "}
							<span>{productDetails.options.stockAmount}</span>
						</div>
						<div className="info-item">
							<span className="info-label">통보수량:</span>{" "}
							<span>{productDetails.options.notificationAmount}</span>
						</div>
						<div className="info-item">
							<span className="info-label">사용여부:</span>{" "}
							<span>{productDetails.options.useStatus}</span>
						</div>
					</div>
				</div>

				<div className="detail-section">
					<div className="detail-heading">가격 및 재고</div>
					<div className="info-grid">
						<div className="info-item">
							<span className="info-label">소비자가:</span>{" "}
							<span>{productDetails.pricing.consumerPrice}</span>
						</div>
						<div className="info-item">
							<span className="info-label">판매가:</span>{" "}
							<span>{productDetails.pricing.sellingPrice}</span>
						</div>
						<div className="info-item">
							<span className="info-label">할인가:</span>{" "}
							<span>{productDetails.pricing.discountPrice}</span>
						</div>
						<div className="info-item">
							<span className="info-label">원가:</span>{" "}
							<span>{productDetails.pricing.costPrice}</span>
						</div>
						<div className="info-item">
							<span className="info-label">DC가:</span>{" "}
							<span>{productDetails.pricing.dcPrice}</span>
						</div>
						<div className="info-item">
							<span className="info-label">재고수량:</span>{" "}
							<span>{productDetails.pricing.stockQuantity}</span>
						</div>
						<div className="info-item">
							<span className="info-label">재고통보수량:</span>{" "}
							<span>{productDetails.pricing.stockNotification}</span>
						</div>
						<div className="info-item">
							<span className="info-label">사용여부:</span>{" "}
							<span>{productDetails.pricing.useStatus}</span>
						</div>
					</div>
				</div>
			</>
		);
	};

	// Render transaction history section
	const renderTransactionHistory = () => {
		if (!selectedVendor) {
			return <div className="no-data">선택된 업체가 없습니다.</div>;
		}

		if (loading.history) {
			return (
				<div className="loading-indicator">Loading transaction history...</div>
			);
		}

		if (error.history) {
			return <div className="error-message">{error.history}</div>;
		}

		if (transactionHistory.length === 0) {
			return <div className="no-data">거래 내역이 없습니다.</div>;
		}

		return (
			<div className="transaction-list">
				{transactionHistory.map((transaction) => (
					<div
						key={transaction.id}
						className="transaction-item">
						<span className="transaction-date">{transaction.date}</span>
						<span
							className={`transaction-type ${
								transaction.type === "매입"
									? "type-purchase"
									: transaction.type === "출고"
									? "type-shipping"
									: "type-production"
							}`}>
							{transaction.type}
						</span>
						<span className="transaction-details">
							수량: {transaction.amount}, 금액: {transaction.price}
						</span>
					</div>
				))}
			</div>
		);
	};

	// Main render
	return (
		<div className="vendor-management">
			{/* Vendor search section */}
			<div className="vendor-search-section">
				<div className="vendor-type-selector">
					<button
						className={`vendor-type-btn ${
							vendorType === "vendor" ? "active" : ""
						}`}
						onClick={() => handleVendorTypeToggle("vendor")}>
						매입사
					</button>
					<button
						className={`vendor-type-btn ${
							vendorType === "processor" ? "active" : ""
						}`}
						onClick={() => handleVendorTypeToggle("processor")}>
						임가공사
					</button>
				</div>
				<form
					onSubmit={handleSearchSubmit}
					className="search-form">
					<input
						type="text"
						className="search-input"
						placeholder={`${
							vendorType === "vendor" ? "매입사" : "임가공사"
						}명을 입력하세요`}
						value={searchTerm}
						onChange={handleSearchChange}
					/>
					<button
						type="submit"
						className="search-button">
						검색
					</button>
				</form>
			</div>

			{/* Main content */}
			<div className="vendor-management-content">
				{/* Vendor list */}
				<div className="vendor-list-section">{renderVendorList()}</div>

				{/* Vendor detail section */}
				<div className="vendor-detail-section">
					<div className="info-container">
						<div className="left-panel">
							<div className="tabs">
								<div
									className={`tab ${activeTab === "basic" ? "active" : ""}`}
									onClick={() => handleTabSelect("basic")}>
									기초 정보
								</div>
								<div
									className={`tab ${activeTab === "product" ? "active" : ""}`}
									onClick={() => handleTabSelect("product")}>
									제품 정보
								</div>
							</div>

							<div
								className={`tab-content ${
									activeTab === "basic" ? "active" : ""
								}`}>
								{renderBasicInfo()}
							</div>

							<div
								className={`tab-content ${
									activeTab === "product" ? "active" : ""
								}`}>
								{renderProductInfo()}
							</div>
						</div>

						<div className="right-panel">{renderProductDetails()}</div>
					</div>

					{/* Transaction history section */}
					<div className="history-section">
						<div className="history-title">매입/출고 히스토리</div>
						<div className="history-content">{renderTransactionHistory()}</div>
					</div>
				</div>
			</div>

			{/* Action buttons */}
			<div className="action-buttons">
				<button className="action-button add-button">
					새 {vendorType === "vendor" ? "매입사" : "임가공사"} 등록
				</button>
				{selectedVendor && (
					<>
						<button className="action-button edit-button">정보 수정</button>
						<button className="action-button delete-button">삭제</button>
					</>
				)}
			</div>
		</div>
	);
};

VendorManagement.propTypes = {
	initialVendorType: PropTypes.oneOf(["vendor", "processor"]),
};

export default VendorManagement;

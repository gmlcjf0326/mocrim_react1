import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import "./FinancialManagement.css";

/**
 * FinancialManagement Component
 *
 * Comprehensive component for managing financial transactions including
 * collections (receivables) and payments (payables) with detailed tracking
 * and reporting capabilities.
 */
const FinancialManagement = ({ type = "collection" }) => {
	const [transactionType, setTransactionType] = useState(type);
	const [transactions, setTransactions] = useState([]);
	const [filteredTransactions, setFilteredTransactions] = useState([]);
	const [selectedTransaction, setSelectedTransaction] = useState(null);
	const [transactionDetails, setTransactionDetails] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [dateRange, setDateRange] = useState({
		start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
			.toISOString()
			.split("T")[0], // 30 days ago
		end: new Date().toISOString().split("T")[0], // today
	});
	const [loading, setLoading] = useState({
		transactions: false,
		details: false,
		summary: false,
	});
	const [error, setError] = useState({
		transactions: null,
		details: null,
		summary: null,
	});
	const [showNewTransactionModal, setShowNewTransactionModal] = useState(false);
	const [summary, setSummary] = useState({
		total: 0,
		completed: 0,
		pending: 0,
		overdue: 0,
		today: 0,
	});

	// Mock data for collections (receivables)
	const mockCollections = [
		{
			id: 1,
			transactionNumber: "RC-2025022501",
			counterparty: "우성목재",
			orderReference: "SO-2025022001",
			amount: 3680000,
			dueDate: "2025-03-05",
			transactionDate: "2025-02-25",
			status: "pending",
		},
		{
			id: 2,
			transactionNumber: "RC-2025022401",
			counterparty: "대림가구",
			orderReference: "SO-2025022102",
			amount: 4260000,
			dueDate: "2025-03-01",
			transactionDate: "2025-02-24",
			status: "completed",
			completionDate: "2025-02-24",
		},
		{
			id: 3,
			transactionNumber: "RC-2025022301",
			counterparty: "LG하우시스",
			orderReference: "SO-2025021803",
			amount: 5120000,
			dueDate: "2025-02-28",
			transactionDate: "2025-02-23",
			status: "overdue",
		},
		{
			id: 4,
			transactionNumber: "RC-2025022201",
			counterparty: "삼성인테리어",
			orderReference: "SO-2025021904",
			amount: 2950000,
			dueDate: "2025-02-26",
			transactionDate: "2025-02-22",
			status: "pending",
		},
	];

	// Mock data for payments (payables)
	const mockPayments = [
		{
			id: 1,
			transactionNumber: "PY-2025022501",
			counterparty: "동화기업",
			invoiceReference: "INV-DO-2025020501",
			amount: 4320000,
			dueDate: "2025-03-05",
			transactionDate: "2025-02-25",
			status: "pending",
		},
		{
			id: 2,
			transactionNumber: "PY-2025022401",
			counterparty: "한솔홈데코",
			invoiceReference: "INV-HS-2025021901",
			amount: 2850000,
			dueDate: "2025-02-28",
			transactionDate: "2025-02-24",
			status: "completed",
			completionDate: "2025-02-24",
		},
		{
			id: 3,
			transactionNumber: "PY-2025022301",
			counterparty: "코스모텍",
			invoiceReference: "INV-KS-2025020301",
			amount: 1680000,
			dueDate: "2025-02-27",
			transactionDate: "2025-02-23",
			status: "completed",
			completionDate: "2025-02-25",
		},
		{
			id: 4,
			transactionNumber: "PY-2025022201",
			counterparty: "디자인월",
			invoiceReference: "INV-DW-2025020901",
			amount: 950000,
			dueDate: "2025-02-25",
			transactionDate: "2025-02-22",
			status: "overdue",
		},
	];

	// Mock transaction details
	const mockTransactionDetails = {
		collections: {
			1: {
				id: 1,
				transactionNumber: "RC-2025022501",
				counterparty: "우성목재",
				counterpartyContact: "042-123-4567",
				customerCode: "CUS-WS001",
				orderReference: "SO-2025022001",
				amount: 3680000,
				taxAmount: 368000,
				netAmount: 3312000,
				dueDate: "2025-03-05",
				transactionDate: "2025-02-25",
				status: "pending",
				paymentMethod: "계좌이체",
				bankAccount: "신한은행 123-456-789012",
				bankAccountName: "목림상사",
				description: "2025년 2월 제품 판매",
				notes: "만기일 이틀 전 입금 확인 필요",
				issuer: "김판매",
				history: [
					{
						id: 1,
						date: "2025-02-25 10:30",
						user: "김판매",
						action: "수금 등록",
						notes: "2월 제품 판매 수금 등록",
					},
				],
				relatedDocuments: [
					{
						id: 1,
						type: "거래명세서",
						reference: "SO-2025022001",
						date: "2025-02-25",
						status: "발행완료",
					},
					{
						id: 2,
						type: "세금계산서",
						reference: "TXINV-2025022501",
						date: "2025-02-25",
						status: "발행완료",
					},
				],
			},
			2: {
				id: 2,
				transactionNumber: "RC-2025022401",
				counterparty: "대림가구",
				counterpartyContact: "02-234-5678",
				customerCode: "CUS-DL001",
				orderReference: "SO-2025022102",
				amount: 4260000,
				taxAmount: 426000,
				netAmount: 3834000,
				dueDate: "2025-03-01",
				transactionDate: "2025-02-24",
				status: "completed",
				completionDate: "2025-02-24",
				paymentMethod: "법인카드",
				cardNumber: "****-****-****-1234",
				cardCompany: "신한카드",
				approvalNumber: "APPROVE-12345678",
				description: "2025년 2월 씽크대문짝 판매",
				notes: "",
				issuer: "김판매",
				history: [
					{
						id: 1,
						date: "2025-02-24 09:30",
						user: "김판매",
						action: "수금 등록",
						notes: "2월 제품 판매 수금 등록",
					},
					{
						id: 2,
						date: "2025-02-24 14:15",
						user: "박경리",
						action: "결제 확인",
						notes: "법인카드 결제 확인",
					},
					{
						id: 3,
						date: "2025-02-24 14:30",
						user: "박경리",
						action: "거래 완료",
						notes: "수금 완료 처리",
					},
				],
				relatedDocuments: [
					{
						id: 1,
						type: "거래명세서",
						reference: "SO-2025022102",
						date: "2025-02-24",
						status: "발행완료",
					},
					{
						id: 2,
						type: "세금계산서",
						reference: "TXINV-2025022401",
						date: "2025-02-24",
						status: "발행완료",
					},
				],
			},
		},
		payments: {
			1: {
				id: 1,
				transactionNumber: "PY-2025022501",
				counterparty: "동화기업",
				counterpartyContact: "02-345-6789",
				vendorCode: "VEN-DO001",
				invoiceReference: "INV-DO-2025020501",
				amount: 4320000,
				taxAmount: 432000,
				netAmount: 3888000,
				dueDate: "2025-03-05",
				transactionDate: "2025-02-25",
				status: "pending",
				paymentMethod: "계좌이체",
				bankAccount: "우리은행 987-654-321098",
				bankAccountName: "동화기업",
				description: "2025년 2월 원자재 구매",
				notes: "입금 후 담당자에게 확인 요청",
				issuer: "이구매",
				history: [
					{
						id: 1,
						date: "2025-02-25 11:30",
						user: "이구매",
						action: "결제 등록",
						notes: "2월 원자재 구매 결제 등록",
					},
				],
				relatedDocuments: [
					{
						id: 1,
						type: "인보이스",
						reference: "INV-DO-2025020501",
						date: "2025-02-05",
						status: "접수완료",
					},
				],
			},
			2: {
				id: 2,
				transactionNumber: "PY-2025022401",
				counterparty: "한솔홈데코",
				counterpartyContact: "02-456-7890",
				vendorCode: "VEN-HS001",
				invoiceReference: "INV-HS-2025021901",
				amount: 2850000,
				taxAmount: 285000,
				netAmount: 2565000,
				dueDate: "2025-02-28",
				transactionDate: "2025-02-24",
				status: "completed",
				completionDate: "2025-02-24",
				paymentMethod: "법인계좌이체",
				bankAccount: "국민은행 456-789-012345",
				bankAccountName: "한솔홈데코",
				transferReference: "TRANSFER-87654321",
				description: "2025년 2월 PB 자재 구매",
				notes: "",
				issuer: "이구매",
				history: [
					{
						id: 1,
						date: "2025-02-24 10:45",
						user: "이구매",
						action: "결제 등록",
						notes: "2월 PB 자재 구매 결제 등록",
					},
					{
						id: 2,
						date: "2025-02-24 13:30",
						user: "박경리",
						action: "결제 실행",
						notes: "계좌이체 실행",
					},
					{
						id: 3,
						date: "2025-02-24 15:20",
						user: "박경리",
						action: "거래 완료",
						notes: "결제 완료 처리",
					},
				],
				relatedDocuments: [
					{
						id: 1,
						type: "인보이스",
						reference: "INV-HS-2025021901",
						date: "2025-02-19",
						status: "접수완료",
					},
					{
						id: 2,
						type: "입금증",
						reference: "DEP-2025022401",
						date: "2025-02-24",
						status: "발행완료",
					},
				],
			},
		},
	};

	// Status options for filtering
	const statusOptions = [
		{ id: "all", name: "전체" },
		{ id: "pending", name: "미완료" },
		{ id: "completed", name: "완료" },
		{ id: "overdue", name: "연체" },
	];

	// Update component when type prop changes
	useEffect(() => {
		setTransactionType(type);
	}, [type]);

	// Load transactions based on type
	useEffect(() => {
		const fetchTransactions = async () => {
			setLoading((prev) => ({ ...prev, transactions: true }));
			try {
				// In a real application, this would be an API call
				// const response = await api.getTransactions(transactionType);
				// setTransactions(response.data);

				// Using mock data for demonstration
				setTimeout(() => {
					setTransactions(
						transactionType === "collection" ? mockCollections : mockPayments
					);
					setError((prev) => ({ ...prev, transactions: null }));
					setLoading((prev) => ({ ...prev, transactions: false }));
				}, 500);
			} catch (err) {
				setError((prev) => ({
					...prev,
					transactions: "Failed to load transactions",
				}));
				setLoading((prev) => ({ ...prev, transactions: false }));
			}
		};

		const fetchSummary = async () => {
			setLoading((prev) => ({ ...prev, summary: true }));
			try {
				// In a real application, this would be an API call
				// const response = await api.getTransactionSummary(transactionType);
				// setSummary(response.data);

				// For demonstration, calculate summary from mock data
				setTimeout(() => {
					const data =
						transactionType === "collection" ? mockCollections : mockPayments;
					const summaryData = {
						total: data.reduce((sum, item) => sum + item.amount, 0),
						completed: data
							.filter((item) => item.status === "completed")
							.reduce((sum, item) => sum + item.amount, 0),
						pending: data
							.filter((item) => item.status === "pending")
							.reduce((sum, item) => sum + item.amount, 0),
						overdue: data
							.filter((item) => item.status === "overdue")
							.reduce((sum, item) => sum + item.amount, 0),
						today: data
							.filter(
								(item) =>
									item.transactionDate ===
									new Date().toISOString().split("T")[0]
							)
							.reduce((sum, item) => sum + item.amount, 0),
					};
					setSummary(summaryData);
					setError((prev) => ({ ...prev, summary: null }));
					setLoading((prev) => ({ ...prev, summary: false }));
				}, 500);
			} catch (err) {
				setError((prev) => ({
					...prev,
					summary: "Failed to load summary data",
				}));
				setLoading((prev) => ({ ...prev, summary: false }));
			}
		};

		fetchTransactions();
		fetchSummary();
		// Reset selections when transaction type changes
		setSelectedTransaction(null);
		setTransactionDetails(null);
	}, [transactionType]);

	// Filter transactions based on search term, date range, and status
	useEffect(() => {
		if (!transactions || transactions.length === 0) return;

		let filtered = [...transactions];

		// Apply search term filter
		if (searchTerm) {
			filtered = filtered.filter(
				(transaction) =>
					transaction.transactionNumber
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					transaction.counterparty
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					(transaction.orderReference &&
						transaction.orderReference
							.toLowerCase()
							.includes(searchTerm.toLowerCase())) ||
					(transaction.invoiceReference &&
						transaction.invoiceReference
							.toLowerCase()
							.includes(searchTerm.toLowerCase()))
			);
		}

		// Apply date range filter
		if (dateRange.start && dateRange.end) {
			filtered = filtered.filter((transaction) => {
				const transactionDate = new Date(transaction.transactionDate);
				const startDate = new Date(dateRange.start);
				const endDate = new Date(dateRange.end);
				endDate.setHours(23, 59, 59); // Include the end date fully

				return transactionDate >= startDate && transactionDate <= endDate;
			});
		}

		// Apply status filter
		if (statusFilter !== "all") {
			filtered = filtered.filter(
				(transaction) => transaction.status === statusFilter
			);
		}

		setFilteredTransactions(filtered);

		// Auto-select first transaction if available and none selected
		if (filtered.length > 0 && !selectedTransaction) {
			handleTransactionSelect(filtered[0]);
		}
	}, [searchTerm, dateRange, statusFilter, transactions, selectedTransaction]);

	// Load transaction details when a transaction is selected
	useEffect(() => {
		if (!selectedTransaction) return;

		const fetchTransactionDetails = async () => {
			setLoading((prev) => ({ ...prev, details: true }));
			try {
				// In a real application, this would be an API call
				// const response = await api.getTransactionDetails(selectedTransaction.id, transactionType);
				// setTransactionDetails(response.data);

				// Using mock data for demonstration
				setTimeout(() => {
					const details =
						transactionType === "collection"
							? mockTransactionDetails.collections[selectedTransaction.id]
							: mockTransactionDetails.payments[selectedTransaction.id];
					setTransactionDetails(details || null);
					setError((prev) => ({ ...prev, details: null }));
					setLoading((prev) => ({ ...prev, details: false }));
				}, 300);
			} catch (err) {
				setError((prev) => ({
					...prev,
					details: "Failed to load transaction details",
				}));
				setLoading((prev) => ({ ...prev, details: false }));
			}
		};

		fetchTransactionDetails();
	}, [selectedTransaction, transactionType]);

	// Handle transaction selection
	const handleTransactionSelect = useCallback((transaction) => {
		setSelectedTransaction(transaction);
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

	// Handle transaction type toggle
	const handleTransactionTypeToggle = (type) => {
		if (type !== transactionType) {
			setTransactionType(type);
		}
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
				return <span className="status-badge status-pending">미완료</span>;
			case "completed":
				return <span className="status-badge status-completed">완료</span>;
			case "overdue":
				return <span className="status-badge status-overdue">연체</span>;
			default:
				return <span className="status-badge">{status}</span>;
		}
	};

	// Render summary statistics
	const renderSummary = () => {
		if (loading.summary) {
			return <div className="loading-indicator">Loading summary data...</div>;
		}

		if (error.summary) {
			return <div className="error-message">{error.summary}</div>;
		}

		return (
			<div className="summary-section">
				<div className="summary-item">
					<span className="summary-label">
						총 {transactionType === "collection" ? "수금" : "지급"}액:
					</span>
					<span className="summary-value">{formatCurrency(summary.total)}</span>
				</div>
				<div className="summary-item">
					<span className="summary-label">완료 금액:</span>
					<span className="summary-value success">
						{formatCurrency(summary.completed)}
					</span>
				</div>
				<div className="summary-item">
					<span className="summary-label">미완료 금액:</span>
					<span className="summary-value warning">
						{formatCurrency(summary.pending)}
					</span>
				</div>
				<div className="summary-item">
					<span className="summary-label">연체 금액:</span>
					<span className="summary-value danger">
						{formatCurrency(summary.overdue)}
					</span>
				</div>
				<div className="summary-item">
					<span className="summary-label">오늘 등록:</span>
					<span className="summary-value info">
						{formatCurrency(summary.today)}
					</span>
				</div>
			</div>
		);
	};

	// Render transaction list
	const renderTransactionList = () => {
		if (loading.transactions) {
			return <div className="loading-indicator">Loading transactions...</div>;
		}

		if (error.transactions) {
			return <div className="error-message">{error.transactions}</div>;
		}

		if (filteredTransactions.length === 0) {
			return <div className="no-data">검색 결과가 없습니다.</div>;
		}

		return (
			<table className="transaction-table">
				<thead>
					<tr>
						<th>거래번호</th>
						<th>거래처</th>
						<th>참조번호</th>
						<th>금액</th>
						<th>거래일자</th>
						<th>만기일</th>
						<th>상태</th>
					</tr>
				</thead>
				<tbody>
					{filteredTransactions.map((transaction) => (
						<tr
							key={transaction.id}
							className={`transaction-item ${
								selectedTransaction?.id === transaction.id ? "selected" : ""
							}`}
							onClick={() => handleTransactionSelect(transaction)}>
							<td>{transaction.transactionNumber}</td>
							<td>{transaction.counterparty}</td>
							<td>
								{transaction.orderReference || transaction.invoiceReference}
							</td>
							<td>{formatCurrency(transaction.amount)}</td>
							<td>{formatDate(transaction.transactionDate)}</td>
							<td>{formatDate(transaction.dueDate)}</td>
							<td>{getStatusBadge(transaction.status)}</td>
						</tr>
					))}
				</tbody>
			</table>
		);
	};

	// Render transaction details
	const renderTransactionDetails = () => {
		if (!selectedTransaction) {
			return (
				<div className="no-data">거래 정보를 확인하려면 항목을 선택하세요.</div>
			);
		}

		if (loading.details) {
			return (
				<div className="loading-indicator">Loading transaction details...</div>
			);
		}

		if (error.details) {
			return <div className="error-message">{error.details}</div>;
		}

		if (!transactionDetails) {
			return <div className="no-data">상세 정보가 없습니다.</div>;
		}

		return (
			<div className="transaction-details">
				<h3 className="details-title">
					{transactionType === "collection" ? "수금" : "지급"} 상세 정보
				</h3>

				<div className="details-section">
					<h4 className="section-subtitle">기본 정보</h4>
					<div className="details-grid">
						<div className="details-item">
							<span className="details-label">거래번호:</span>
							<span className="details-value">
								{transactionDetails.transactionNumber}
							</span>
						</div>
						<div className="details-item">
							<span className="details-label">거래처:</span>
							<span className="details-value">
								{transactionDetails.counterparty}
							</span>
						</div>
						<div className="details-item">
							<span className="details-label">거래처코드:</span>
							<span className="details-value">
								{transactionType === "collection"
									? transactionDetails.customerCode
									: transactionDetails.vendorCode}
							</span>
						</div>
						<div className="details-item">
							<span className="details-label">연락처:</span>
							<span className="details-value">
								{transactionDetails.counterpartyContact}
							</span>
						</div>
						<div className="details-item">
							<span className="details-label">참조번호:</span>
							<span className="details-value">
								{transactionDetails.orderReference ||
									transactionDetails.invoiceReference}
							</span>
						</div>
						<div className="details-item">
							<span className="details-label">거래일자:</span>
							<span className="details-value">
								{formatDate(transactionDetails.transactionDate)}
							</span>
						</div>
						<div className="details-item">
							<span className="details-label">만기일:</span>
							<span className="details-value">
								{formatDate(transactionDetails.dueDate)}
							</span>
						</div>
						<div className="details-item">
							<span className="details-label">상태:</span>
							<span className="details-value">
								{getStatusBadge(transactionDetails.status)}
							</span>
						</div>
						{transactionDetails.completionDate && (
							<div className="details-item">
								<span className="details-label">완료일자:</span>
								<span className="details-value">
									{formatDate(transactionDetails.completionDate)}
								</span>
							</div>
						)}
					</div>
				</div>

				<div className="details-section">
					<h4 className="section-subtitle">금액 정보</h4>
					<div className="details-grid">
						<div className="details-item">
							<span className="details-label">공급가액:</span>
							<span className="details-value">
								{formatCurrency(transactionDetails.netAmount)}
							</span>
						</div>
						<div className="details-item">
							<span className="details-label">세액:</span>
							<span className="details-value">
								{formatCurrency(transactionDetails.taxAmount)}
							</span>
						</div>
						<div className="details-item">
							<span className="details-label">총액:</span>
							<span className="details-value highlight">
								{formatCurrency(transactionDetails.amount)}
							</span>
						</div>
						<div className="details-item">
							<span className="details-label">거래내용:</span>
							<span className="details-value">
								{transactionDetails.description}
							</span>
						</div>
					</div>
				</div>

				<div className="details-section">
					<h4 className="section-subtitle">결제 정보</h4>
					<div className="details-grid">
						<div className="details-item">
							<span className="details-label">결제방법:</span>
							<span className="details-value">
								{transactionDetails.paymentMethod}
							</span>
						</div>
						{transactionDetails.bankAccount && (
							<div className="details-item">
								<span className="details-label">계좌번호:</span>
								<span className="details-value">
									{transactionDetails.bankAccount}
								</span>
							</div>
						)}
						{transactionDetails.bankAccountName && (
							<div className="details-item">
								<span className="details-label">예금주:</span>
								<span className="details-value">
									{transactionDetails.bankAccountName}
								</span>
							</div>
						)}
						{transactionDetails.cardNumber && (
							<div className="details-item">
								<span className="details-label">카드번호:</span>
								<span className="details-value">
									{transactionDetails.cardNumber}
								</span>
							</div>
						)}
						{transactionDetails.cardCompany && (
							<div className="details-item">
								<span className="details-label">카드사:</span>
								<span className="details-value">
									{transactionDetails.cardCompany}
								</span>
							</div>
						)}
						{transactionDetails.approvalNumber && (
							<div className="details-item">
								<span className="details-label">승인번호:</span>
								<span className="details-value">
									{transactionDetails.approvalNumber}
								</span>
							</div>
						)}
						{transactionDetails.transferReference && (
							<div className="details-item">
								<span className="details-label">이체참조번호:</span>
								<span className="details-value">
									{transactionDetails.transferReference}
								</span>
							</div>
						)}
						<div className="details-item">
							<span className="details-label">등록자:</span>
							<span className="details-value">{transactionDetails.issuer}</span>
						</div>
						{transactionDetails.notes && (
							<div className="details-item">
								<span className="details-label">참고사항:</span>
								<span className="details-value">
									{transactionDetails.notes}
								</span>
							</div>
						)}
					</div>
				</div>

				<div className="details-section">
					<h4 className="section-subtitle">처리 내역</h4>
					{transactionDetails.history &&
					transactionDetails.history.length > 0 ? (
						<table className="history-table">
							<thead>
								<tr>
									<th>날짜</th>
									<th>담당자</th>
									<th>처리내용</th>
									<th>비고</th>
								</tr>
							</thead>
							<tbody>
								{transactionDetails.history.map((history) => (
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

				<div className="details-section">
					<h4 className="section-subtitle">관련 문서</h4>
					{transactionDetails.relatedDocuments &&
					transactionDetails.relatedDocuments.length > 0 ? (
						<table className="documents-table">
							<thead>
								<tr>
									<th>문서 유형</th>
									<th>참조번호</th>
									<th>날짜</th>
									<th>상태</th>
									<th>작업</th>
								</tr>
							</thead>
							<tbody>
								{transactionDetails.relatedDocuments.map((document) => (
									<tr key={document.id}>
										<td>{document.type}</td>
										<td>{document.reference}</td>
										<td>{formatDate(document.date)}</td>
										<td>{document.status}</td>
										<td>
											<button className="action-link">보기</button>
											<button className="action-link">출력</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<div className="no-data">관련 문서가 없습니다.</div>
					)}
				</div>
			</div>
		);
	};

	return (
		<div className="financial-management">
			{/* Header section */}
			<div className="financial-header">
				<h2 className="module-title">
					{transactionType === "collection" ? "수금" : "지급"} 관리
				</h2>

				<div className="transaction-type-selector">
					<button
						className={`transaction-type-btn ${
							transactionType === "collection" ? "active" : ""
						}`}
						onClick={() => handleTransactionTypeToggle("collection")}>
						수금 관리
					</button>
					<button
						className={`transaction-type-btn ${
							transactionType === "payment" ? "active" : ""
						}`}
						onClick={() => handleTransactionTypeToggle("payment")}>
						지급 관리
					</button>
				</div>

				{/* Summary section */}
				{renderSummary()}

				<div className="transaction-filters">
					<form
						onSubmit={handleSearchSubmit}
						className="search-form">
						<input
							type="text"
							className="search-input"
							placeholder="거래번호, 거래처명, 참조번호 검색"
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

				<div className="transaction-actions">
					<button
						className="btn btn-primary"
						onClick={() => setShowNewTransactionModal(true)}>
						{transactionType === "collection" ? "수금 등록" : "지급 등록"}
					</button>
					<button className="btn btn-secondary">
						{transactionType === "collection" ? "수금 일정" : "지급 일정"}
					</button>
					<button className="btn btn-secondary">보고서</button>
				</div>
			</div>

			{/* Main content area */}
			<div className="financial-content">
				{/* Transaction list section */}
				<div className="transaction-list-section">
					{renderTransactionList()}
				</div>

				{/* Transaction details section */}
				<div className="transaction-details-section">
					{renderTransactionDetails()}
				</div>
			</div>

			{/* Action buttons for selected transaction */}
			{selectedTransaction && (
				<div className="action-buttons">
					{selectedTransaction.status === "pending" && (
						<button className="action-button complete-button">
							{transactionType === "collection" ? "수금 완료" : "지급 완료"}{" "}
							처리
						</button>
					)}
					{selectedTransaction.status === "overdue" && (
						<button className="action-button overdue-button">연체 처리</button>
					)}
					<button className="action-button edit-button">정보 수정</button>
					<button className="action-button print-button">영수증 출력</button>
					{selectedTransaction.status === "pending" && (
						<button className="action-button cancel-button">취소</button>
					)}
				</div>
			)}
		</div>
	);
};

FinancialManagement.propTypes = {
	type: PropTypes.oneOf(["collection", "payment"]),
};

export default FinancialManagement;

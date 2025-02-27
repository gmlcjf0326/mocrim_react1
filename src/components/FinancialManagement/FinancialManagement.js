import React, { useState, useEffect } from "react";
import "./FinancialManagement.css";

const FinancialManagement = () => {
	// 상태 관리
	const [transactionType, setTransactionType] = useState("all");
	const [transactions, setTransactions] = useState([]);
	const [selectedTransaction, setSelectedTransaction] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [modalType, setModalType] = useState("");
	const [filterDate, setFilterDate] = useState({
		startDate: "",
		endDate: "",
	});
	const [filterStatus, setFilterStatus] = useState("all");
	const [filterAmount, setFilterAmount] = useState({
		min: "",
		max: "",
	});
	const [searchQuery, setSearchQuery] = useState("");

	// 거래 데이터 가져오기 (모의 데이터)
	useEffect(() => {
		// 실제 구현에서는 API 호출로 대체
		const fetchTransactions = async () => {
			try {
				setLoading(true);
				// 모의 데이터 생성
				const mockTransactions = [
					{
						id: "INV-2023-001",
						date: "2023-10-15",
						type: "invoice",
						description: "10월 원자재 구매",
						amount: 1250000,
						status: "completed",
						counterparty: "대한철강",
						dueDate: "2023-11-15",
						paymentMethod: "계좌이체",
						category: "원자재",
						reference: "PO-2023-089",
						notes: "정기 구매 계약",
						documents: [
							{
								id: "DOC-001",
								name: "인보이스.pdf",
								type: "invoice",
								date: "2023-10-15",
							},
							{
								id: "DOC-002",
								name: "거래명세서.pdf",
								type: "receipt",
								date: "2023-10-15",
							},
						],
						history: [
							{ date: "2023-10-15", action: "인보이스 생성", user: "김재무" },
							{ date: "2023-10-20", action: "결제 승인", user: "박대표" },
							{ date: "2023-10-25", action: "결제 완료", user: "시스템" },
						],
					},
					{
						id: "PAY-2023-042",
						date: "2023-10-10",
						type: "payment",
						description: "9월 전기세",
						amount: 780000,
						status: "completed",
						counterparty: "한국전력",
						dueDate: "2023-10-25",
						paymentMethod: "자동이체",
						category: "공과금",
						reference: "UTIL-2023-09",
						notes: "",
						documents: [
							{
								id: "DOC-003",
								name: "전기요금청구서.pdf",
								type: "bill",
								date: "2023-10-05",
							},
							{
								id: "DOC-004",
								name: "결제영수증.pdf",
								type: "receipt",
								date: "2023-10-10",
							},
						],
						history: [
							{ date: "2023-10-05", action: "청구서 수신", user: "시스템" },
							{ date: "2023-10-10", action: "자동이체 완료", user: "시스템" },
						],
					},
					{
						id: "EXP-2023-103",
						date: "2023-10-18",
						type: "expense",
						description: "영업팀 회식비",
						amount: 450000,
						status: "pending",
						counterparty: "직원 경비 청구",
						dueDate: "2023-10-30",
						paymentMethod: "법인카드",
						category: "접대비",
						reference: "EMP-2023-045",
						notes: "분기별 영업팀 회식",
						documents: [
							{
								id: "DOC-005",
								name: "영수증.jpg",
								type: "receipt",
								date: "2023-10-18",
							},
							{
								id: "DOC-006",
								name: "경비청구서.pdf",
								type: "expense",
								date: "2023-10-19",
							},
						],
						history: [
							{ date: "2023-10-19", action: "경비 청구", user: "이영업" },
							{ date: "2023-10-20", action: "1차 승인", user: "김팀장" },
						],
					},
					{
						id: "REC-2023-078",
						date: "2023-10-05",
						type: "receipt",
						description: "9월 제품 납품대금",
						amount: 3450000,
						status: "completed",
						counterparty: "삼성전자",
						dueDate: "2023-10-05",
						paymentMethod: "계좌이체",
						category: "매출",
						reference: "SO-2023-156",
						notes: "",
						documents: [
							{
								id: "DOC-007",
								name: "입금확인서.pdf",
								type: "receipt",
								date: "2023-10-05",
							},
							{
								id: "DOC-008",
								name: "세금계산서.pdf",
								type: "invoice",
								date: "2023-09-30",
							},
						],
						history: [
							{ date: "2023-09-30", action: "세금계산서 발행", user: "김재무" },
							{ date: "2023-10-05", action: "입금 확인", user: "시스템" },
						],
					},
					{
						id: "INV-2023-002",
						date: "2023-10-25",
						type: "invoice",
						description: "사무실 임대료",
						amount: 2000000,
						status: "pending",
						counterparty: "강남빌딩",
						dueDate: "2023-11-05",
						paymentMethod: "계좌이체",
						category: "임대료",
						reference: "RENT-2023-11",
						notes: "11월 사무실 임대료",
						documents: [
							{
								id: "DOC-009",
								name: "임대료청구서.pdf",
								type: "invoice",
								date: "2023-10-25",
							},
						],
						history: [
							{ date: "2023-10-25", action: "청구서 수신", user: "박총무" },
						],
					},
					{
						id: "PAY-2023-043",
						date: "2023-10-30",
						type: "payment",
						description: "직원 급여",
						amount: 12500000,
						status: "pending",
						counterparty: "직원급여",
						dueDate: "2023-11-05",
						paymentMethod: "급여이체",
						category: "인건비",
						reference: "SAL-2023-10",
						notes: "10월 급여",
						documents: [
							{
								id: "DOC-010",
								name: "급여명세서.xlsx",
								type: "payroll",
								date: "2023-10-28",
							},
						],
						history: [
							{ date: "2023-10-28", action: "급여 계산", user: "최인사" },
							{ date: "2023-10-29", action: "급여 승인", user: "박대표" },
						],
					},
					{
						id: "REC-2023-079",
						date: "2023-10-12",
						type: "receipt",
						description: "특별 주문 선금",
						amount: 5000000,
						status: "completed",
						counterparty: "LG전자",
						dueDate: "2023-10-12",
						paymentMethod: "계좌이체",
						category: "선수금",
						reference: "SO-2023-157",
						notes: "특별 주문 프로젝트 선금",
						documents: [
							{
								id: "DOC-011",
								name: "입금확인서.pdf",
								type: "receipt",
								date: "2023-10-12",
							},
							{
								id: "DOC-012",
								name: "계약서.pdf",
								type: "contract",
								date: "2023-10-10",
							},
						],
						history: [
							{ date: "2023-10-10", action: "계약 체결", user: "김영업" },
							{ date: "2023-10-12", action: "선금 입금 확인", user: "시스템" },
						],
					},
					{
						id: "EXP-2023-104",
						date: "2023-10-08",
						type: "expense",
						description: "사무용품 구매",
						amount: 350000,
						status: "completed",
						counterparty: "오피스디포",
						dueDate: "2023-10-08",
						paymentMethod: "법인카드",
						category: "사무용품",
						reference: "PUR-2023-045",
						notes: "분기별 사무용품 구매",
						documents: [
							{
								id: "DOC-013",
								name: "영수증.pdf",
								type: "receipt",
								date: "2023-10-08",
							},
						],
						history: [
							{ date: "2023-10-08", action: "구매 완료", user: "박총무" },
							{ date: "2023-10-09", action: "경비 처리", user: "김재무" },
						],
					},
				];

				setTransactions(mockTransactions);
				setLoading(false);
			} catch (err) {
				setError("거래 데이터를 불러오는 중 오류가 발생했습니다.");
				setLoading(false);
			}
		};

		fetchTransactions();
	}, []);

	// 필터링된 거래 목록
	const filteredTransactions = transactions.filter((transaction) => {
		// 거래 유형 필터링
		if (transactionType !== "all" && transaction.type !== transactionType) {
			return false;
		}

		// 상태 필터링
		if (filterStatus !== "all" && transaction.status !== filterStatus) {
			return false;
		}

		// 날짜 필터링
		if (
			filterDate.startDate &&
			new Date(transaction.date) < new Date(filterDate.startDate)
		) {
			return false;
		}
		if (
			filterDate.endDate &&
			new Date(transaction.date) > new Date(filterDate.endDate)
		) {
			return false;
		}

		// 금액 필터링
		if (filterAmount.min && transaction.amount < parseFloat(filterAmount.min)) {
			return false;
		}
		if (filterAmount.max && transaction.amount > parseFloat(filterAmount.max)) {
			return false;
		}

		// 검색어 필터링
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			return (
				transaction.id.toLowerCase().includes(query) ||
				transaction.description.toLowerCase().includes(query) ||
				transaction.counterparty.toLowerCase().includes(query)
			);
		}

		return true;
	});

	// 거래 선택 핸들러
	const handleSelectTransaction = (transaction) => {
		setSelectedTransaction(transaction);
	};

	// 모달 열기 핸들러
	const openModal = (type) => {
		setModalType(type);
		setShowModal(true);
	};

	// 모달 닫기 핸들러
	const closeModal = () => {
		setShowModal(false);
	};

	// 거래 상태 변경 핸들러
	const handleStatusChange = (transactionId, newStatus) => {
		setTransactions((prevTransactions) =>
			prevTransactions.map((transaction) =>
				transaction.id === transactionId
					? { ...transaction, status: newStatus }
					: transaction
			)
		);

		if (selectedTransaction && selectedTransaction.id === transactionId) {
			setSelectedTransaction((prev) => ({ ...prev, status: newStatus }));
		}

		alert(`거래 ${transactionId}의 상태가 ${newStatus}로 변경되었습니다.`);
	};

	// 거래 삭제 핸들러
	const handleDeleteTransaction = (transactionId) => {
		if (window.confirm("이 거래를 삭제하시겠습니까?")) {
			setTransactions((prevTransactions) =>
				prevTransactions.filter(
					(transaction) => transaction.id !== transactionId
				)
			);

			if (selectedTransaction && selectedTransaction.id === transactionId) {
				setSelectedTransaction(null);
			}

			alert(`거래 ${transactionId}가 삭제되었습니다.`);
		}
	};

	// 거래 생성 핸들러
	const handleCreateTransaction = (newTransaction) => {
		// 실제 구현에서는 API 호출로 대체
		const transaction = {
			id: `TRX-${Date.now()}`,
			date: new Date().toISOString().split("T")[0],
			...newTransaction,
			status: "pending",
			documents: [],
			history: [
				{
					date: new Date().toISOString().split("T")[0],
					action: "거래 생성",
					user: "현재 사용자",
				},
			],
		};

		// 거래 생성 핸들러 계속
		setTransactions((prevTransactions) => [transaction, ...prevTransactions]);
		closeModal();
		alert("새 거래가 생성되었습니다.");
	};

	// 거래 수정 핸들러
	const handleEditTransaction = (updatedTransaction) => {
		// 실제 구현에서는 API 호출로 대체
		setTransactions((prevTransactions) =>
			prevTransactions.map((transaction) =>
				transaction.id === updatedTransaction.id
					? { ...transaction, ...updatedTransaction }
					: transaction
			)
		);

		if (
			selectedTransaction &&
			selectedTransaction.id === updatedTransaction.id
		) {
			setSelectedTransaction((prev) => ({ ...prev, ...updatedTransaction }));
		}

		closeModal();
		alert("거래가 수정되었습니다.");
	};

	// 거래 완료 핸들러
	const handleCompleteTransaction = () => {
		if (selectedTransaction) {
			handleStatusChange(selectedTransaction.id, "completed");
		}
	};

	// 거래 인쇄 핸들러
	const handlePrintTransaction = () => {
		alert("인쇄 기능이 실행되었습니다.");
		// 실제 구현에서는 인쇄 기능 구현
	};

	// 거래 취소 핸들러
	const handleCancelTransaction = () => {
		if (selectedTransaction) {
			handleStatusChange(selectedTransaction.id, "cancelled");
		}
	};

	// 금액 포맷팅 함수
	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("ko-KR", {
			style: "currency",
			currency: "KRW",
		}).format(amount);
	};

	// 날짜 포맷팅 함수
	const formatDate = (dateString) => {
		const options = { year: "numeric", month: "long", day: "numeric" };
		return new Date(dateString).toLocaleDateString("ko-KR", options);
	};

	// 거래 유형 한글 변환
	const getTransactionTypeText = (type) => {
		const types = {
			all: "전체",
			invoice: "청구서",
			payment: "지출",
			receipt: "입금",
			expense: "경비",
		};
		return types[type] || type;
	};

	// 거래 상태 한글 변환
	const getStatusText = (status) => {
		const statuses = {
			all: "전체",
			pending: "대기중",
			completed: "완료",
			cancelled: "취소됨",
			overdue: "기한초과",
		};
		return statuses[status] || status;
	};

	// 거래 상태에 따른 배지 클래스
	const getStatusBadgeClass = (status) => {
		const classes = {
			pending: "status-pending",
			completed: "status-completed",
			cancelled: "status-cancelled",
			overdue: "status-overdue",
		};
		return `status-badge ${classes[status] || ""}`;
	};

	return (
		<div className="financial-management">
			{/* 헤더 섹션 */}
			<div className="financial-header">
				<h1 className="module-title">재무 관리</h1>

				{/* 거래 유형 선택기 */}
				<div className="transaction-type-selector">
					<button
						className={`transaction-type-btn ${
							transactionType === "all" ? "active" : ""
						}`}
						onClick={() => setTransactionType("all")}>
						전체
					</button>
					<button
						className={`transaction-type-btn ${
							transactionType === "invoice" ? "active" : ""
						}`}
						onClick={() => setTransactionType("invoice")}>
						청구서
					</button>
					<button
						className={`transaction-type-btn ${
							transactionType === "payment" ? "active" : ""
						}`}
						onClick={() => setTransactionType("payment")}>
						지출
					</button>
					<button
						className={`transaction-type-btn ${
							transactionType === "receipt" ? "active" : ""
						}`}
						onClick={() => setTransactionType("receipt")}>
						입금
					</button>
					<button
						className={`transaction-type-btn ${
							transactionType === "expense" ? "active" : ""
						}`}
						onClick={() => setTransactionType("expense")}>
						경비
					</button>
				</div>

				{/* 필터 섹션 */}
				<div className="filter-section">
					<h3 className="filter-title">필터 및 검색</h3>

					<div className="filter-row">
						<div className="filter-group">
							<label className="filter-label">검색:</label>
							<input
								type="text"
								className="filter-input"
								placeholder="거래 ID, 설명, 거래처 검색"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>

						<div className="filter-group">
							<label className="filter-label">상태:</label>
							<select
								className="filter-select"
								value={filterStatus}
								onChange={(e) => setFilterStatus(e.target.value)}>
								<option value="all">전체</option>
								<option value="pending">대기중</option>
								<option value="completed">완료</option>
								<option value="cancelled">취소됨</option>
								<option value="overdue">기한초과</option>
							</select>
						</div>
					</div>

					<div className="filter-row">
						<div className="filter-group">
							<label className="filter-label">시작일:</label>
							<input
								type="date"
								className="filter-input"
								value={filterDate.startDate}
								onChange={(e) =>
									setFilterDate({ ...filterDate, startDate: e.target.value })
								}
							/>
						</div>

						<div className="filter-group">
							<label className="filter-label">종료일:</label>
							<input
								type="date"
								className="filter-input"
								value={filterDate.endDate}
								onChange={(e) =>
									setFilterDate({ ...filterDate, endDate: e.target.value })
								}
							/>
						</div>
					</div>

					<div className="filter-row">
						<div className="filter-group">
							<label className="filter-label">최소 금액:</label>
							<input
								type="number"
								className="filter-input"
								placeholder="0"
								value={filterAmount.min}
								onChange={(e) =>
									setFilterAmount({ ...filterAmount, min: e.target.value })
								}
							/>
						</div>

						<div className="filter-group">
							<label className="filter-label">최대 금액:</label>
							<input
								type="number"
								className="filter-input"
								placeholder="무제한"
								value={filterAmount.max}
								onChange={(e) =>
									setFilterAmount({ ...filterAmount, max: e.target.value })
								}
							/>
						</div>
					</div>
				</div>

				{/* 거래 액션 버튼 */}
				<div className="transaction-actions">
					<button
						className="btn btn-primary"
						onClick={() => openModal("create")}>
						새 거래 생성
					</button>
					<button
						className="btn btn-secondary"
						onClick={() => selectedTransaction && openModal("edit")}
						disabled={!selectedTransaction}>
						거래 수정
					</button>
					<button
						className="btn btn-secondary"
						onClick={() =>
							selectedTransaction &&
							handleDeleteTransaction(selectedTransaction.id)
						}
						disabled={!selectedTransaction}>
						거래 삭제
					</button>
					<button
						className="btn btn-secondary"
						onClick={() => alert("내보내기 기능이 실행되었습니다.")}>
						내보내기
					</button>
				</div>
			</div>

			{/* 메인 콘텐츠 영역 */}
			<div className="financial-content">
				{/* 거래 목록 섹션 */}
				<div className="transaction-list-section">
					<h2 className="section-title">
						거래 목록
						<span className="item-count">
							{filteredTransactions.length}개 항목
						</span>
					</h2>

					{loading ? (
						<div className="loading-indicator">데이터를 불러오는 중...</div>
					) : error ? (
						<div className="error-message">{error}</div>
					) : filteredTransactions.length === 0 ? (
						<div className="no-data">표시할 거래가 없습니다.</div>
					) : (
						<table className="transaction-table">
							<thead>
								<tr>
									<th>ID</th>
									<th>날짜</th>
									<th>유형</th>
									<th>설명</th>
									<th>거래처</th>
									<th>금액</th>
									<th>상태</th>
								</tr>
							</thead>
							<tbody>
								{filteredTransactions.map((transaction) => (
									<tr
										key={transaction.id}
										className={
											selectedTransaction &&
											selectedTransaction.id === transaction.id
												? "selected"
												: ""
										}
										onClick={() => handleSelectTransaction(transaction)}>
										<td>{transaction.id}</td>
										<td>{formatDate(transaction.date)}</td>
										<td>{getTransactionTypeText(transaction.type)}</td>
										<td>{transaction.description}</td>
										<td>{transaction.counterparty}</td>
										<td>{formatCurrency(transaction.amount)}</td>
										<td>
											<span className={getStatusBadgeClass(transaction.status)}>
												{getStatusText(transaction.status)}
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>

				{/* 거래 상세 정보 섹션 */}
				{selectedTransaction ? (
					<div className="transaction-details-section">
						<h2 className="details-title">거래 상세 정보</h2>

						<div className="details-section">
							<h3 className="section-subtitle">기본 정보</h3>
							<div className="details-item">
								<span className="details-label">거래 ID:</span>
								<span className="details-value">{selectedTransaction.id}</span>
							</div>
							<div className="details-item">
								<span className="details-label">날짜:</span>
								<span className="details-value">
									{formatDate(selectedTransaction.date)}
								</span>
							</div>
							<div className="details-item">
								<span className="details-label">유형:</span>
								<span className="details-value">
									{getTransactionTypeText(selectedTransaction.type)}
								</span>
							</div>
							<div className="details-item">
								<span className="details-label">상태:</span>
								<span className="details-value">
									<span
										className={getStatusBadgeClass(selectedTransaction.status)}>
										{getStatusText(selectedTransaction.status)}
									</span>
								</span>
							</div>
							<div className="details-item">
								<span className="details-label">설명:</span>
								<span className="details-value">
									{selectedTransaction.description}
								</span>
							</div>
							<div className="details-item">
								<span className="details-label">거래처:</span>
								<span className="details-value">
									{selectedTransaction.counterparty}
								</span>
							</div>
							<div className="details-item">
								<span className="details-label">결제 방법:</span>
								<span className="details-value">
									{selectedTransaction.paymentMethod}
								</span>
							</div>
							<div className="details-item">
								<span className="details-label">카테고리:</span>
								<span className="details-value">
									{selectedTransaction.category}
								</span>
							</div>
							<div className="details-item">
								<span className="details-label">참조:</span>
								<span className="details-value">
									{selectedTransaction.reference}
								</span>
							</div>
							{selectedTransaction.notes && (
								<div className="details-item">
									<span className="details-label">메모:</span>
									<span className="details-value">
										{selectedTransaction.notes}
									</span>
								</div>
							)}
						</div>

						<div className="details-section">
							<h3 className="section-subtitle">금액 정보</h3>
							<div className="transaction-summary">
								<div className="summary-item">
									<div className="summary-label">금액</div>
									<div className="summary-value">
										{formatCurrency(selectedTransaction.amount)}
									</div>
								</div>
								<div className="summary-item">
									<div className="summary-label">마감일</div>
									<div className="summary-value">
										{formatDate(selectedTransaction.dueDate)}
									</div>
								</div>
								<div className="summary-item total">
									<div className="summary-label">총액</div>
									<div className="summary-value">
										{formatCurrency(selectedTransaction.amount)}
									</div>
								</div>
							</div>
						</div>

						<div className="details-section">
							<h3 className="section-subtitle">거래 내역</h3>
							<table className="history-table">
								<thead>
									<tr>
										<th>날짜</th>
										<th>작업</th>
										<th>사용자</th>
									</tr>
								</thead>
								<tbody>
									{selectedTransaction.history.map((item, index) => (
										<tr key={index}>
											<td>{formatDate(item.date)}</td>
											<td>{item.action}</td>
											<td>{item.user}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						<div className="details-section">
							<h3 className="section-subtitle">문서</h3>
							<table className="documents-table">
								<thead>
									<tr>
										<th>문서명</th>
										<th>유형</th>
										<th>날짜</th>
										<th>작업</th>
									</tr>
								</thead>
								<tbody>
									{selectedTransaction.documents.map((doc) => (
										<tr key={doc.id}>
											<td>{doc.name}</td>
											<td>{doc.type}</td>
											<td>{formatDate(doc.date)}</td>
											<td>
												<button
													className="action-link"
													onClick={() =>
														alert("문서 보기 기능이 실행되었습니다.")
													}>
													보기
												</button>
												<button
													className="action-link"
													onClick={() =>
														alert("문서 다운로드 기능이 실행되었습니다.")
													}>
													다운로드
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
							<button
								className="action-link"
								style={{ marginTop: "10px" }}
								onClick={() => alert("문서 추가 기능이 실행되었습니다.")}>
								+ 문서 추가
							</button>
						</div>

						<div className="transaction-detail-actions">
							{selectedTransaction.status === "pending" && (
								<button
									className="action-button complete-button"
									onClick={handleCompleteTransaction}>
									거래 완료
								</button>
							)}
							<button
								className="action-button print-button"
								onClick={handlePrintTransaction}>
								인쇄
							</button>
							{selectedTransaction.status !== "cancelled" && (
								<button
									className="action-button cancel-button"
									onClick={handleCancelTransaction}>
									거래 취소
								</button>
							)}
						</div>
					</div>
				) : (
					<div className="transaction-details-section">
						<div className="no-data">
							거래를 선택하여 상세 정보를 확인하세요.
						</div>
					</div>
				)}
			</div>

			{/* 모달 */}
			{showModal && (
				<div
					className="modal-overlay"
					onClick={closeModal}>
					<div
						className="modal-container"
						onClick={(e) => e.stopPropagation()}>
						<div className="modal-header">
							<h2 className="modal-title">
								{modalType === "create" ? "새 거래 생성" : "거래 수정"}
							</h2>
							<button
								className="modal-close"
								onClick={closeModal}>
								&times;
							</button>
						</div>
						<div className="modal-body">
							{/* 여기에 거래 생성/수정 폼 구현 */}
							<div className="filter-row">
								<div className="filter-group">
									<label className="filter-label">유형:</label>
									<select className="filter-select">
										<option value="invoice">청구서</option>
										<option value="payment">지출</option>
										<option value="receipt">입금</option>
										<option value="expense">경비</option>
									</select>
								</div>
								<div className="filter-group">
									<label className="filter-label">날짜:</label>
									<input
										type="date"
										className="filter-input"
									/>
								</div>
							</div>

							<div className="filter-row">
								<div className="filter-group">
									<label className="filter-label">설명:</label>
									<input
										type="text"
										className="filter-input"
										placeholder="거래 설명"
									/>
								</div>
								<div className="filter-group">
									<label className="filter-label">금액:</label>
									<input
										type="number"
										className="filter-input"
										placeholder="0"
									/>
								</div>
							</div>

							<div className="filter-row">
								<div className="filter-group">
									<label className="filter-label">거래처:</label>
									<input
										type="text"
										className="filter-input"
										placeholder="거래처명"
									/>
								</div>
								<div className="filter-group">
									<label className="filter-label">마감일:</label>
									<input
										type="date"
										className="filter-input"
									/>
								</div>
							</div>

							<div className="filter-row">
								<div className="filter-group">
									<label className="filter-label">결제 방법:</label>
									<select className="filter-select">
										<option value="계좌이체">계좌이체</option>
										<option value="법인카드">법인카드</option>
										<option value="현금">현금</option>
										<option value="자동이체">자동이체</option>
									</select>
								</div>
								<div className="filter-group">
									<label className="filter-label">카테고리:</label>
									<select className="filter-select">
										<option value="원자재">원자재</option>
										<option value="공과금">공과금</option>
										<option value="인건비">인건비</option>
										<option value="임대료">임대료</option>
										<option value="사무용품">사무용품</option>
										<option value="접대비">접대비</option>
										<option value="매출">매출</option>
										<option value="선수금">선수금</option>
									</select>
								</div>
							</div>

							<div className="filter-row">
								<div className="filter-group">
									<label className="filter-label">참조:</label>
									<input
										type="text"
										className="filter-input"
										placeholder="참조 번호"
									/>
								</div>
							</div>

							<div className="filter-row">
								<div
									className="filter-group"
									style={{ width: "100%" }}>
									<label className="filter-label">메모:</label>
									<textarea
										className="filter-input"
										placeholder="추가 메모"
										style={{
											width: "100%",
											height: "80px",
											resize: "vertical",
										}}></textarea>
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<button
								className="btn btn-secondary"
								onClick={closeModal}>
								취소
							</button>
							<button
								className="btn btn-primary"
								onClick={() => {
									if (modalType === "create") {
										// 실제 구현에서는 폼 데이터를 수집하여 전달
										handleCreateTransaction({
											type: "invoice",
											description: "새 거래",
											amount: 100000,
											counterparty: "거래처명",
											dueDate: new Date().toISOString().split("T")[0],
											paymentMethod: "계좌이체",
											category: "기타",
											reference: "",
											notes: "",
										});
									} else {
										// 실제 구현에서는 폼 데이터를 수집하여 전달
										handleEditTransaction({
											...selectedTransaction,
											description: "수정된 거래",
										});
									}
								}}>
								{modalType === "create" ? "생성" : "수정"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default FinancialManagement;

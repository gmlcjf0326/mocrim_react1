import React, { useState, useEffect } from "react";
import "./ProductionManagement.css";

const ProductionManagement = () => {
	// 상태 관리
	const [activeTab, setActiveTab] = useState("plans");
	const [productionPlans, setProductionPlans] = useState([]);
	const [selectedPlan, setSelectedPlan] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [modalType, setModalType] = useState("");
	const [filterDate, setFilterDate] = useState({
		startDate: "",
		endDate: "",
	});
	const [filterStatus, setFilterStatus] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");

	// 생산 계획 데이터 가져오기 (모의 데이터)
	useEffect(() => {
		// 실제 구현에서는 API 호출로 대체
		const fetchProductionPlans = async () => {
			try {
				setLoading(true);
				// 모의 데이터 생성
				const mockProductionPlans = [
					{
						id: "PP-2023-001",
						name: "스마트폰 케이스 생산",
						productCode: "SC-001",
						startDate: "2023-10-15",
						endDate: "2023-10-25",
						status: "in-progress",
						progress: 45,
						quantity: 5000,
						priority: "높음",
						assignedTo: "생산팀 A",
						location: "공장 1",
						notes: "고객 요청에 따른 긴급 생산",
						materials: [
							{
								id: "M001",
								name: "플라스틱 원료",
								quantity: 500,
								unit: "kg",
								status: "확보됨",
							},
							{
								id: "M002",
								name: "포장재",
								quantity: 5000,
								unit: "개",
								status: "확보됨",
							},
							{
								id: "M003",
								name: "접착제",
								quantity: 50,
								unit: "L",
								status: "부족",
							},
						],
						steps: [
							{
								id: 1,
								name: "원료 준비",
								status: "completed",
								startDate: "2023-10-15",
								endDate: "2023-10-16",
								assignedTo: "자재팀",
							},
							{
								id: 2,
								name: "사출 성형",
								status: "in-progress",
								startDate: "2023-10-17",
								endDate: "2023-10-20",
								assignedTo: "생산팀 A",
							},
							{
								id: 3,
								name: "조립",
								status: "pending",
								startDate: "2023-10-21",
								endDate: "2023-10-23",
								assignedTo: "생산팀 B",
							},
							{
								id: 4,
								name: "품질 검사",
								status: "pending",
								startDate: "2023-10-24",
								endDate: "2023-10-24",
								assignedTo: "품질팀",
							},
							{
								id: 5,
								name: "포장 및 출하",
								status: "pending",
								startDate: "2023-10-25",
								endDate: "2023-10-25",
								assignedTo: "물류팀",
							},
						],
					},
					{
						id: "PP-2023-002",
						name: "블루투스 이어폰 생산",
						productCode: "BE-002",
						startDate: "2023-10-10",
						endDate: "2023-10-30",
						status: "in-progress",
						progress: 30,
						quantity: 2000,
						priority: "중간",
						assignedTo: "생산팀 B",
						location: "공장 2",
						notes: "분기별 정기 생산",
						materials: [
							{
								id: "M004",
								name: "플라스틱 부품",
								quantity: 4000,
								unit: "개",
								status: "확보됨",
							},
							{
								id: "M005",
								name: "배터리",
								quantity: 2000,
								unit: "개",
								status: "확보됨",
							},
							{
								id: "M006",
								name: "전자 부품",
								quantity: 2000,
								unit: "세트",
								status: "확보됨",
							},
							{
								id: "M007",
								name: "포장재",
								quantity: 2000,
								unit: "개",
								status: "확보됨",
							},
						],
						steps: [
							{
								id: 1,
								name: "부품 준비",
								status: "completed",
								startDate: "2023-10-10",
								endDate: "2023-10-12",
								assignedTo: "자재팀",
							},
							{
								id: 2,
								name: "회로 조립",
								status: "completed",
								startDate: "2023-10-13",
								endDate: "2023-10-17",
								assignedTo: "전자팀",
							},
							{
								id: 3,
								name: "케이스 조립",
								status: "in-progress",
								startDate: "2023-10-18",
								endDate: "2023-10-23",
								assignedTo: "생산팀 B",
							},
							{
								id: 4,
								name: "품질 검사",
								status: "pending",
								startDate: "2023-10-24",
								endDate: "2023-10-27",
								assignedTo: "품질팀",
							},
							{
								id: 5,
								name: "포장 및 출하",
								status: "pending",
								startDate: "2023-10-28",
								endDate: "2023-10-30",
								assignedTo: "물류팀",
							},
						],
					},
					{
						id: "PP-2023-003",
						name: "태블릿 케이스 생산",
						productCode: "TC-003",
						startDate: "2023-10-20",
						endDate: "2023-10-30",
						status: "planned",
						progress: 0,
						quantity: 3000,
						priority: "중간",
						assignedTo: "생산팀 C",
						location: "공장 1",
						notes: "",
						materials: [
							{
								id: "M008",
								name: "가죽 원단",
								quantity: 300,
								unit: "m²",
								status: "확보됨",
							},
							{
								id: "M009",
								name: "접착제",
								quantity: 30,
								unit: "L",
								status: "확보됨",
							},
							{
								id: "M010",
								name: "포장재",
								quantity: 3000,
								unit: "개",
								status: "주문 중",
							},
						],
						steps: [
							{
								id: 1,
								name: "원료 준비",
								status: "pending",
								startDate: "2023-10-20",
								endDate: "2023-10-21",
								assignedTo: "자재팀",
							},
							{
								id: 2,
								name: "재단",
								status: "pending",
								startDate: "2023-10-22",
								endDate: "2023-10-24",
								assignedTo: "생산팀 C",
							},
							{
								id: 3,
								name: "봉제",
								status: "pending",
								startDate: "2023-10-25",
								endDate: "2023-10-27",
								assignedTo: "생산팀 C",
							},
							{
								id: 4,
								name: "품질 검사",
								status: "pending",
								startDate: "2023-10-28",
								endDate: "2023-10-29",
								assignedTo: "품질팀",
							},
							{
								id: 5,
								name: "포장 및 출하",
								status: "pending",
								startDate: "2023-10-30",
								endDate: "2023-10-30",
								assignedTo: "물류팀",
							},
						],
					},
					{
						id: "PP-2023-004",
						name: "노트북 파우치 생산",
						productCode: "NP-004",
						startDate: "2023-10-05",
						endDate: "2023-10-15",
						status: "completed",
						progress: 100,
						quantity: 1000,
						priority: "낮음",
						assignedTo: "생산팀 C",
						location: "공장 3",
						notes: "소량 주문 생산",
						materials: [
							{
								id: "M011",
								name: "나일론 원단",
								quantity: 150,
								unit: "m²",
								status: "확보됨",
							},
							{
								id: "M012",
								name: "지퍼",
								quantity: 1000,
								unit: "개",
								status: "확보됨",
							},
							{
								id: "M013",
								name: "라벨",
								quantity: 1000,
								unit: "개",
								status: "확보됨",
							},
							{
								id: "M014",
								name: "포장재",
								quantity: 1000,
								unit: "개",
								status: "확보됨",
							},
						],
						steps: [
							{
								id: 1,
								name: "원료 준비",
								status: "completed",
								startDate: "2023-10-05",
								endDate: "2023-10-06",
								assignedTo: "자재팀",
							},
							{
								id: 2,
								name: "재단",
								status: "completed",
								startDate: "2023-10-07",
								endDate: "2023-10-08",
								assignedTo: "생산팀 C",
							},
							{
								id: 3,
								name: "봉제",
								status: "completed",
								startDate: "2023-10-09",
								endDate: "2023-10-12",
								assignedTo: "생산팀 C",
							},
							{
								id: 4,
								name: "품질 검사",
								status: "completed",
								startDate: "2023-10-13",
								endDate: "2023-10-14",
								assignedTo: "품질팀",
							},
							{
								id: 5,
								name: "포장 및 출하",
								status: "completed",
								startDate: "2023-10-15",
								endDate: "2023-10-15",
								assignedTo: "물류팀",
							},
						],
					},
					{
						id: "PP-2023-005",
						name: "스마트워치 밴드 생산",
						productCode: "SB-005",
						startDate: "2023-10-12",
						endDate: "2023-10-22",
						status: "delayed",
						progress: 20,
						quantity: 10000,
						priority: "높음",
						assignedTo: "생산팀 A",
						location: "공장 2",
						notes: "자재 공급 지연으로 일정 지연",
						materials: [
							{
								id: "M015",
								name: "실리콘 원료",
								quantity: 200,
								unit: "kg",
								status: "부족",
							},
							{
								id: "M016",
								name: "버클",
								quantity: 10000,
								unit: "개",
								status: "확보됨",
							},
							{
								id: "M017",
								name: "포장재",
								quantity: 10000,
								unit: "개",
								status: "확보됨",
							},
						],
						steps: [
							{
								id: 1,
								name: "원료 준비",
								status: "in-progress",
								startDate: "2023-10-12",
								endDate: "2023-10-14",
								assignedTo: "자재팀",
							},
							{
								id: 2,
								name: "사출 성형",
								status: "pending",
								startDate: "2023-10-15",
								endDate: "2023-10-18",
								assignedTo: "생산팀 A",
							},
							{
								id: 3,
								name: "조립",
								status: "pending",
								startDate: "2023-10-19",
								endDate: "2023-10-20",
								assignedTo: "생산팀 A",
							},
							{
								id: 4,
								name: "품질 검사",
								status: "pending",
								startDate: "2023-10-21",
								endDate: "2023-10-21",
								assignedTo: "품질팀",
							},
							{
								id: 5,
								name: "포장 및 출하",
								status: "pending",
								startDate: "2023-10-22",
								endDate: "2023-10-22",
								assignedTo: "물류팀",
							},
						],
					},
				];

				setProductionPlans(mockProductionPlans);
				setLoading(false);
			} catch (err) {
				setError("생산 계획 데이터를 불러오는 중 오류가 발생했습니다.");
				setLoading(false);
			}
		};

		fetchProductionPlans();
	}, []);

	// 필터링된 생산 계획 목록
	const filteredPlans = productionPlans.filter((plan) => {
		// 상태 필터링
		if (filterStatus !== "all" && plan.status !== filterStatus) {
			return false;
		}

		// 날짜 필터링
		if (
			filterDate.startDate &&
			new Date(plan.startDate) < new Date(filterDate.startDate)
		) {
			return false;
		}
		if (
			filterDate.endDate &&
			new Date(plan.endDate) > new Date(filterDate.endDate)
		) {
			return false;
		}

		// 검색어 필터링
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			return (
				plan.id.toLowerCase().includes(query) ||
				plan.name.toLowerCase().includes(query) ||
				plan.productCode.toLowerCase().includes(query) ||
				plan.assignedTo.toLowerCase().includes(query)
			);
		}

		return true;
	});

	// 생산 계획 선택 핸들러
	const handleSelectPlan = (plan) => {
		setSelectedPlan(plan);
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

	// 생산 계획 상태 변경 핸들러
	const handleStatusChange = (planId, newStatus) => {
		setProductionPlans((prevPlans) =>
			prevPlans.map((plan) =>
				plan.id === planId ? { ...plan, status: newStatus } : plan
			)
		);

		if (selectedPlan && selectedPlan.id === planId) {
			setSelectedPlan((prev) => ({ ...prev, status: newStatus }));
		}

		alert(
			`생산 계획 ${planId}의 상태가 ${getStatusText(
				newStatus
			)}(으)로 변경되었습니다.`
		);
	};

	// 생산 계획 삭제 핸들러
	const handleDeletePlan = (planId) => {
		if (window.confirm("이 생산 계획을 삭제하시겠습니까?")) {
			setProductionPlans((prevPlans) =>
				prevPlans.filter((plan) => plan.id !== planId)
			);

			if (selectedPlan && selectedPlan.id === planId) {
				setSelectedPlan(null);
			}

			alert(`생산 계획 ${planId}가 삭제되었습니다.`);
		}
	};

	// 생산 계획 생성 핸들러
	const handleCreatePlan = (newPlan) => {
		// 실제 구현에서는 API 호출로 대체
		const plan = {
			id: `PP-${Date.now()}`,
			startDate: new Date().toISOString().split("T")[0],
			endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
				.toISOString()
				.split("T")[0],
			status: "planned",
			progress: 0,
			...newPlan,
			materials: [],
			steps: [],
		};

		setProductionPlans((prevPlans) => [plan, ...prevPlans]);
		closeModal();
		alert("새 생산 계획이 생성되었습니다.");
	};

	// 생산 계획 수정 핸들러
	const handleEditPlan = (updatedPlan) => {
		// 실제 구현에서는 API 호출로 대체
		setProductionPlans((prevPlans) =>
			prevPlans.map((plan) =>
				plan.id === updatedPlan.id ? { ...plan, ...updatedPlan } : plan
			)
		);

		if (selectedPlan && selectedPlan.id === updatedPlan.id) {
			setSelectedPlan((prev) => ({ ...prev, ...updatedPlan }));
		}

		closeModal();
		alert("생산 계획이 수정되었습니다.");
	};

	// 생산 시작 핸들러
	const handleStartProduction = () => {
		if (selectedPlan && selectedPlan.status === "planned") {
			handleStatusChange(selectedPlan.id, "in-progress");
		}
	};

	// 생산 완료 핸들러
	const handleCompleteProduction = () => {
		if (
			selectedPlan &&
			(selectedPlan.status === "in-progress" ||
				selectedPlan.status === "delayed")
		) {
			handleStatusChange(selectedPlan.id, "completed");

			// 진행률 100%로 업데이트
			setProductionPlans((prevPlans) =>
				prevPlans.map((plan) =>
					plan.id === selectedPlan.id ? { ...plan, progress: 100 } : plan
				)
			);

			setSelectedPlan((prev) => ({ ...prev, progress: 100 }));
		}
	};

	// 생산 지연 핸들러
	const handleDelayProduction = () => {
		if (
			selectedPlan &&
			(selectedPlan.status === "planned" ||
				selectedPlan.status === "in-progress")
		) {
			handleStatusChange(selectedPlan.id, "delayed");
		}
	};

	// 날짜 포맷팅 함수
	const formatDate = (dateString) => {
		const options = { year: "numeric", month: "long", day: "numeric" };
		return new Date(dateString).toLocaleDateString("ko-KR", options);
	};

	// 상태 텍스트 변환
	const getStatusText = (status) => {
		const statuses = {
			all: "전체",
			planned: "계획됨",
			"in-progress": "진행 중",
			completed: "완료됨",
			delayed: "지연됨",
		};
		return statuses[status] || status;
	};

	// 상태에 따른 배지 클래스
	const getStatusBadgeClass = (status) => {
		const classes = {
			planned: "status-planned",
			"in-progress": "status-in-progress",
			completed: "status-completed",
			delayed: "status-delayed",
		};
		return `status-badge ${classes[status] || ""}`;
	};

	// 단계 상태 텍스트 변환
	const getStepStatusText = (status) => {
		const statuses = {
			pending: "대기 중",
			"in-progress": "진행 중",
			completed: "완료됨",
		};
		return statuses[status] || status;
	};

	return (
		<div className="production-management">
			{/* 헤더 섹션 */}
			<div className="production-header">
				<h1 className="module-title">생산 관리</h1>

				{/* 탭 네비게이션 */}
				<div className="tab-navigation">
					<button
						className={`tab-button ${activeTab === "plans" ? "active" : ""}`}
						onClick={() => setActiveTab("plans")}>
						생산 계획
					</button>
					<button
						className={`tab-button ${
							activeTab === "dashboard" ? "active" : ""
						}`}
						onClick={() => setActiveTab("dashboard")}>
						대시보드
					</button>
					<button
						className={`tab-button ${activeTab === "schedule" ? "active" : ""}`}
						onClick={() => setActiveTab("schedule")}>
						일정
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
								placeholder="ID, 이름, 제품 코드 검색"
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
								<option value="planned">계획됨</option>
								<option value="in-progress">진행 중</option>
								<option value="completed">완료됨</option>
								<option value="delayed">지연됨</option>
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
				</div>

				{/* 액션 버튼 */}
				<div className="action-buttons">
					<button
						className="btn btn-primary"
						onClick={() => openModal("create")}>
						새 생산 계획
					</button>
					<button
						className="btn btn-secondary"
						onClick={() => selectedPlan && openModal("edit")}
						disabled={!selectedPlan}>
						계획 수정
					</button>
					<button
						className="btn btn-secondary"
						onClick={() => selectedPlan && handleDeletePlan(selectedPlan.id)}
						disabled={!selectedPlan}>
						계획 삭제
					</button>
					<button
						className="btn btn-secondary"
						onClick={() => alert("내보내기 기능이 실행되었습니다.")}>
						내보내기
					</button>
				</div>
			</div>

			{/* 메인 콘텐츠 영역 */}
			{activeTab === "plans" && (
				<div className="production-content">
					{/* 생산 계획 목록 섹션 */}
					<div className="production-plan-section">
						<h2 className="section-title">
							생산 계획 목록
							<span className="item-count">{filteredPlans.length}개 항목</span>
						</h2>

						{loading ? (
							<div className="loading-indicator">데이터를 불러오는 중...</div>
						) : error ? (
							<div className="error-message">{error}</div>
						) : filteredPlans.length === 0 ? (
							<div className="no-data">표시할 생산 계획이 없습니다.</div>
						) : (
							<table className="production-table">
								<thead>
									<tr>
										<th>ID</th>
										<th>이름</th>
										<th>제품 코드</th>
										<th>시작일</th>
										<th>종료일</th>
										<th>수량</th>
										<th>진행률</th>
										<th>상태</th>
									</tr>
								</thead>
								<tbody>
									{filteredPlans.map((plan) => (
										<tr
											key={plan.id}
											className={
												selectedPlan && selectedPlan.id === plan.id
													? "selected"
													: ""
											}
											onClick={() => handleSelectPlan(plan)}>
											<td>{plan.id}</td>
											<td>{plan.name}</td>
											<td>{plan.productCode}</td>
											<td>{formatDate(plan.startDate)}</td>
											<td>{formatDate(plan.endDate)}</td>
											<td>{plan.quantity.toLocaleString()}</td>
											<td>{plan.progress}%</td>
											<td>
												<span className={getStatusBadgeClass(plan.status)}>
													{getStatusText(plan.status)}
												</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						)}
					</div>

					{/* 생산 계획 상세 정보 섹션 */}
					{selectedPlan ? (
						<div className="production-details-section">
							<h2 className="details-title">생산 계획 상세 정보</h2>

							<div className="details-section">
								<h3 className="section-subtitle">기본 정보</h3>
								<div className="details-item">
									<span className="details-label">계획 ID:</span>
									<span className="details-value">{selectedPlan.id}</span>
								</div>
								<div className="details-item">
									<span className="details-label">이름:</span>
									<span className="details-value">{selectedPlan.name}</span>
								</div>
								<div className="details-item">
									<span className="details-label">제품 코드:</span>
									<span className="details-value">
										{selectedPlan.productCode}
									</span>
								</div>
								<div className="details-item">
									<span className="details-label">상태:</span>
									<span className="details-value">
										<span className={getStatusBadgeClass(selectedPlan.status)}>
											{getStatusText(selectedPlan.status)}
										</span>
									</span>
								</div>
								<div className="details-item">
									<span className="details-label">시작일:</span>
									<span className="details-value">
										{formatDate(selectedPlan.startDate)}
									</span>
								</div>
								<div className="details-item">
									<span className="details-label">종료일:</span>
									<span className="details-value">
										{formatDate(selectedPlan.endDate)}
									</span>
								</div>
								<div className="details-item">
									<span className="details-label">수량:</span>
									<span className="details-value">
										{selectedPlan.quantity.toLocaleString()}
									</span>
								</div>
								<div className="details-item">
									<span className="details-label">우선순위:</span>
									<span className="details-value">{selectedPlan.priority}</span>
								</div>
								<div className="details-item">
									<span className="details-label">담당자:</span>
									<span className="details-value">
										{selectedPlan.assignedTo}
									</span>
								</div>
								<div className="details-item">
									<span className="details-label">위치:</span>
									<span className="details-value">{selectedPlan.location}</span>
								</div>
								{selectedPlan.notes && (
									<div className="details-item">
										<span className="details-label">메모:</span>
										<span className="details-value">{selectedPlan.notes}</span>
									</div>
								)}
							</div>

							<div className="details-section">
								<h3 className="section-subtitle">진행 상황</h3>
								<div className="progress-container">
									<div className="progress-bar-container">
										<div
											className="progress-bar"
											style={{ width: `${selectedPlan.progress}%` }}></div>
									</div>
									<div className="progress-text">
										<span>0%</span>
										<span>{selectedPlan.progress}%</span>
										<span>100%</span>
									</div>
								</div>
							</div>

							<div className="details-section">
								<h3 className="section-subtitle">필요 자재</h3>
								<table className="materials-table">
									<thead>
										<tr>
											<th>자재 ID</th>
											<th>이름</th>
											<th>수량</th>
											<th>단위</th>
											<th>상태</th>
										</tr>
									</thead>
									<tbody>
										{selectedPlan.materials.map((material) => (
											<tr key={material.id}>
												<td>{material.id}</td>
												<td>{material.name}</td>
												<td>{material.quantity}</td>
												<td>{material.unit}</td>
												<td>{material.status}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>

							<div className="details-section">
								<h3 className="section-subtitle">작업 단계</h3>
								<ul className="steps-list">
									{selectedPlan.steps.map((step) => (
										<li
											key={step.id}
											className="step-item">
											<div className={`step-status ${step.status}`}></div>
											<div className="step-content">
												<div className="step-title">{step.name}</div>
												<div className="step-details">
													<span>
														{formatDate(step.startDate)} -{" "}
														{formatDate(step.endDate)}
													</span>
													<span> • {step.assignedTo}</span>
													<span> • {getStepStatusText(step.status)}</span>
												</div>
											</div>
										</li>
									))}
								</ul>
							</div>

							<div className="details-section">
								<h3 className="section-subtitle">작업</h3>
								<div className="action-buttons">
									{selectedPlan.status === "planned" && (
										<button
											className="btn btn-primary"
											onClick={handleStartProduction}>
											생산 시작
										</button>
									)}
									{(selectedPlan.status === "in-progress" ||
										selectedPlan.status === "delayed") && (
										<button
											className="btn btn-primary"
											onClick={handleCompleteProduction}>
											생산 완료
										</button>
									)}
									{(selectedPlan.status === "planned" ||
										selectedPlan.status === "in-progress") && (
										<button
											className="btn btn-secondary"
											onClick={handleDelayProduction}>
											지연 표시
										</button>
									)}
									<button
										className="btn btn-secondary"
										onClick={() => alert("보고서 생성 기능이 실행되었습니다.")}>
										보고서 생성
									</button>
								</div>
							</div>
						</div>
					) : (
						<div className="production-details-section">
							<div className="no-data">
								생산 계획을 선택하여 상세 정보를 확인하세요.
							</div>
						</div>
					)}
				</div>
			)}

			{/* 대시보드 탭 */}
			{activeTab === "dashboard" && (
				<div className="dashboard-content">
					<div className="dashboard-cards">
						<div className="dashboard-card">
							<div className="card-title">총 생산 계획</div>
							<div className="card-value">{productionPlans.length}</div>
						</div>
						<div className="dashboard-card">
							<div className="card-title">진행 중인 계획</div>
							<div className="card-value">
								{
									productionPlans.filter(
										(plan) => plan.status === "in-progress"
									).length
								}
							</div>
						</div>
						<div className="dashboard-card">
							<div className="card-title">완료된 계획</div>
							<div className="card-value">
								{
									productionPlans.filter((plan) => plan.status === "completed")
										.length
								}
							</div>
						</div>
						<div className="dashboard-card">
							<div className="card-title">지연된 계획</div>
							<div className="card-value">
								{
									productionPlans.filter((plan) => plan.status === "delayed")
										.length
								}
							</div>
							<div className="card-trend trend-up">
								<span>↑ 2 (전월 대비)</span>
							</div>
						</div>
					</div>

					<div className="production-plan-section">
						<h2 className="section-title">생산 현황</h2>
						<div
							className="chart-placeholder"
							style={{
								height: "300px",
								background: "#f5f6fa",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								borderRadius: "8px",
							}}>
							<p>여기에 생산 현황 차트가 표시됩니다.</p>
						</div>
					</div>

					<div
						className="production-plan-section"
						style={{ marginTop: "20px" }}>
						<h2 className="section-title">자재 현황</h2>
						<div
							className="chart-placeholder"
							style={{
								height: "300px",
								background: "#f5f6fa",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								borderRadius: "8px",
							}}>
							<p>여기에 자재 현황 차트가 표시됩니다.</p>
						</div>
					</div>
				</div>
			)}

			{/* 일정 탭 */}
			{activeTab === "schedule" && (
				<div className="schedule-content">
					<div className="production-plan-section">
						<h2 className="section-title">생산 일정</h2>

						<div className="gantt-chart">
							<div className="gantt-time-markers">
								<div className="gantt-time-marker">10월 1일</div>
								<div className="gantt-time-marker">10월 5일</div>
								<div className="gantt-time-marker">10월 10일</div>
								<div className="gantt-time-marker">10월 15일</div>
								<div className="gantt-time-marker">10월 20일</div>
								<div className="gantt-time-marker">10월 25일</div>
								<div className="gantt-time-marker">10월 30일</div>
							</div>

							{productionPlans.map((plan) => {
								// 간트 차트 위치 계산 (실제 구현에서는 날짜 기반으로 계산)
								const startPercent = 10; // 예시 값
								const widthPercent = 30; // 예시 값

								return (
									<div
										key={plan.id}
										className="gantt-row">
										<div className="gantt-row-header">{plan.name}</div>
										<div className="gantt-timeline">
											<div
												className={`gantt-bar ${plan.status}`}
												style={{
													left: `${startPercent}%`,
													width: `${widthPercent}%`,
												}}></div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			)}

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
								{modalType === "create"
									? "새 생산 계획 생성"
									: "생산 계획 수정"}
							</h2>
							<button
								className="modal-close"
								onClick={closeModal}>
								&times;
							</button>
						</div>
						<div className="modal-body">
							{/* 여기에 생산 계획 생성/수정 폼 구현 */}
							<div className="filter-row">
								<div className="filter-group">
									<label className="filter-label">이름:</label>
									<input
										type="text"
										className="filter-input"
										placeholder="생산 계획 이름"
										defaultValue={
											modalType === "edit" && selectedPlan
												? selectedPlan.name
												: ""
										}
									/>
								</div>
								<div className="filter-group">
									<label className="filter-label">제품 코드:</label>
									<input
										type="text"
										className="filter-input"
										placeholder="제품 코드"
										defaultValue={
											modalType === "edit" && selectedPlan
												? selectedPlan.productCode
												: ""
										}
									/>
								</div>
							</div>

							<div className="filter-row">
								<div className="filter-group">
									<label className="filter-label">시작일:</label>
									<input
										type="date"
										className="filter-input"
										defaultValue={
											modalType === "edit" && selectedPlan
												? selectedPlan.startDate
												: ""
										}
									/>
								</div>
								<div className="filter-group">
									<label className="filter-label">종료일:</label>
									<input
										type="date"
										className="filter-input"
										defaultValue={
											modalType === "edit" && selectedPlan
												? selectedPlan.endDate
												: ""
										}
									/>
								</div>
							</div>

							<div className="filter-row">
								<div className="filter-group">
									<label className="filter-label">수량:</label>
									<input
										type="number"
										className="filter-input"
										placeholder="0"
										defaultValue={
											modalType === "edit" && selectedPlan
												? selectedPlan.quantity
												: ""
										}
									/>
								</div>
								<div className="filter-group">
									<label className="filter-label">우선순위:</label>
									<select
										className="filter-select"
										defaultValue={
											modalType === "edit" && selectedPlan
												? selectedPlan.priority
												: "중간"
										}>
										<option value="높음">높음</option>
										<option value="중간">중간</option>
										<option value="낮음">낮음</option>
									</select>
								</div>
							</div>

							<div className="filter-row">
								<div className="filter-group">
									<label className="filter-label">담당자:</label>
									<select
										className="filter-select"
										defaultValue={
											modalType === "edit" && selectedPlan
												? selectedPlan.assignedTo
												: "생산팀 A"
										}>
										<option value="생산팀 A">생산팀 A</option>
										<option value="생산팀 B">생산팀 B</option>
										<option value="생산팀 C">생산팀 C</option>
									</select>
								</div>
								<div className="filter-group">
									<label className="filter-label">위치:</label>
									<select
										className="filter-select"
										defaultValue={
											modalType === "edit" && selectedPlan
												? selectedPlan.location
												: "공장 1"
										}>
										<option value="공장 1">공장 1</option>
										<option value="공장 2">공장 2</option>
										<option value="공장 3">공장 3</option>
									</select>
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
										}}
										defaultValue={
											modalType === "edit" && selectedPlan
												? selectedPlan.notes
												: ""
										}></textarea>
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
										handleCreatePlan({
											name: "새 생산 계획",
											productCode: "NEW-001",
											quantity: 1000,
											priority: "중간",
											assignedTo: "생산팀 A",
											location: "공장 1",
											notes: "",
										});
									} else {
										// 실제 구현에서는 폼 데이터를 수집하여 전달
										handleEditPlan({
											...selectedPlan,
											name: "수정된 생산 계획",
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

export default ProductionManagement;

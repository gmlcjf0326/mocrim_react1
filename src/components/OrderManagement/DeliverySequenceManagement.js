import React, { useState, useEffect } from "react";
import {
	Table,
	Card,
	Typography,
	Button,
	Space,
	Input,
	Select,
	DatePicker,
	Tag,
	Modal,
	Form,
	InputNumber,
	Row,
	Col,
	Divider,
	Tooltip,
	Badge,
	List,
	Avatar,
	Drawer,
	Tabs,
	message,
} from "antd";
import {
	SearchOutlined,
	ReloadOutlined,
	CarOutlined,
	EnvironmentOutlined,
	PhoneOutlined,
	UserOutlined,
	ShoppingOutlined,
	SortAscendingOutlined,
	SortDescendingOutlined,
	SwapOutlined,
	CheckCircleOutlined,
	ClockCircleOutlined,
	SendOutlined,
} from "@ant-design/icons";
import { useNotification } from "../../contexts/NotificationContext";
import "./DeliverySequenceManagement.css";

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

/**
 * 배송 순번 관리 컴포넌트
 * 배송 기사들의 효율적인 배송을 위한 순번 관리 페이지
 */
const DeliverySequenceManagement = () => {
	// 상태 관리
	const [loading, setLoading] = useState(true);
	const [deliveries, setDeliveries] = useState([]);
	const [filteredDeliveries, setFilteredDeliveries] = useState([]);
	const [searchText, setSearchText] = useState("");
	const [filterStatus, setFilterStatus] = useState("all");
	const [dateRange, setDateRange] = useState(null);
	const [sequenceModalVisible, setSequenceModalVisible] = useState(false);
	const [selectedDelivery, setSelectedDelivery] = useState(null);
	const [newSequence, setNewSequence] = useState(1);
	const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
	const [sortOrder, setSortOrder] = useState("asc");
	const [smsModalVisible, setSmsModalVisible] = useState(false);
	const [smsForm] = Form.useForm();

	const { showNotification } = useNotification();

	// 초기 데이터 로드
	useEffect(() => {
		fetchDeliveries();
	}, []);

	// ... existing code ...
	// 필터링 적용
	useEffect(() => {
		applyFilters();
	}, [deliveries, searchText, filterStatus, dateRange, sortOrder]);

	// 배송 데이터 로드 함수
	const fetchDeliveries = async () => {
		setLoading(true);
		try {
			// 실제 구현에서는 API 호출로 대체
			const mockDeliveries = [
				{
					id: "DEL-20231105-001",
					orderId: "ORD-20231105-005",
					sequence: 3,
					customerName: "인천디자인",
					address: "인천시 남동구 구월동 234",
					contact: "032-678-9012",
					manager: "정미영",
					deliveryMethod: "택배",
					courier: "한진택배",
					trackingNumber: "123456789012",
					estimatedDelivery: "2023-11-07",
					status: "배송중",
					startedAt: "2023-11-05 14:30:27",
					items: [
						{
							productName: "PB E1 15mm",
							quantity: 18,
						},
						{
							productName: "MDF E0 15mm",
							quantity: 7,
						},
					],
				},
				{
					id: "DEL-20231104-002",
					orderId: "ORD-20231104-004",
					sequence: 1,
					customerName: "부산가구",
					address: "부산시 해운대구 우동 101",
					contact: "051-567-8901",
					manager: "최동욱",
					deliveryMethod: "택배",
					courier: "CJ대한통운",
					trackingNumber: "987654321098",
					estimatedDelivery: "2023-11-06",
					status: "배송완료",
					startedAt: "2023-11-04 17:15:33",
					completedAt: "2023-11-05 10:45:22",
					items: [
						{
							productName: "PB E0 15mm",
							quantity: 10,
						},
						{
							productName: "PB E0 18mm",
							quantity: 9,
						},
					],
				},
				{
					id: "DEL-20231103-003",
					orderId: "ORD-20231103-003",
					sequence: 2,
					customerName: "서울인테리어",
					address: "서울시 강남구 역삼동 789",
					contact: "02-456-7890",
					manager: "이지훈",
					deliveryMethod: "택배",
					courier: "롯데택배",
					trackingNumber: "456789123456",
					estimatedDelivery: "2023-11-06",
					status: "배송준비",
					items: [
						{
							productName: "MDF E1 18mm",
							quantity: 12,
						},
						{
							productName: "MDF E0 18mm",
							quantity: 8,
						},
					],
				},
				{
					id: "DEL-20231102-004",
					orderId: "ORD-20231102-002",
					sequence: 4,
					customerName: "광주목공소",
					address: "광주시 서구 치평동 456",
					contact: "062-345-6789",
					manager: "박영희",
					deliveryMethod: "직접수령",
					estimatedDelivery: "2023-11-07",
					status: "수령대기",
					items: [
						{
							productName: "PB E1 18mm",
							quantity: 15,
						},
						{
							productName: "MDF E0 15mm",
							quantity: 6,
						},
					],
				},
			];

			setDeliveries(mockDeliveries);
		} catch (error) {
			console.error("Error fetching deliveries:", error);
			showNotification({
				title: "데이터 로드 오류",
				message: "배송 데이터를 불러오는 중 오류가 발생했습니다.",
				type: "error",
			});
		} finally {
			setLoading(false);
		}
	};

	// 필터 적용 함수
	const applyFilters = () => {
		let filtered = [...deliveries];

		// 검색어 필터링
		if (searchText) {
			filtered = filtered.filter(
				(delivery) =>
					delivery.customerName
						.toLowerCase()
						.includes(searchText.toLowerCase()) ||
					delivery.address.toLowerCase().includes(searchText.toLowerCase()) ||
					delivery.orderId.toLowerCase().includes(searchText.toLowerCase())
			);
		}

		// 상태 필터링
		if (filterStatus !== "all") {
			filtered = filtered.filter(
				(delivery) => delivery.status === filterStatus
			);
		}

		// 날짜 범위 필터링
		if (dateRange) {
			const [start, end] = dateRange;
			filtered = filtered.filter((delivery) => {
				const deliveryDate = new Date(delivery.estimatedDelivery);
				return deliveryDate >= start && deliveryDate <= end;
			});
		}

		// 순번 정렬
		filtered.sort((a, b) => {
			if (sortOrder === "asc") {
				return a.sequence - b.sequence;
			} else {
				return b.sequence - a.sequence;
			}
		});

		setFilteredDeliveries(filtered);
	};

	// 순번 변경 모달 표시
	const showSequenceModal = (delivery) => {
		setSelectedDelivery(delivery);
		setNewSequence(delivery.sequence);
		setSequenceModalVisible(true);
	};

	// 순번 변경 처리
	const handleSequenceChange = () => {
		if (!selectedDelivery || !newSequence) return;

		const updatedDeliveries = deliveries.map((delivery) => {
			if (delivery.id === selectedDelivery.id) {
				return { ...delivery, sequence: newSequence };
			}
			return delivery;
		});

		setDeliveries(updatedDeliveries);
		setSequenceModalVisible(false);

		showNotification({
			title: "순번 변경 완료",
			message: `배송 ID ${selectedDelivery.id}의 순번이 ${newSequence}(으)로 변경되었습니다.`,
			type: "success",
		});
	};

	// 배송 상태 변경 처리
	const handleStatusChange = (deliveryId, newStatus) => {
		const updatedDeliveries = deliveries.map((delivery) => {
			if (delivery.id === deliveryId) {
				const updated = { ...delivery, status: newStatus };

				// 배송 완료 시 완료 시간 추가
				if (newStatus === "배송완료") {
					updated.completedAt = new Date().toLocaleString();
				}

				return updated;
			}
			return delivery;
		});

		setDeliveries(updatedDeliveries);

		showNotification({
			title: "상태 변경 완료",
			message: `배송 상태가 ${newStatus}(으)로 변경되었습니다.`,
			type: "success",
		});
	};

	// 배송 상세 정보 표시
	const showDeliveryDetail = (delivery) => {
		setSelectedDelivery(delivery);
		setDetailDrawerVisible(true);
	};

	// SMS 발송 모달 표시
	const showSmsModal = (delivery) => {
		setSelectedDelivery(delivery);
		setSmsModalVisible(true);

		// 기본 SMS 내용 설정
		smsForm.setFieldsValue({
			phoneNumber: delivery.contact,
			message: `[목림상사] ${delivery.customerName}님의 주문(${delivery.orderId})이 배송 예정입니다. 예상 배송일: ${delivery.estimatedDelivery}`,
		});
	};

	// SMS 발송 처리
	const handleSmsSend = () => {
		smsForm.validateFields().then((values) => {
			// 실제 구현에서는 SMS 발송 API 호출
			console.log("SMS 발송:", values);

			setSmsModalVisible(false);

			showNotification({
				title: "SMS 발송 완료",
				message: `${selectedDelivery.customerName}님에게 SMS가 발송되었습니다.`,
				type: "success",
			});
		});
	};

	// 정렬 순서 변경
	const toggleSortOrder = () => {
		setSortOrder(sortOrder === "asc" ? "desc" : "asc");
	};

	// 테이블 컬럼 정의
	const columns = [
		{
			title: "순번",
			dataIndex: "sequence",
			key: "sequence",
			sorter: (a, b) => a.sequence - b.sequence,
			render: (sequence) => (
				<Badge
					count={sequence}
					style={{
						backgroundColor: "#1890ff",
						fontSize: "14px",
						padding: "0 8px",
					}}
				/>
			),
		},
		{
			title: "주문번호",
			dataIndex: "orderId",
			key: "orderId",
		},
		{
			title: "고객명",
			dataIndex: "customerName",
			key: "customerName",
			render: (text, record) => (
				<Button
					type="link"
					onClick={() => showDeliveryDetail(record)}>
					{text}
				</Button>
			),
		},
		{
			title: "주소",
			dataIndex: "address",
			key: "address",
			ellipsis: true,
		},
		{
			title: "연락처",
			dataIndex: "contact",
			key: "contact",
		},
		{
			title: "배송방법",
			dataIndex: "deliveryMethod",
			key: "deliveryMethod",
			filters: [
				{ text: "택배", value: "택배" },
				{ text: "직접수령", value: "직접수령" },
			],
			onFilter: (value, record) => record.deliveryMethod === value,
		},
		{
			title: "예상 배송일",
			dataIndex: "estimatedDelivery",
			key: "estimatedDelivery",
			sorter: (a, b) =>
				new Date(a.estimatedDelivery) - new Date(b.estimatedDelivery),
		},
		{
			title: "상태",
			dataIndex: "status",
			key: "status",
			render: (status) => {
				let color;
				switch (status) {
					case "배송준비":
						color = "default";
						break;
					case "배송중":
						color = "processing";
						break;
					case "배송완료":
						color = "success";
						break;
					case "수령대기":
						color = "warning";
						break;
					default:
						color = "default";
				}
				return <Tag color={color}>{status}</Tag>;
			},
			filters: [
				{ text: "배송준비", value: "배송준비" },
				{ text: "배송중", value: "배송중" },
				{ text: "배송완료", value: "배송완료" },
				{ text: "수령대기", value: "수령대기" },
			],
			onFilter: (value, record) => record.status === value,
		},
		{
			title: "작업",
			key: "action",
			render: (_, record) => (
				<Space size="small">
					<Tooltip title="순번 변경">
						<Button
							type="text"
							icon={<SwapOutlined />}
							onClick={() => showSequenceModal(record)}
						/>
					</Tooltip>

					{record.status === "배송준비" && (
						<Tooltip title="배송 시작">
							<Button
								type="text"
								icon={<CarOutlined />}
								onClick={() => handleStatusChange(record.id, "배송중")}
							/>
						</Tooltip>
					)}

					{record.status === "배송중" && (
						<Tooltip title="배송 완료">
							<Button
								type="text"
								icon={<CheckCircleOutlined />}
								onClick={() => handleStatusChange(record.id, "배송완료")}
							/>
						</Tooltip>
					)}

					{record.status !== "배송완료" && (
						<Tooltip title="SMS 발송">
							<Button
								type="text"
								icon={<SendOutlined />}
								onClick={() => showSmsModal(record)}
							/>
						</Tooltip>
					)}
				</Space>
			),
		},
	];

	return (
		<div className="delivery-sequence-management">
			<Title level={2}>배송 순번 관리</Title>
			<Divider />

			<Card>
				<div className="delivery-toolbar">
					<Space>
						<Button
							icon={<ReloadOutlined />}
							onClick={fetchDeliveries}>
							새로고침
						</Button>

						<Button
							icon={
								sortOrder === "asc" ? (
									<SortAscendingOutlined />
								) : (
									<SortDescendingOutlined />
								)
							}
							onClick={toggleSortOrder}>
							{sortOrder === "asc" ? "오름차순" : "내림차순"}
						</Button>
					</Space>

					<Space>
						<Input
							placeholder="고객명/주소/주문번호 검색"
							prefix={<SearchOutlined />}
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							style={{ width: 250 }}
						/>

						<Select
							placeholder="배송상태"
							value={filterStatus}
							onChange={setFilterStatus}
							style={{ width: 120 }}>
							<Option value="all">전체 상태</Option>
							<Option value="배송준비">배송준비</Option>
							<Option value="배송중">배송중</Option>
							<Option value="배송완료">배송완료</Option>
							<Option value="수령대기">수령대기</Option>
						</Select>

						<RangePicker
							onChange={(dates) => setDateRange(dates)}
							placeholder={["시작일", "종료일"]}
						/>
					</Space>
				</div>

				<Table
					columns={columns}
					dataSource={filteredDeliveries}
					rowKey="id"
					loading={loading}
					pagination={{ pageSize: 10 }}
				/>
			</Card>

			{/* 순번 변경 모달 */}
			<Modal
				title="배송 순번 변경"
				visible={sequenceModalVisible}
				onOk={handleSequenceChange}
				onCancel={() => setSequenceModalVisible(false)}>
				<Form layout="vertical">
					<Form.Item label="배송 ID">
						<Input
							value={selectedDelivery?.id}
							disabled
						/>
					</Form.Item>
					// ... existing code ...
					<Form.Item label="고객명">
						<Input
							value={selectedDelivery?.customerName}
							disabled
						/>
					</Form.Item>
					<Form.Item label="현재 순번">
						<Input
							value={selectedDelivery?.sequence}
							disabled
						/>
					</Form.Item>
					<Form.Item label="변경할 순번">
						<InputNumber
							min={1}
							value={newSequence}
							onChange={setNewSequence}
							style={{ width: "100%" }}
						/>
					</Form.Item>
				</Form>
			</Modal>

			{/* 배송 상세 정보 서랍 */}
			<Drawer
				title="배송 상세 정보"
				placement="right"
				width={600}
				onClose={() => setDetailDrawerVisible(false)}
				visible={detailDrawerVisible}>
				{selectedDelivery && (
					<div className="delivery-detail">
						<div className="delivery-header">
							<Row gutter={24}>
								<Col span={12}>
									<Title level={4}>배송 ID: {selectedDelivery.id}</Title>
									<Text>주문번호: {selectedDelivery.orderId}</Text>
									<br />
									<Text>
										배송순번:{" "}
										<Badge
											count={selectedDelivery.sequence}
											style={{ backgroundColor: "#1890ff" }}
										/>
									</Text>
								</Col>
								<Col span={12}>
									<div className="delivery-status">
										<Text strong>배송상태: </Text>
										<Tag
											color={
												selectedDelivery.status === "배송준비"
													? "default"
													: selectedDelivery.status === "배송중"
													? "processing"
													: selectedDelivery.status === "배송완료"
													? "success"
													: selectedDelivery.status === "수령대기"
													? "warning"
													: "default"
											}>
											{selectedDelivery.status}
										</Tag>
									</div>
									<div className="delivery-method">
										<Text strong>배송방법: </Text>
										<Text>{selectedDelivery.deliveryMethod}</Text>
									</div>
								</Col>
							</Row>
						</div>

						<Divider />

						<div className="customer-info">
							<Title level={5}>
								<UserOutlined /> 고객 정보
							</Title>
							<Row gutter={24}>
								<Col span={12}>
									<Text strong>고객명: </Text>
									<Text>{selectedDelivery.customerName}</Text>
								</Col>
								<Col span={12}>
									<Text strong>담당자: </Text>
									<Text>{selectedDelivery.manager}</Text>
								</Col>
							</Row>
							<Row
								gutter={24}
								style={{ marginTop: 8 }}>
								<Col span={24}>
									<Text strong>
										<EnvironmentOutlined /> 주소:
									</Text>
									<Text> {selectedDelivery.address}</Text>
								</Col>
							</Row>
							<Row
								gutter={24}
								style={{ marginTop: 8 }}>
								<Col span={24}>
									<Text strong>
										<PhoneOutlined /> 연락처:
									</Text>
									<Text> {selectedDelivery.contact}</Text>
								</Col>
							</Row>
						</div>

						<Divider />

						<div className="delivery-items">
							<Title level={5}>
								<ShoppingOutlined /> 배송 제품
							</Title>
							<List
								dataSource={selectedDelivery.items}
								renderItem={(item) => (
									<List.Item>
										<List.Item.Meta
											title={item.productName}
											description={`수량: ${item.quantity}개`}
										/>
									</List.Item>
								)}
							/>
						</div>

						<Divider />

						<div className="delivery-courier-info">
							<Title level={5}>
								<CarOutlined /> 배송 정보
							</Title>
							{selectedDelivery.deliveryMethod === "택배" ? (
								<>
									<Row gutter={24}>
										<Col span={12}>
											<Text strong>택배사: </Text>
											<Text>{selectedDelivery.courier}</Text>
										</Col>
										<Col span={12}>
											<Text strong>운송장번호: </Text>
											<Text>{selectedDelivery.trackingNumber}</Text>
										</Col>
									</Row>
									<Row
										gutter={24}
										style={{ marginTop: 8 }}>
										<Col span={12}>
											<Text strong>예상 배송일: </Text>
											<Text>{selectedDelivery.estimatedDelivery}</Text>
										</Col>
									</Row>
								</>
							) : (
								<Row gutter={24}>
									<Col span={24}>
										<Text strong>수령 예정일: </Text>
										<Text>{selectedDelivery.estimatedDelivery}</Text>
									</Col>
								</Row>
							)}

							{selectedDelivery.startedAt && (
								<Row
									gutter={24}
									style={{ marginTop: 8 }}>
									<Col span={24}>
										<Text strong>배송 시작 시간: </Text>
										<Text>{selectedDelivery.startedAt}</Text>
									</Col>
								</Row>
							)}

							{selectedDelivery.completedAt && (
								<Row
									gutter={24}
									style={{ marginTop: 8 }}>
									<Col span={24}>
										<Text strong>배송 완료 시간: </Text>
										<Text>{selectedDelivery.completedAt}</Text>
									</Col>
								</Row>
							)}
						</div>

						<Divider />

						<div className="delivery-actions">
							<Space>
								{selectedDelivery.status === "배송준비" && (
									<Button
										type="primary"
										icon={<CarOutlined />}
										onClick={() =>
											handleStatusChange(selectedDelivery.id, "배송중")
										}>
										배송 시작
									</Button>
								)}

								{selectedDelivery.status === "배송중" && (
									<Button
										type="primary"
										icon={<CheckCircleOutlined />}
										onClick={() =>
											handleStatusChange(selectedDelivery.id, "배송완료")
										}>
										배송 완료
									</Button>
								)}

								<Button
									icon={<SwapOutlined />}
									onClick={() => showSequenceModal(selectedDelivery)}>
									순번 변경
								</Button>

								{selectedDelivery.status !== "배송완료" && (
									<Button
										icon={<SendOutlined />}
										onClick={() => showSmsModal(selectedDelivery)}>
										SMS 발송
									</Button>
								)}
							</Space>
						</div>
					</div>
				)}
			</Drawer>

			{/* SMS 발송 모달 */}
			<Modal
				title="SMS 발송"
				visible={smsModalVisible}
				onOk={handleSmsSend}
				onCancel={() => setSmsModalVisible(false)}>
				<Form
					form={smsForm}
					layout="vertical">
					<Form.Item
						name="phoneNumber"
						label="수신자 연락처"
						rules={[{ required: true, message: "연락처를 입력해주세요" }]}>
						<Input />
					</Form.Item>
					<Form.Item
						name="message"
						label="메시지 내용"
						rules={[{ required: true, message: "메시지 내용을 입력해주세요" }]}>
						<Input.TextArea
							rows={4}
							maxLength={90}
							showCount
						/>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default DeliverySequenceManagement;

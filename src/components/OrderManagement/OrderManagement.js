import React, { useState, useEffect, useRef } from "react";
import {
	Table,
	Button,
	Card,
	Space,
	Tag,
	Modal,
	Typography,
	Dropdown,
	Menu,
	Input,
	InputNumber,
	Select,
	DatePicker,
	Row,
	Col,
	Tabs,
	Tooltip,
	Badge,
	Drawer,
	List,
	Divider,
	Spin,
	Form,
	message,
} from "antd";
import {
	PrinterOutlined,
	DownOutlined,
	SearchOutlined,
	FilterOutlined,
	ReloadOutlined,
	QrcodeOutlined,
	HistoryOutlined,
	CheckCircleOutlined,
	CloseCircleOutlined,
	ExclamationCircleOutlined,
	ScanOutlined,
	CarOutlined,
	ShoppingOutlined,
	UserOutlined,
	HomeOutlined,
	PhoneOutlined,
	EnvironmentOutlined,
} from "@ant-design/icons";
import { Html5Qrcode } from "html5-qrcode";
import { useNotification } from "../../contexts/NotificationContext";
import "./OrderManagement.css";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

/**
 * 주문 관리 컴포넌트
 * 2층, 4층에서 발주한 주문을 관리하는 페이지
 */
const OrderManagement = () => {
	// 상태 관리
	const [loading, setLoading] = useState(true);
	const [orders, setOrders] = useState([]);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [searchText, setSearchText] = useState("");
	const [filterStatus, setFilterStatus] = useState("all");
	const [filterFloor, setFilterFloor] = useState("all");
	const [dateRange, setDateRange] = useState(null);
	const [qrScannerVisible, setQrScannerVisible] = useState(false);
	const [qrScanResult, setQrScanResult] = useState(null);
	const [materialSummaryVisible, setMaterialSummaryVisible] = useState(false);
	const [materialSummary, setMaterialSummary] = useState([]);
	const [orderDetailVisible, setOrderDetailVisible] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [statusUpdateModalVisible, setStatusUpdateModalVisible] =
		useState(false);
	const [newStatus, setNewStatus] = useState("");
	const [deliveryInfoModalVisible, setDeliveryInfoModalVisible] =
		useState(false);
	const [deliveryForm] = Form.useForm();

	const { showNotification } = useNotification();
	const qrReaderRef = useRef(null);
	const [qrScannerId] = useState("qr-reader");

	// 초기 데이터 로드
	useEffect(() => {
		fetchOrders();
	}, []);

	// 주문 데이터 로드 함수
	const fetchOrders = async () => {
		setLoading(true);
		try {
			// 실제 구현에서는 API 호출로 대체
			const mockOrders = [
				{
					id: "ORD-20231101-001",
					orderDate: "2023-11-01 09:15:32",
					customerName: "대전가구",
					floor: 2,
					deliveryMethod: "택배",
					totalAmount: 350000,
					status: "대기",
					materialLocation: "A-3, B-2",
					items: [
						{
							id: 1,
							productName: "PB E1 15mm",
							productCode: "PB-E1-15",
							supplierName: "우드에스티",
							price: 15000,
							quantity: 10,
							location: "A-3",
						},
						{
							id: 2,
							productName: "MDF E1 15mm",
							productCode: "MDF-E1-15",
							supplierName: "한솔목재",
							price: 22000,
							quantity: 8,
							location: "B-2",
						},
					],
					customer: {
						name: "대전가구",
						address: "대전시 서구 둔산동 123",
						contact: "042-123-4567",
						manager: "김철수",
					},
				},
				{
					id: "ORD-20231102-002",
					orderDate: "2023-11-02 14:22:45",
					customerName: "광주목공소",
					floor: 4,
					deliveryMethod: "직접수령",
					totalAmount: 480000,
					status: "접수",
					materialLocation: "A-4, C-1",
					items: [
						{
							id: 3,
							productName: "PB E1 18mm",
							productCode: "PB-E1-18",
							supplierName: "우드에스티",
							price: 18000,
							quantity: 15,
							location: "A-4",
						},
						{
							id: 4,
							productName: "MDF E0 15mm",
							productCode: "MDF-E0-15",
							supplierName: "동화목재",
							price: 28000,
							quantity: 6,
							location: "C-1",
						},
					],
					customer: {
						name: "광주목공소",
						address: "광주시 서구 치평동 456",
						contact: "062-345-6789",
						manager: "박영희",
					},
				},
				{
					id: "ORD-20231103-003",
					orderDate: "2023-11-03 10:05:18",
					customerName: "서울인테리어",
					floor: 2,
					deliveryMethod: "택배",
					totalAmount: 620000,
					status: "자재수급중",
					materialLocation: "B-3, C-2",
					items: [
						{
							id: 5,
							productName: "MDF E1 18mm",
							productCode: "MDF-E1-18",
							supplierName: "한솔목재",
							price: 25000,
							quantity: 12,
							location: "B-3",
						},
						{
							id: 6,
							productName: "MDF E0 18mm",
							productCode: "MDF-E0-18",
							supplierName: "동화목재",
							price: 32000,
							quantity: 8,
							location: "C-2",
						},
					],
					customer: {
						name: "서울인테리어",
						address: "서울시 강남구 역삼동 789",
						contact: "02-456-7890",
						manager: "이지훈",
					},
				},
				{
					id: "ORD-20231104-004",
					orderDate: "2023-11-04 16:45:33",
					customerName: "부산가구",
					floor: 4,
					deliveryMethod: "택배",
					totalAmount: 410000,
					status: "자재수집완료",
					materialLocation: "A-7, A-8",
					items: [
						{
							id: 7,
							productName: "PB E0 15mm",
							productCode: "PB-E0-15",
							supplierName: "대림목재",
							price: 20000,
							quantity: 10,
							location: "A-7",
						},
						{
							id: 8,
							productName: "PB E0 18mm",
							productCode: "PB-E0-18",
							supplierName: "대림목재",
							price: 23000,
							quantity: 9,
							location: "A-8",
						},
					],
					customer: {
						name: "부산가구",
						address: "부산시 해운대구 우동 101",
						contact: "051-567-8901",
						manager: "최동욱",
					},
				},
				{
					id: "ORD-20231105-005",
					orderDate: "2023-11-05 11:30:27",
					customerName: "인천디자인",
					floor: 2,
					deliveryMethod: "직접수령",
					totalAmount: 530000,
					status: "배송시작",
					materialLocation: "A-3, C-1",
					items: [
						{
							id: 9,
							productName: "PB E1 15mm",
							productCode: "PB-E1-15",
							supplierName: "우드에스티",
							price: 15000,
							quantity: 18,
							location: "A-3",
						},
						{
							id: 10,
							productName: "MDF E0 15mm",
							productCode: "MDF-E0-15",
							supplierName: "동화목재",
							price: 28000,
							quantity: 7,
							location: "C-1",
						},
					],
					customer: {
						name: "인천디자인",
						address: "인천시 남동구 구월동 234",
						contact: "032-678-9012",
						manager: "정미영",
					},
					deliveryInfo: {
						sequence: 3,
						courier: "한진택배",
						trackingNumber: "123456789012",
						estimatedDelivery: "2023-11-07",
					},
				},
				{
					id: "ORD-20231106-006",
					orderDate: "2023-11-06 09:10:42",
					customerName: "대전가구",
					floor: 4,
					deliveryMethod: "택배",
					totalAmount: 390000,
					status: "배송완료",
					materialLocation: "B-2, B-3",
					items: [
						{
							id: 11,
							productName: "MDF E1 15mm",
							productCode: "MDF-E1-15",
							supplierName: "한솔목재",
							price: 22000,
							quantity: 9,
							location: "B-2",
						},
						{
							id: 12,
							productName: "MDF E1 18mm",
							productCode: "MDF-E1-18",
							supplierName: "한솔목재",
							price: 25000,
							quantity: 6,
							location: "B-3",
						},
					],
					customer: {
						name: "대전가구",
						address: "대전시 서구 둔산동 123",
						contact: "042-123-4567",
						manager: "김철수",
					},
					deliveryInfo: {
						sequence: 1,
						courier: "CJ대한통운",
						trackingNumber: "987654321098",
						estimatedDelivery: "2023-11-08",
						deliveredAt: "2023-11-08 14:25:33",
					},
				},
			];

			setOrders(mockOrders);
		} catch (error) {
			console.error("Error fetching orders:", error);
			showNotification({
				title: "데이터 로드 오류",
				message: "주문 데이터를 불러오는 중 오류가 발생했습니다.",
				type: "error",
			});
		} finally {
			setLoading(false);
		}
	};

	// 필터링된 주문 목록 가져오기
	const getFilteredOrders = () => {
		let filtered = [...orders];

		// 검색어 필터링
		if (searchText) {
			filtered = filtered.filter(
				(order) =>
					order.id.toLowerCase().includes(searchText.toLowerCase()) ||
					order.customerName.toLowerCase().includes(searchText.toLowerCase())
			);
		}

		// 상태 필터링
		if (filterStatus !== "all") {
			filtered = filtered.filter((order) => order.status === filterStatus);
		}

		// 층 필터링
		if (filterFloor !== "all") {
			filtered = filtered.filter(
				(order) => order.floor === parseInt(filterFloor)
			);
		}

		// 날짜 범위 필터링
		if (dateRange) {
			const [start, end] = dateRange;
			filtered = filtered.filter((order) => {
				const orderDate = new Date(order.orderDate);
				return orderDate >= start && orderDate <= end;
			});
		}

		return filtered;
	};

	// 선택된 주문 인쇄 처리
	const handlePrintSelected = () => {
		if (selectedRowKeys.length === 0) {
			showNotification({
				title: "선택 오류",
				message: "인쇄할 주문을 선택해주세요.",
				type: "warning",
			});
			return;
		}

		// 선택된 주문 상태 업데이트
		const updatedOrders = orders.map((order) => {
			if (selectedRowKeys.includes(order.id) && order.status === "대기") {
				return { ...order, status: "접수" };
			}
			return order;
		});

		setOrders(updatedOrders);
		showNotification({
			title: "인쇄 완료",
			message: `${selectedRowKeys.length}개의 주문이 인쇄되었습니다.`,
			type: "success",
		});

		// 인쇄 창 열기 (실제 구현에서는 인쇄 API 호출)
		window.print();

		// 선택 초기화
		setSelectedRowKeys([]);
	};

	// QR 스캔 처리
	const handleQrScan = (data) => {
		if (data) {
			try {
				const parsedData = JSON.parse(data);
				setQrScanResult(parsedData);

				// 자재 요약 정보 생성
				if (parsedData.items && parsedData.items.length > 0) {
					// 자재 위치별로 그룹화
					const materialsByLocation = {};

					parsedData.items.forEach((item) => {
						if (!materialsByLocation[item.location]) {
							materialsByLocation[item.location] = [];
						}
						materialsByLocation[item.location].push(item);
					});

					// 자재 요약 정보 생성
					const summary = Object.keys(materialsByLocation).map((location) => ({
						location,
						items: materialsByLocation[location],
						totalItems: materialsByLocation[location].length,
					}));

					setMaterialSummary(summary);
					setMaterialSummaryVisible(true);
				}

				// QR 스캔 성공 시 주문 상태 업데이트
				updateOrderStatus(parsedData.orderId, "자재수급중");

				showNotification({
					title: "QR 스캔 성공",
					message: `주문번호 ${parsedData.orderId}의 QR 코드가 스캔되었습니다.`,
					type: "success",
				});
			} catch (error) {
				console.error("Error parsing QR data:", error);
				showNotification({
					title: "QR 스캔 오류",
					message: "QR 코드 데이터를 처리하는 중 오류가 발생했습니다.",
					type: "error",
				});
			}
		}
	};

	// QR 스캔 오류 처리
	const handleQrError = (err) => {
		console.error("QR Scanner Error:", err);
		showNotification({
			title: "QR 스캔 오류",
			message: "QR 코드를 스캔하는 중 오류가 발생했습니다.",
			type: "error",
		});
	};

	// QR 스캔 시작 함수
	const startQrScanner = () => {
		const html5QrCode = new Html5Qrcode(qrScannerId);
		const config = { fps: 10, qrbox: 250 };

		html5QrCode
			.start(
				{ facingMode: "environment" },
				config,
				(decodedText) => {
					// QR 코드 스캔 성공 시 처리
					handleQrScan(decodedText);
					html5QrCode.stop();
				},
				(error) => {
					// 오류 무시 (지속적인 스캔을 위해)
				}
			)
			.catch((err) => {
				handleQrError(err);
			});

		// 스캐너 인스턴스 저장
		qrReaderRef.current = html5QrCode;
	};

	// QR 스캔 중지 함수
	const stopQrScanner = () => {
		if (qrReaderRef.current) {
			qrReaderRef.current.stop().catch((err) => console.error(err));
		}
	};

	// 자재 위치 QR 스캔 처리 (자재 수집 완료 처리)
	const handleMaterialLocationScan = (location) => {
		if (!qrScanResult || !qrScanResult.orderId) {
			showNotification({
				title: "처리 오류",
				message: "먼저 주문 QR 코드를 스캔해주세요.",
				type: "warning",
			});
			return;
		}

		// 해당 위치의 자재 수집 완료 처리
		const updatedSummary = materialSummary.map((item) => {
			if (item.location === location) {
				return { ...item, collected: true };
			}
			return item;
		});

		setMaterialSummary(updatedSummary);

		// 모든 자재가 수집되었는지 확인
		const allCollected = updatedSummary.every((item) => item.collected);

		if (allCollected) {
			// 모든 자재 수집 완료 시 주문 상태 업데이트
			updateOrderStatus(qrScanResult.orderId, "자재수집완료");

			showNotification({
				title: "자재 수집 완료",
				message: `주문번호 ${qrScanResult.orderId}의 모든 자재 수집이 완료되었습니다.`,
				type: "success",
			});
		} else {
			showNotification({
				title: "자재 수집 진행 중",
				message: `위치 ${location}의 자재 수집이 완료되었습니다.`,
				type: "info",
			});
		}
	};

	// 주문 상태 업데이트
	const updateOrderStatus = (orderId, status) => {
		const updatedOrders = orders.map((order) => {
			if (order.id === orderId) {
				return { ...order, status };
			}
			return order;
		});

		setOrders(updatedOrders);
	};

	// 주문 상세 정보 표시
	const showOrderDetail = (order) => {
		setSelectedOrder(order);
		setOrderDetailVisible(true);
	};

	// 상태 변경 모달 표시
	const showStatusUpdateModal = (order) => {
		setSelectedOrder(order);
		setNewStatus(order.status);
		setStatusUpdateModalVisible(true);
	};

	// 상태 변경 처리
	const handleStatusUpdate = () => {
		if (!selectedOrder || !newStatus) return;

		updateOrderStatus(selectedOrder.id, newStatus);

		setStatusUpdateModalVisible(false);
		showNotification({
			title: "상태 변경 완료",
			message: `주문번호 ${selectedOrder.id}의 상태가 ${newStatus}(으)로 변경되었습니다.`,
			type: "success",
		});
	};

	// 배송 정보 입력 모달 표시
	const showDeliveryInfoModal = (order) => {
		setSelectedOrder(order);
		setDeliveryInfoModalVisible(true);

		if (order.deliveryInfo) {
			deliveryForm.setFieldsValue({
				sequence: order.deliveryInfo.sequence,
				courier: order.deliveryInfo.courier,
				trackingNumber: order.deliveryInfo.trackingNumber,
				estimatedDelivery: order.deliveryInfo.estimatedDelivery,
			});
		} else {
			deliveryForm.resetFields();
		}
	};

	// 배송 정보 저장 처리
	const handleDeliveryInfoSave = () => {
		deliveryForm.validateFields().then((values) => {
			const updatedOrders = orders.map((order) => {
				if (order.id === selectedOrder.id) {
					return {
						...order,
						status: "배송시작",
						deliveryInfo: {
							...values,
							startedAt: new Date().toISOString(),
						},
					};
				}
				return order;
			});

			setOrders(updatedOrders);
			setDeliveryInfoModalVisible(false);

			showNotification({
				title: "배송 시작",
				message: `주문번호 ${selectedOrder.id}의 배송이 시작되었습니다.`,
				type: "success",
			});

			// 실제 구현에서는 여기서 배송기사에게 SMS 발송 API 호출
		});
	};

	// 배송 완료 처리
	const handleDeliveryComplete = (orderId) => {
		const updatedOrders = orders.map((order) => {
			if (order.id === orderId) {
				return {
					...order,
					status: "배송완료",
					deliveryInfo: {
						...order.deliveryInfo,
						deliveredAt: new Date().toISOString(),
					},
				};
			}
			return order;
		});

		setOrders(updatedOrders);

		showNotification({
			title: "배송 완료",
			message: `주문번호 ${orderId}의 배송이 완료되었습니다.`,
			type: "success",
		});
	};

	// 테이블 컬럼 정의
	const columns = [
		{
			title: "주문번호",
			dataIndex: "id",
			key: "id",
			render: (id, record) => (
				<Button
					type="link"
					onClick={() => showOrderDetail(record)}>
					{id}
				</Button>
			),
		},
		{
			title: "주문시각",
			dataIndex: "orderDate",
			key: "orderDate",
			sorter: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
		},
		{
			title: "접수구분",
			dataIndex: "floor",
			key: "floor",
			render: (floor) => `${floor}층`,
			filters: [
				{ text: "2층", value: 2 },
				{ text: "4층", value: 4 },
			],
			onFilter: (value, record) => record.floor === value,
		},
		{
			title: "고객명",
			dataIndex: "customerName",
			key: "customerName",
		},
		{
			title: "수령방법",
			dataIndex: "deliveryMethod",
			key: "deliveryMethod",
			filters: [
				{ text: "택배", value: "택배" },
				{ text: "직접수령", value: "직접수령" },
			],
			onFilter: (value, record) => record.deliveryMethod === value,
		},
		{
			title: "주문금액",
			dataIndex: "totalAmount",
			key: "totalAmount",
			render: (amount) => `${amount.toLocaleString()}원`,
			sorter: (a, b) => a.totalAmount - b.totalAmount,
		},
		{
			title: "자재위치",
			dataIndex: "materialLocation",
			key: "materialLocation",
		},
		{
			title: "주문상태",
			dataIndex: "status",
			key: "status",
			render: (status) => {
				let color;
				switch (status) {
					case "대기":
						color = "default";
						break;
					case "접수":
						color = "processing";
						break;
					case "자재수급중":
						color = "warning";
						break;
					case "자재수집완료":
						color = "success";
						break;
					case "배송시작":
						color = "blue";
						break;
					case "배송완료":
						color = "green";
						break;
					default:
						color = "default";
				}
				return <Tag color={color}>{status}</Tag>;
			},
			filters: [
				{ text: "대기", value: "대기" },
				{ text: "접수", value: "접수" },
				{ text: "자재수급중", value: "자재수급중" },
				{ text: "자재수집완료", value: "자재수집완료" },
				{ text: "배송시작", value: "배송시작" },
				{ text: "배송완료", value: "배송완료" },
			],
			onFilter: (value, record) => record.status === value,
		},
		{
			title: "작업",
			key: "action",
			render: (_, record) => (
				<Space size="small">
					{record.status === "대기" && (
						<Tooltip title="인쇄">
							<Button
								type="text"
								icon={<PrinterOutlined />}
								onClick={() => {
									setSelectedRowKeys([record.id]);
									handlePrintSelected();
								}}
							/>
						</Tooltip>
					)}

					{record.status === "접수" && (
						<Tooltip title="QR 스캔">
							<Button
								type="text"
								icon={<QrcodeOutlined />}
								onClick={() => setQrScannerVisible(true)}
							/>
						</Tooltip>
					)}

					{record.status === "자재수집완료" && (
						<Tooltip title="배송 정보 입력">
							<Button
								type="text"
								icon={<CarOutlined />}
								onClick={() => showDeliveryInfoModal(record)}
							/>
						</Tooltip>
					)}

					{record.status === "배송시작" && (
						<Tooltip title="배송 완료">
							<Button
								type="text"
								icon={<CheckCircleOutlined />}
								onClick={() => handleDeliveryComplete(record.id)}
							/>
						</Tooltip>
					)}

					<Tooltip title="상태 변경">
						<Button
							type="text"
							icon={<DownOutlined />}
							onClick={() => showStatusUpdateModal(record)}
						/>
					</Tooltip>
				</Space>
			),
		},
	];

	// 테이블 행 선택 설정
	const rowSelection = {
		selectedRowKeys,
		onChange: (keys) => setSelectedRowKeys(keys),
		getCheckboxProps: (record) => ({
			disabled: record.status !== "대기", // 대기 상태만 선택 가능
		}),
	};

	return (
		<div className="order-management">
			<Title level={2}>주문 관리</Title>
			<Divider />

			<Card>
				<div className="order-management-toolbar">
					<Space>
						<Button
							type="primary"
							icon={<PrinterOutlined />}
							onClick={handlePrintSelected}
							disabled={selectedRowKeys.length === 0}>
							선택 인쇄
						</Button>

						<Button
							icon={<QrcodeOutlined />}
							onClick={() => setQrScannerVisible(true)}>
							QR 스캔
						</Button>

						<Button
							icon={<ReloadOutlined />}
							onClick={fetchOrders}>
							새로고침
						</Button>
					</Space>

					<Space>
						<Input
							placeholder="주문번호/고객명 검색"
							prefix={<SearchOutlined />}
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							style={{ width: 200 }}
						/>

						<Select
							placeholder="주문상태"
							value={filterStatus}
							onChange={setFilterStatus}
							style={{ width: 120 }}>
							<Option value="all">전체 상태</Option>
							<Option value="대기">대기</Option>
							<Option value="접수">접수</Option>
							<Option value="자재수급중">자재수급중</Option>
							<Option value="자재수집완료">자재수집완료</Option>
							<Option value="배송시작">배송시작</Option>
							<Option value="배송완료">배송완료</Option>
						</Select>

						<Select
							placeholder="접수구분"
							value={filterFloor}
							onChange={setFilterFloor}
							style={{ width: 120 }}>
							<Option value="all">전체 층</Option>
							<Option value="2">2층</Option>
							<Option value="4">4층</Option>
						</Select>

						<RangePicker onChange={(dates) => setDateRange(dates)} />
					</Space>
				</div>

				<Table
					rowSelection={rowSelection}
					columns={columns}
					dataSource={getFilteredOrders()}
					rowKey="id"
					loading={loading}
					pagination={{ pageSize: 10 }}
				/>
			</Card>

			{/* QR 스캐너 모달 */}
			<Modal
				title="QR 코드 스캔"
				visible={qrScannerVisible}
				onCancel={() => {
					stopQrScanner();
					setQrScannerVisible(false);
				}}
				footer={null}
				width={500}>
				<div className="qr-scanner-container">
					<div
						id={qrScannerId}
						style={{ width: "100%", height: 300 }}></div>
					<Button
						type="primary"
						onClick={startQrScanner}
						style={{ marginTop: 16 }}>
						스캔 시작
					</Button>
					<div className="qr-scanner-instructions">
						<Text>주문 QR 코드를 스캔해주세요.</Text>
					</div>
				</div>
			</Modal>

			{/* 자재 수집 목록 */}
			<Modal
				title="자재 수집 목록"
				visible={materialSummaryVisible}
				onCancel={() => setMaterialSummaryVisible(false)}
				footer={[
					<Button
						key="close"
						onClick={() => setMaterialSummaryVisible(false)}>
						닫기
					</Button>,
				]}
				width={700}>
				<div className="material-summary">
					<div className="material-summary-header">
						<Title level={4}>주문번호: {qrScanResult?.orderId}</Title>
						<Text>고객사: {qrScanResult?.customerName}</Text>
					</div>

					<Divider />

					<List
						dataSource={materialSummary}
						renderItem={(item) => (
							<List.Item
								actions={[
									<Button
										type={item.collected ? "primary" : "default"}
										icon={
											item.collected ? (
												<CheckCircleOutlined />
											) : (
												<ScanOutlined />
											)
										}
										onClick={() => handleMaterialLocationScan(item.location)}
										disabled={item.collected}>
										{item.collected ? "수집 완료" : "QR 스캔"}
									</Button>,
								]}>
								<List.Item.Meta
									title={`위치: ${item.location}`}
									description={
										<div>
											<div>자재 항목 ({item.items.length}개):</div>
											<ul>
												{item.items.map((material, index) => (
													<li key={index}>
														{material.productName} - {material.quantity}개
													</li>
												))}
											</ul>
										</div>
									}
								/>
							</List.Item>
						)}
					/>
				</div>
			</Modal>

			{/* 주문 상세 정보 서랍 */}
			<Drawer
				title="주문 상세 정보"
				placement="right"
				width={600}
				onClose={() => setOrderDetailVisible(false)}
				visible={orderDetailVisible}>
				{selectedOrder && (
					<div className="order-detail">
						<div className="order-detail-header">
							<Row gutter={24}>
								<Col span={12}>
									<Title level={4}>주문번호: {selectedOrder.id}</Title>
									<Text>주문일시: {selectedOrder.orderDate}</Text>
									<br />
									<Text>접수구분: {selectedOrder.floor}층</Text>
									<br />
									<Text>수령방법: {selectedOrder.deliveryMethod}</Text>
								</Col>
								<Col span={12}>
									<div className="order-status">
										<Text strong>주문상태: </Text>
										<Tag
											color={
												selectedOrder.status === "대기"
													? "default"
													: selectedOrder.status === "접수"
													? "processing"
													: selectedOrder.status === "자재수급중"
													? "warning"
													: selectedOrder.status === "자재수집완료"
													? "success"
													: selectedOrder.status === "배송시작"
													? "blue"
													: selectedOrder.status === "배송완료"
													? "green"
													: "default"
											}>
											{selectedOrder.status}
										</Tag>
									</div>
									<div className="order-amount">
										<Text strong>주문금액: </Text>
										<Text>{selectedOrder.totalAmount.toLocaleString()}원</Text>
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
									<Text>{selectedOrder.customer.name}</Text>
								</Col>
								<Col span={12}>
									<Text strong>담당자: </Text>
									<Text>{selectedOrder.customer.manager}</Text>
								</Col>
							</Row>
							<Row
								gutter={24}
								style={{ marginTop: 8 }}>
								<Col span={24}>
									<Text strong>
										<EnvironmentOutlined /> 주소:
									</Text>
									<Text> {selectedOrder.customer.address}</Text>
								</Col>
							</Row>
							<Row
								gutter={24}
								style={{ marginTop: 8 }}>
								<Col span={24}>
									<Text strong>
										<PhoneOutlined /> 연락처:
									</Text>
									<Text> {selectedOrder.customer.contact}</Text>
								</Col>
							</Row>
						</div>

						<Divider />

						<div className="order-items">
							<Title level={5}>
								<ShoppingOutlined /> 주문 제품
							</Title>
							<Table
								dataSource={selectedOrder.items}
								columns={[
									{
										title: "제품코드",
										dataIndex: "productCode",
										key: "productCode",
									},
									{
										title: "제품명",
										dataIndex: "productName",
										key: "productName",
									},
									{
										title: "공급사",
										dataIndex: "supplierName",
										key: "supplierName",
									},
									{
										title: "단가",
										dataIndex: "price",
										key: "price",
										render: (price) => `${price.toLocaleString()}원`,
									},
									{
										title: "수량",
										dataIndex: "quantity",
										key: "quantity",
									},
									{
										title: "금액",
										key: "amount",
										render: (_, record) =>
											`${(record.price * record.quantity).toLocaleString()}원`,
									},
									{
										title: "위치",
										dataIndex: "location",
										key: "location",
									},
								]}
								pagination={false}
								size="small"
							/>
						</div>

						{selectedOrder.deliveryInfo && (
							<>
								<Divider />
								<div className="delivery-info">
									<Title level={5}>
										<CarOutlined /> 배송 정보
									</Title>
									<Row gutter={24}>
										<Col span={12}>
											<Text strong>배송순번: </Text>
											<Text>{selectedOrder.deliveryInfo.sequence}</Text>
										</Col>
										<Col span={12}>
											<Text strong>택배사: </Text>
											<Text>{selectedOrder.deliveryInfo.courier}</Text>
										</Col>
									</Row>
									<Row
										gutter={24}
										style={{ marginTop: 8 }}>
										<Col span={12}>
											<Text strong>운송장번호: </Text>
											<Text>{selectedOrder.deliveryInfo.trackingNumber}</Text>
										</Col>
										<Col span={12}>
											<Text strong>예상 배송일: </Text>
											<Text>
												{selectedOrder.deliveryInfo.estimatedDelivery}
											</Text>
										</Col>
									</Row>
									{selectedOrder.deliveryInfo.deliveredAt && (
										<Row
											gutter={24}
											style={{ marginTop: 8 }}>
											<Col span={24}>
												<Text strong>배송 완료 시간: </Text>
												<Text>{selectedOrder.deliveryInfo.deliveredAt}</Text>
											</Col>
										</Row>
									)}
								</div>
							</>
						)}

						<Divider />

						<div className="order-actions">
							<Space>
								{selectedOrder.status === "대기" && (
									<Button
										type="primary"
										icon={<PrinterOutlined />}
										onClick={() => {
											setSelectedRowKeys([selectedOrder.id]);
											handlePrintSelected();
										}}>
										인쇄하기
									</Button>
								)}

								{selectedOrder.status === "접수" && (
									<Button
										type="primary"
										icon={<QrcodeOutlined />}
										onClick={() => setQrScannerVisible(true)}>
										QR 스캔
									</Button>
								)}

								{selectedOrder.status === "자재수집완료" && (
									<Button
										type="primary"
										icon={<CarOutlined />}
										onClick={() => showDeliveryInfoModal(selectedOrder)}>
										배송 정보 입력
									</Button>
								)}

								{selectedOrder.status === "배송시작" && (
									<Button
										type="primary"
										icon={<CheckCircleOutlined />}
										onClick={() => handleDeliveryComplete(selectedOrder.id)}>
										배송 완료 처리
									</Button>
								)}

								<Button
									icon={<DownOutlined />}
									onClick={() => showStatusUpdateModal(selectedOrder)}>
									상태 변경
								</Button>
							</Space>
						</div>
					</div>
				)}
			</Drawer>

			{/* 상태 변경 모달 */}
			<Modal
				title="주문 상태 변경"
				visible={statusUpdateModalVisible}
				onOk={handleStatusUpdate}
				onCancel={() => setStatusUpdateModalVisible(false)}>
				<Form layout="vertical">
					<Form.Item label="주문번호">
						<Input
							value={selectedOrder?.id}
							disabled
						/>
					</Form.Item>
					<Form.Item label="현재 상태">
						<Input
							value={selectedOrder?.status}
							disabled
						/>
					</Form.Item>
					<Form.Item label="변경할 상태">
						<Select
							value={newStatus}
							onChange={setNewStatus}>
							<Option value="대기">대기</Option>
							<Option value="접수">접수</Option>
							<Option value="자재수급중">자재수급중</Option>
							<Option value="자재수집완료">자재수집완료</Option>
							<Option value="배송시작">배송시작</Option>
							<Option value="배송완료">배송완료</Option>
						</Select>
					</Form.Item>
				</Form>
			</Modal>

			{/* 배송 정보 입력 모달 */}
			<Modal
				title="배송 정보 입력"
				visible={deliveryInfoModalVisible}
				onOk={handleDeliveryInfoSave}
				onCancel={() => setDeliveryInfoModalVisible(false)}>
				<Form
					form={deliveryForm}
					layout="vertical">
					<Form.Item
						name="sequence"
						label="배송 순번"
						rules={[{ required: true, message: "배송 순번을 입력해주세요" }]}>
						<InputNumber
							min={1}
							style={{ width: "100%" }}
						/>
					</Form.Item>
					<Form.Item
						name="courier"
						label="택배사"
						rules={[{ required: true, message: "택배사를 선택해주세요" }]}>
						<Select>
							<Option value="CJ대한통운">CJ대한통운</Option>
							<Option value="한진택배">한진택배</Option>
							<Option value="롯데택배">롯데택배</Option>
							<Option value="우체국택배">우체국택배</Option>
							<Option value="로젠택배">로젠택배</Option>
						</Select>
					</Form.Item>
					<Form.Item
						name="trackingNumber"
						label="운송장 번호"
						rules={[{ required: true, message: "운송장 번호를 입력해주세요" }]}>
						<Input />
					</Form.Item>
					<Form.Item
						name="estimatedDelivery"
						label="예상 배송일"
						rules={[{ required: true, message: "예상 배송일을 선택해주세요" }]}>
						<DatePicker style={{ width: "100%" }} />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default OrderManagement;

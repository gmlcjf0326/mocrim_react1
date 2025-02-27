import React, { useState, useEffect, useCallback } from "react";
import {
	Form,
	Input,
	Button,
	Select,
	Card,
	Table,
	Tabs,
	Row,
	Col,
	Typography,
	Divider,
	Modal,
	Space,
	Tag,
	InputNumber,
	List,
	Avatar,
	Empty,
	Spin,
} from "antd";
import {
	PlusOutlined,
	DeleteOutlined,
	HistoryOutlined,
	QrcodeOutlined,
	ShoppingCartOutlined,
	UserOutlined,
	SearchOutlined,
} from "@ant-design/icons";
import { useNotification } from "../../contexts/NotificationContext";
import QRCode from "qrcode.react";
import "./FloorOrderManagement.css";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

/**
 * 개선된 층별 주문 관리 컴포넌트
 * 2층 영업부와 4층 관리부의 주문 관리를 담당
 */
const ImprovedFloorOrderManagement = ({ floor }) => {
	// 상태 관리
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(true);
	const [customers, setCustomers] = useState([]);
	const [suppliers, setSuppliers] = useState([]);
	const [products, setProducts] = useState([]);
	const [selectedCustomer, setSelectedCustomer] = useState(null);
	const [selectedItems, setSelectedItems] = useState([]);
	const [orderComplete, setOrderComplete] = useState(false);
	const [qrModalVisible, setQrModalVisible] = useState(false);
	const [historyModalVisible, setHistoryModalVisible] = useState(false);
	const [customerOrderHistory, setCustomerOrderHistory] = useState([]);
	const [generatedQrCode, setGeneratedQrCode] = useState(null);
	const [generatedOrderId, setGeneratedOrderId] = useState(null);
	const [searchText, setSearchText] = useState("");
	const [activeSupplier, setActiveSupplier] = useState("all");

	const { showNotification } = useNotification();

	// 초기 데이터 로드
	useEffect(() => {
		fetchInitialData();
	}, []);

	// 초기 데이터 로드 함수
	const fetchInitialData = async () => {
		setLoading(true);
		try {
			// 고객사 목록 로드
			const mockCustomers = [
				{
					id: 1,
					name: "대전가구",
					address: "대전시 서구 둔산동 123",
					contact: "042-123-4567",
				},
				{
					id: 2,
					name: "광주목공소",
					address: "광주시 서구 치평동 456",
					contact: "062-345-6789",
				},
				{
					id: 3,
					name: "서울인테리어",
					address: "서울시 강남구 역삼동 789",
					contact: "02-456-7890",
				},
				{
					id: 4,
					name: "부산가구",
					address: "부산시 해운대구 우동 101",
					contact: "051-567-8901",
				},
				{
					id: 5,
					name: "인천디자인",
					address: "인천시 남동구 구월동 234",
					contact: "032-678-9012",
				},
			];

			// 공급사 목록 로드
			const mockSuppliers = [
				{
					id: 1,
					name: "우드에스티",
					type: "내부",
				},
				{
					id: 2,
					name: "한솔목재",
					type: "외부임가공",
				},
				{
					id: 3,
					name: "동화목재",
					type: "외부임가공",
				},
				{
					id: 4,
					name: "대림목재",
					type: "외부임가공",
				},
			];

			// 제품 목록 로드
			const mockProducts = [
				{
					id: 1,
					code: "PB-E1-15",
					name: "PB E1 15mm",
					supplierId: 1,
					price: 15000,
					unit: "장",
					location: "A-3",
					stock: 120,
				},
				{
					id: 2,
					code: "PB-E1-18",
					name: "PB E1 18mm",
					supplierId: 1,
					price: 18000,
					unit: "장",
					location: "A-4",
					stock: 85,
				},
				{
					id: 3,
					code: "MDF-E1-15",
					name: "MDF E1 15mm",
					supplierId: 2,
					price: 22000,
					unit: "장",
					location: "B-2",
					stock: 65,
				},
				{
					id: 4,
					code: "MDF-E1-18",
					name: "MDF E1 18mm",
					supplierId: 2,
					price: 25000,
					unit: "장",
					location: "B-3",
					stock: 50,
				},
				{
					id: 5,
					code: "MDF-E0-15",
					name: "MDF E0 15mm",
					supplierId: 3,
					price: 28000,
					unit: "장",
					location: "C-1",
					stock: 40,
				},
				{
					id: 6,
					code: "MDF-E0-18",
					name: "MDF E0 18mm",
					supplierId: 3,
					price: 32000,
					unit: "장",
					location: "C-2",
					stock: 35,
				},
				{
					id: 7,
					code: "PB-E0-15",
					name: "PB E0 15mm",
					supplierId: 4,
					price: 20000,
					unit: "장",
					location: "A-7",
					stock: 55,
				},
				{
					id: 8,
					code: "PB-E0-18",
					name: "PB E0 18mm",
					supplierId: 4,
					price: 23000,
					unit: "장",
					location: "A-8",
					stock: 45,
				},
			];

			setCustomers(mockCustomers);
			setSuppliers(mockSuppliers);
			setProducts(mockProducts);
		} catch (error) {
			console.error("Error fetching initial data:", error);
			showNotification({
				title: "데이터 로드 오류",
				message: "초기 데이터를 불러오는 중 오류가 발생했습니다.",
				type: "error",
			});
		} finally {
			setLoading(false);
		}
	};

	// 고객사 주문 이력 로드 함수
	const fetchCustomerOrderHistory = async (customerId) => {
		try {
			// 실제 구현에서는 API 호출로 대체
			const mockOrderHistory = [
				{
					id: 1,
					date: "2023-10-15",
					orderId: "ORD-20231015-001",
					items: [
						{
							id: 1,
							productId: 1,
							productCode: "PB-E1-15",
							productName: "PB E1 15mm",
							supplierId: 1,
							supplierName: "우드에스티",
							price: 15000,
							quantity: 10,
							unit: "장",
							location: "A-3",
						},
						{
							id: 2,
							productId: 2,
							productCode: "PB-E1-18",
							productName: "PB E1 18mm",
							supplierId: 1,
							supplierName: "우드에스티",
							price: 18000,
							quantity: 5,
							unit: "장",
							location: "A-4",
						},
					],
				},
				{
					id: 2,
					date: "2023-10-20",
					orderId: "ORD-20231020-003",
					items: [
						{
							id: 3,
							productId: 3,
							productCode: "MDF-E1-15",
							productName: "MDF E1 15mm",
							supplierId: 2,
							supplierName: "한솔목재",
							price: 22000,
							quantity: 8,
							unit: "장",
							location: "B-2",
						},
						{
							id: 4,
							productId: 5,
							productCode: "MDF-E0-15",
							productName: "MDF E0 15mm",
							supplierId: 3,
							supplierName: "동화목재",
							price: 28000,
							quantity: 3,
							unit: "장",
							location: "C-1",
						},
					],
				},
			];

			setCustomerOrderHistory(mockOrderHistory);
		} catch (error) {
			console.error("Error fetching customer order history:", error);
			showNotification({
				title: "주문 이력 로드 오류",
				message: "고객사 주문 이력을 불러오는 중 오류가 발생했습니다.",
				type: "error",
			});
		}
	};

	// 고객사 선택 핸들러
	const handleCustomerSelect = (customerId) => {
		const customer = customers.find((c) => c.id === customerId);
		setSelectedCustomer(customer);
		fetchCustomerOrderHistory(customerId);

		if (customer) {
			form.setFieldsValue({
				customerName: customer.name,
				customerAddress: customer.address,
				customerContact: customer.contact,
			});
		}
	};

	// 제품 추가 핸들러
	const handleAddProduct = (product) => {
		// 이미 선택된 제품인지 확인
		const existingItem = selectedItems.find(
			(item) => item.productId === product.id
		);

		if (existingItem) {
			// 이미 선택된 제품이면 수량만 증가
			setSelectedItems(
				selectedItems.map((item) =>
					item.productId === product.id
						? { ...item, quantity: item.quantity + 1 }
						: item
				)
			);
		} else {
			// 새 제품 추가
			const supplier = suppliers.find((s) => s.id === product.supplierId);
			const newItem = {
				key: Date.now().toString(),
				productId: product.id,
				productCode: product.code,
				productName: product.name,
				supplierId: product.supplierId,
				supplierName: supplier ? supplier.name : "알 수 없음",
				price: product.price,
				quantity: 1,
				unit: product.unit,
				location: product.location,
			};
			setSelectedItems([...selectedItems, newItem]);
		}

		showNotification({
			title: "제품 추가",
			message: `${product.name} 제품이 주문 목록에 추가되었습니다.`,
			type: "success",
		});
	};

	// 제품 제거 핸들러
	const handleRemoveProduct = (key) => {
		setSelectedItems(selectedItems.filter((item) => item.key !== key));
	};

	// ... existing code ...
	// 수량 변경 핸들러
	const handleQuantityChange = (value, key) => {
		setSelectedItems(
			selectedItems.map((item) =>
				item.key === key ? { ...item, quantity: value } : item
			)
		);
	};

	// 주문 제출 핸들러
	const handleSubmitOrder = async () => {
		if (!selectedCustomer) {
			showNotification({
				title: "주문 오류",
				message: "고객사를 선택해주세요.",
				type: "error",
			});
			return;
		}

		if (selectedItems.length === 0) {
			showNotification({
				title: "주문 오류",
				message: "주문할 제품을 선택해주세요.",
				type: "error",
			});
			return;
		}

		try {
			setLoading(true);

			// 주문 번호 생성 (실제로는 서버에서 생성)
			const orderId = `ORD-${new Date()
				.toISOString()
				.slice(0, 10)
				.replace(/-/g, "")}-${Math.floor(Math.random() * 1000)
				.toString()
				.padStart(3, "0")}`;

			// 주문 데이터 생성
			const orderData = {
				id: orderId,
				customerId: selectedCustomer.id,
				customerName: selectedCustomer.name,
				floor: floor,
				orderDate: new Date().toISOString(),
				status: "대기",
				items: selectedItems.map((item) => ({
					productId: item.productId,
					productName: item.productName,
					supplierId: item.supplierId,
					supplierName: item.supplierName,
					price: item.price,
					quantity: item.quantity,
					location: item.location,
				})),
				totalAmount: selectedItems.reduce(
					(sum, item) => sum + item.price * item.quantity,
					0
				),
			};

			// QR 코드 데이터 생성
			const qrData = JSON.stringify({
				orderId: orderData.id,
				customerName: orderData.customerName,
				floor: orderData.floor,
				items: orderData.items.map((item) => ({
					productName: item.productName,
					quantity: item.quantity,
					location: item.location,
				})),
			});

			// 실제 구현에서는 API 호출로 주문 저장
			console.log("Order submitted:", orderData);

			// 주문 완료 상태 설정
			setGeneratedOrderId(orderId);
			setGeneratedQrCode(qrData);
			setOrderComplete(true);
			setQrModalVisible(true);

			// 주문 완료 후 폼 초기화
			form.resetFields();
			setSelectedItems([]);

			showNotification({
				title: "주문 완료",
				message: `주문이 성공적으로 접수되었습니다. 주문번호: ${orderId}`,
				type: "success",
			});
		} catch (error) {
			console.error("Error submitting order:", error);
			showNotification({
				title: "주문 오류",
				message: "주문 처리 중 오류가 발생했습니다.",
				type: "error",
			});
		} finally {
			setLoading(false);
		}
	};

	// 히스토리 아이템 추가 핸들러
	const handleAddHistoryItem = (historyItem) => {
		// 이미 선택된 제품들과 히스토리 아이템 병합
		const newItems = [...selectedItems];

		historyItem.items.forEach((item) => {
			const existingItemIndex = newItems.findIndex(
				(existing) => existing.productId === item.productId
			);

			if (existingItemIndex >= 0) {
				// 이미 있는 제품이면 수량만 증가
				newItems[existingItemIndex].quantity += item.quantity;
			} else {
				// 새 제품 추가
				newItems.push({
					...item,
					key: Date.now().toString() + Math.random().toString(36).substr(2, 5),
				});
			}
		});

		setSelectedItems(newItems);
		setHistoryModalVisible(false);

		showNotification({
			title: "히스토리 추가",
			message: "이전 주문 내역이 현재 주문에 추가되었습니다.",
			type: "success",
		});
	};

	// 공급사별 제품 필터링
	const getFilteredProducts = useCallback(() => {
		let filtered = [...products];

		// 검색어로 필터링
		if (searchText) {
			filtered = filtered.filter(
				(product) =>
					product.name.toLowerCase().includes(searchText.toLowerCase()) ||
					product.code.toLowerCase().includes(searchText.toLowerCase())
			);
		}

		// 공급사로 필터링
		if (activeSupplier !== "all") {
			filtered = filtered.filter(
				(product) => product.supplierId === parseInt(activeSupplier)
			);
		}

		return filtered;
	}, [products, searchText, activeSupplier]);

	// 주문 총액 계산
	const calculateTotal = useCallback(() => {
		return selectedItems.reduce(
			(total, item) => total + item.price * item.quantity,
			0
		);
	}, [selectedItems]);

	// 선택된 아이템 테이블 컬럼
	const selectedItemsColumns = [
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
			render: (quantity, record) => (
				<InputNumber
					min={1}
					value={quantity}
					onChange={(value) => handleQuantityChange(value, record.key)}
				/>
			),
		},
		{
			title: "단위",
			dataIndex: "unit",
			key: "unit",
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
		{
			title: "작업",
			key: "action",
			render: (_, record) => (
				<Button
					type="text"
					danger
					icon={<DeleteOutlined />}
					onClick={() => handleRemoveProduct(record.key)}
				/>
			),
		},
	];

	return (
		<div className="floor-order-management">
			<Title level={2}>
				{floor}층 {floor === 2 ? "영업부" : "관리부"} 주문
			</Title>
			<Divider />

			<Spin spinning={loading}>
				<Form
					form={form}
					layout="vertical">
					<Row gutter={24}>
						{/* 좌측 고객사 선택 영역 */}
						<Col span={6}>
							<Card
								title="고객사 선택"
								className="customer-card">
								<Input
									placeholder="고객사 검색"
									prefix={<SearchOutlined />}
									style={{ marginBottom: 16 }}
									onChange={(e) => setSearchText(e.target.value)}
								/>
								<List
									dataSource={customers.filter((customer) =>
										customer.name
											.toLowerCase()
											.includes(searchText.toLowerCase())
									)}
									renderItem={(customer) => (
										<List.Item
											key={customer.id}
											onClick={() => handleCustomerSelect(customer.id)}
											className={
												selectedCustomer?.id === customer.id
													? "selected-customer"
													: ""
											}>
											<List.Item.Meta
												avatar={<Avatar icon={<UserOutlined />} />}
												title={customer.name}
												description={customer.address}
											/>
										</List.Item>
									)}
									locale={{
										emptyText: <Empty description="고객사가 없습니다" />,
									}}
								/>
							</Card>

							{selectedCustomer && (
								<Card
									title="고객사 정보"
									style={{ marginTop: 16 }}>
									<Form.Item
										label="고객사명"
										name="customerName">
										<Input disabled />
									</Form.Item>
									<Form.Item
										label="주소"
										name="customerAddress">
										<Input disabled />
									</Form.Item>
									<Form.Item
										label="연락처"
										name="customerContact">
										<Input disabled />
									</Form.Item>
									<Button
										type="primary"
										icon={<HistoryOutlined />}
										onClick={() => setHistoryModalVisible(true)}
										block>
										주문 히스토리 보기
									</Button>
								</Card>
							)}
						</Col>

						{/* 우측 제품 선택 영역 */}
						<Col span={18}>
							<Card title="제품 선택">
								<div className="supplier-tabs">
									<Button
										type={activeSupplier === "all" ? "primary" : "default"}
										onClick={() => setActiveSupplier("all")}>
										전체
									</Button>
									{suppliers.map((supplier) => (
										<Button
											key={supplier.id}
											type={
												activeSupplier === supplier.id.toString()
													? "primary"
													: "default"
											}
											onClick={() => setActiveSupplier(supplier.id.toString())}>
											{supplier.name}
										</Button>
									))}
									<Input
										placeholder="제품 검색"
										prefix={<SearchOutlined />}
										style={{ width: 200, marginLeft: "auto" }}
										onChange={(e) => setSearchText(e.target.value)}
									/>
								</div>

								<div className="product-grid">
									{getFilteredProducts().map((product) => {
										const supplier = suppliers.find(
											(s) => s.id === product.supplierId
										);
										return (
											<Card
												key={product.id}
												className="product-card"
												hoverable
												onClick={() => handleAddProduct(product)}>
												<div className="product-info">
													<div className="product-title">{product.name}</div>
													<div className="product-code">{product.code}</div>
													<div className="product-supplier">
														{supplier?.name}
													</div>
													<div className="product-price">
														{product.price.toLocaleString()}원/{product.unit}
													</div>
													<div className="product-stock">
														재고: {product.stock}
														{product.unit}
													</div>
													<div className="product-location">
														위치: {product.location}
													</div>
												</div>
												<div className="product-add">
													<PlusOutlined />
												</div>
											</Card>
										);
									})}
								</div>
							</Card>

							<Card
								title="선택된 제품"
								style={{ marginTop: 16 }}>
								<Table
									columns={selectedItemsColumns}
									dataSource={selectedItems}
									pagination={false}
									locale={{
										emptyText:
											"선택된 제품이 없습니다. 위에서 제품을 선택해주세요.",
									}}
								/>

								<div className="order-summary">
									<div className="order-total">
										<Text strong>총 주문금액: </Text>
										<Text
											strong
											style={{ fontSize: 18 }}>
											{calculateTotal().toLocaleString()}원
										</Text>
									</div>

									<Button
										type="primary"
										size="large"
										icon={<ShoppingCartOutlined />}
										onClick={handleSubmitOrder}
										disabled={selectedItems.length === 0 || !selectedCustomer}>
										발주하기
									</Button>
								</div>
							</Card>
						</Col>
					</Row>
				</Form>
			</Spin>

			{/* QR 코드 모달 */}
			<Modal
				title="발주 완료"
				visible={qrModalVisible}
				onCancel={() => setQrModalVisible(false)}
				footer={[
					<Button
						key="print"
						type="primary"
						onClick={() => window.print()}>
						발주서 인쇄
					</Button>,
					<Button
						key="close"
						onClick={() => setQrModalVisible(false)}>
						닫기
					</Button>,
				]}
				width={600}>
				<div className="order-complete-modal">
					<div className="order-qr-section">
						<div className="qr-code">
							{generatedQrCode && (
								<QRCode
									value={generatedQrCode}
									size={200}
								/>
							)}
						</div>
						<div className="order-info">
							<Title level={4}>주문번호: {generatedOrderId}</Title>
							<Text>고객사: {selectedCustomer?.name}</Text>
							<Text>주문일시: {new Date().toLocaleString()}</Text>
							<Text>주문금액: {calculateTotal().toLocaleString()}원</Text>
						</div>
					</div>

					<Divider />

					<Table
						columns={selectedItemsColumns.filter((col) => col.key !== "action")}
						dataSource={selectedItems}
						pagination={false}
						size="small"
					/>
				</div>
			</Modal>

			{/* 히스토리 모달 */}
			<Modal
				title={`${selectedCustomer?.name} 주문 히스토리`}
				visible={historyModalVisible}
				onCancel={() => setHistoryModalVisible(false)}
				footer={null}
				width={800}>
				<List
					dataSource={customerOrderHistory}
					renderItem={(history) => (
						<List.Item
							key={history.id}
							actions={[
								<Button
									type="primary"
									onClick={() => handleAddHistoryItem(history)}>
									주문에 추가
								</Button>,
							]}>
							<List.Item.Meta
								title={`주문번호: ${history.orderId} (${history.date})`}
								description={
									<div>
										<div>주문 제품:</div>
										<ul>
											{history.items.map((item) => (
												// ... existing code ...
												<li key={item.id}>
													{item.productName} - {item.quantity}
													{item.unit}({item.supplierName})
												</li>
											))}
										</ul>
									</div>
								}
							/>
						</List.Item>
					)}
					locale={{
						emptyText: <Empty description="주문 히스토리가 없습니다" />,
					}}
				/>
			</Modal>
		</div>
	);
};

export default ImprovedFloorOrderManagement;

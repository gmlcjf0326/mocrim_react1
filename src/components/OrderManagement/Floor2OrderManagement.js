import React, { useState, useEffect } from "react";
import {
	Form,
	Input,
	Button,
	Select,
	DatePicker,
	Table,
	InputNumber,
	Divider,
	Modal,
	Spin,
	Card,
	Result,
} from "antd";
import {
	PlusOutlined,
	DeleteOutlined,
	QrcodeOutlined,
	ArrowLeftOutlined,
	ShoppingCartOutlined,
	ScanOutlined,
} from "@ant-design/icons";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../contexts/NotificationContext";
import "./FloorOrderManagement.css";

const { Option } = Select;
const { TextArea } = Input;

/**
 * 2층 영업부 주문 관리 컴포넌트
 * 쇼케이스에서 고객 방문으로 인한 주문 처리
 */
const Floor2OrderManagement = () => {
	const [form] = Form.useForm();
	const [items, setItems] = useState([]);
	const [materials, setMaterials] = useState([]);
	const [loading, setLoading] = useState(true);
	const [orderComplete, setOrderComplete] = useState(false);
	const [qrModalVisible, setQrModalVisible] = useState(false);
	const [generatedQrCode, setGeneratedQrCode] = useState(null);
	const [generatedOrderId, setGeneratedOrderId] = useState(null);

	const navigate = useNavigate();
	const { showNotification, hideNotification } = useNotification();

	// 가상 자재 데이터
	const mockMaterialsData = [
		{ id: 1, code: "A1", name: "PB E0 9T", stock: 35, unit: "장" },
		{ id: 2, code: "A2", name: "PB E0 12T", stock: 42, unit: "장" },
		{ id: 3, code: "A3", name: "PB E0 15T", stock: 28, unit: "장" },
		{ id: 4, code: "A4", name: "PB E0 18T", stock: 33, unit: "장" },
		{ id: 5, code: "A5", name: "PB E1 15T", stock: 45, unit: "장" },
		{ id: 6, code: "A6", name: "PB E1 18T", stock: 50, unit: "장" },
		{ id: 7, code: "B1", name: "MDF E0 9T", stock: 22, unit: "장" },
		{ id: 8, code: "B2", name: "MDF E0 12T", stock: 30, unit: "장" },
		{ id: 9, code: "B3", name: "MDF E0 15T", stock: 25, unit: "장" },
		{ id: 10, code: "B4", name: "MDF E1 12T", stock: 38, unit: "장" },
		{ id: 11, code: "B5", name: "MDF E1 15T", stock: 40, unit: "장" },
		{ id: 12, code: "B6", name: "MDF E1 18T", stock: 36, unit: "장" },
		{ id: 13, code: "C1", name: "멜라민 화이트 9T", stock: 18, unit: "장" },
		{ id: 14, code: "C2", name: "멜라민 화이트 12T", stock: 24, unit: "장" },
		{ id: 15, code: "C3", name: "멜라민 화이트 15T", stock: 27, unit: "장" },
		{ id: 16, code: "C4", name: "멜라민 화이트 18T", stock: 32, unit: "장" },
		{ id: 17, code: "C5", name: "멜라민 블랙 12T", stock: 15, unit: "장" },
		{ id: 18, code: "C6", name: "멜라민 블랙 15T", stock: 20, unit: "장" },
		{ id: 19, code: "C7", name: "멜라민 블랙 18T", stock: 22, unit: "장" },
	];

	// 주문 데이터 로드
	useEffect(() => {
		setLoading(true);
		// API 호출 대신 목업 데이터 사용
		setTimeout(() => {
			setMaterials(mockMaterialsData);
			setLoading(false);
		}, 600);
	}, []);

	// 자재 아이템 추가
	const addItem = () => {
		const newItem = {
			key: Date.now(),
			materialId: undefined,
			materialCode: undefined,
			materialName: undefined,
			quantity: 1,
			unit: "",
		};
		setItems([...items, newItem]);
	};

	// 자재 아이템 제거
	const removeItem = (key) => {
		setItems(items.filter((item) => item.key !== key));
	};

	// 자재 선택 변경 핸들러
	const handleMaterialChange = (value, key) => {
		const selectedMaterial = materials.find((m) => m.id === value);

		setItems(
			items.map((item) => {
				if (item.key === key) {
					return {
						...item,
						materialId: selectedMaterial.id,
						materialCode: selectedMaterial.code,
						materialName: selectedMaterial.name,
						unit: selectedMaterial.unit,
					};
				}
				return item;
			})
		);
	};

	// 수량 변경 핸들러
	const handleQuantityChange = (value, key) => {
		setItems(
			items.map((item) => {
				if (item.key === key) {
					return { ...item, quantity: value };
				}
				return item;
			})
		);
	};

	// 주문 제출 핸들러
	const handleSubmit = async (values) => {
		if (items.length === 0) {
			showNotification({
				title: "주문 항목 필요",
				message: "최소 하나 이상의 주문 항목을 추가해주세요.",
				type: "warning",
			});
			return;
		}

		// 자재 코드로 정렬
		const sortedItems = [...items].sort((a, b) =>
			a.materialCode.localeCompare(b.materialCode)
		);

		// 주문번호 생성 (실제로는 서버에서 생성)
		// 주문번호 생성 (실제로는 서버에서 생성)
		const today = new Date();
		const formattedDate = `${today.getFullYear()}${String(
			today.getMonth() + 1
		).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;
		const randomOrderNum = Math.floor(Math.random() * 1000)
			.toString()
			.padStart(3, "0");
		const orderId = `ORD-${formattedDate}-${randomOrderNum}`;

		setLoading(true);

		try {
			// 실제 API 호출 대신 타임아웃으로 시뮬레이션
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// 주문 데이터 생성
			const orderData = {
				id: orderId,
				customer: values.customer,
				contact: `${values.contactName} / ${values.contactPhone}`,
				orderDate: today.toISOString().split("T")[0],
				deliveryDate: values.deliveryDate.format("YYYY-MM-DD"),
				deliveryMethod: values.deliveryMethod,
				status: "접수대기",
				floor: "2층",
				items: sortedItems.map((item) => ({
					code: item.materialCode,
					name: item.materialName,
					quantity: item.quantity,
					unit: item.unit,
				})),
				note: values.note || "",
				address: values.deliveryMethod === "택배" ? values.address : "",
				qrCode: orderId,
			};

			// 성공 처리
			setGeneratedOrderId(orderId);
			setGeneratedQrCode(orderId);
			setQrModalVisible(true);
			setOrderComplete(true);

			showNotification({
				title: "주문 생성 완료",
				message: `주문번호 ${orderId}가 성공적으로 생성되었습니다.`,
				type: "success",
			});
		} catch (error) {
			showNotification({
				title: "주문 생성 실패",
				message: "주문 생성 중 오류가 발생했습니다. 다시 시도해주세요.",
				type: "error",
			});
		} finally {
			setLoading(false);
		}
	};

	// 주문 초기화
	const resetOrder = () => {
		form.resetFields();
		setItems([]);
		setOrderComplete(false);
	};

	// 주문 항목 테이블 컬럼 정의
	const columns = [
		{
			title: "자재 선택",
			dataIndex: "materialId",
			key: "materialId",
			render: (value, record) => (
				<Select
					placeholder="자재 선택"
					style={{ width: "100%" }}
					value={value}
					onChange={(val) => handleMaterialChange(val, record.key)}
					disabled={orderComplete}>
					{materials.map((material) => (
						<Option
							key={material.id}
							value={material.id}>
							{`${material.code} - ${material.name} (재고: ${material.stock}${material.unit})`}
						</Option>
					))}
				</Select>
			),
		},
		{
			title: "자재 코드",
			dataIndex: "materialCode",
			key: "materialCode",
			render: (text) => text || "-",
		},
		{
			title: "자재명",
			dataIndex: "materialName",
			key: "materialName",
			render: (text) => text || "-",
		},
		{
			title: "수량",
			dataIndex: "quantity",
			key: "quantity",
			render: (value, record) => (
				<InputNumber
					min={1}
					value={value}
					onChange={(val) => handleQuantityChange(val, record.key)}
					disabled={!record.materialId || orderComplete}
					style={{ width: "100%" }}
				/>
			),
		},
		{
			title: "단위",
			dataIndex: "unit",
			key: "unit",
			render: (text) => text || "-",
		},
		{
			title: "작업",
			key: "action",
			render: (_, record) => (
				<Button
					type="text"
					danger
					icon={<DeleteOutlined />}
					onClick={() => removeItem(record.key)}
					disabled={orderComplete}
				/>
			),
		},
	];

	// QR 코드 모달 렌더링
	const renderQrModal = () => {
		if (!generatedQrCode) return null;

		return (
			<Modal
				title="주문 QR 코드"
				visible={qrModalVisible}
				onCancel={() => setQrModalVisible(false)}
				footer={[
					<Button
						key="close"
						onClick={() => setQrModalVisible(false)}>
						닫기
					</Button>,
					<Button
						key="print"
						type="primary"
						icon={<QrcodeOutlined />}
						onClick={() => {
							showNotification({
								title: "QR 코드 인쇄",
								message: "QR 코드 인쇄가 요청되었습니다.",
								type: "info",
							});
						}}>
						인쇄
					</Button>,
				]}
				width={400}
				className="qr-modal">
				<div className="qr-code-container">
					<QRCodeCanvas
						value={generatedQrCode}
						size={200}
						level="H"
						includeMargin={true}
					/>
					<div className="qr-order-info">
						<p className="qr-order-id">{generatedOrderId}</p>
						<p className="qr-customer">{form.getFieldValue("customer")}</p>
						<p className="qr-date">{new Date().toLocaleDateString()}</p>
					</div>
				</div>
			</Modal>
		);
	};

	// 주문 완료 결과 렌더링
	const renderOrderComplete = () => {
		return (
			<Result
				status="success"
				title="주문이 성공적으로 생성되었습니다!"
				subTitle={`주문번호: ${generatedOrderId}`}
				extra={[
					<Button
						type="primary"
						key="new-order"
						onClick={resetOrder}>
						새 주문 생성
					</Button>,
					<Button
						key="show-qr"
						onClick={() => setQrModalVisible(true)}
						icon={<QrcodeOutlined />}>
						QR 코드 보기
					</Button>,
					<Button
						key="back"
						onClick={() => navigate("/orders/management")}
						icon={<ArrowLeftOutlined />}>
						주문 관리로 돌아가기
					</Button>,
				]}
			/>
		);
	};

	// 주문 폼 렌더링
	const renderOrderForm = () => {
		return (
			<Form
				form={form}
				layout="vertical"
				onFinish={handleSubmit}
				initialValues={{
					deliveryMethod: "택배",
					deliveryDate: null,
				}}
				disabled={orderComplete}>
				<div className="form-grid">
					<div className="form-section">
						<Card
							title="고객 정보"
							className="info-card">
							<Form.Item
								name="customer"
								label="고객명/회사명"
								rules={[{ required: true, message: "고객명을 입력해주세요" }]}>
								<Input placeholder="고객명 또는 회사명 입력" />
							</Form.Item>

							<Form.Item
								name="contactName"
								label="담당자명"
								rules={[
									{ required: true, message: "담당자명을 입력해주세요" },
								]}>
								<Input placeholder="담당자 이름 입력" />
							</Form.Item>

							<Form.Item
								name="contactPhone"
								label="연락처"
								rules={[{ required: true, message: "연락처를 입력해주세요" }]}>
								<Input placeholder="연락처 입력 (예: 010-1234-5678)" />
							</Form.Item>
						</Card>
					</div>

					<div className="form-section">
						<Card
							title="배송 정보"
							className="info-card">
							<Form.Item
								name="deliveryMethod"
								label="수령 방법"
								rules={[
									{ required: true, message: "수령 방법을 선택해주세요" },
								]}>
								<Select>
									<Option value="택배">택배</Option>
									<Option value="직접수령">직접수령</Option>
								</Select>
							</Form.Item>

							<Form.Item
								name="deliveryDate"
								label="납기일자"
								rules={[
									{ required: true, message: "납기일자를 선택해주세요" },
								]}>
								<DatePicker style={{ width: "100%" }} />
							</Form.Item>

							<Form.Item
								noStyle
								shouldUpdate={(prevValues, currentValues) =>
									prevValues.deliveryMethod !== currentValues.deliveryMethod
								}>
								{({ getFieldValue }) =>
									getFieldValue("deliveryMethod") === "택배" ? (
										<Form.Item
											name="address"
											label="배송지 주소"
											rules={[
												{
													required: true,
													message: "배송지 주소를 입력해주세요",
												},
											]}>
											<TextArea
												rows={3}
												placeholder="배송지 주소 입력"
											/>
										</Form.Item>
									) : null
								}
							</Form.Item>

							<Form.Item
								name="note"
								label="비고">
								<TextArea
									rows={2}
									placeholder="추가 요청사항 입력"
								/>
							</Form.Item>
						</Card>
					</div>
				</div>

				<Divider orientation="left">주문 항목</Divider>

				<div className="order-items-section">
					<div className="items-header">
						<Button
							type="primary"
							icon={<PlusOutlined />}
							onClick={addItem}
							disabled={orderComplete}>
							자재 추가
						</Button>

						<Button
							type="default"
							icon={<ScanOutlined />}
							disabled={orderComplete}
							onClick={() => {
								showNotification({
									title: "QR 스캔",
									message: "자재 QR 코드 스캔 기능은 준비 중입니다.",
									type: "info",
								});
							}}>
							자재 QR 스캔
						</Button>
					</div>

					<Table
						columns={columns}
						dataSource={items}
						rowKey="key"
						pagination={false}
						locale={{ emptyText: "자재를 추가해주세요" }}
					/>

					<div className="form-actions">
						<Button
							type="primary"
							htmlType="submit"
							icon={<ShoppingCartOutlined />}
							size="large"
							loading={loading}
							disabled={items.length === 0 || orderComplete}>
							주문 생성
						</Button>

						<Button
							onClick={() => navigate("/orders/management")}
							icon={<ArrowLeftOutlined />}
							size="large">
							돌아가기
						</Button>
					</div>
				</div>
			</Form>
		);
	};

	return (
		<div className="floor-order-management">
			<div className="page-header">
				<h1 className="page-title">2층 영업부 주문 관리</h1>
				<div className="header-subtitle">쇼케이스 방문 고객 주문 처리</div>
			</div>

			{loading && !orderComplete ? (
				<div className="loading-container">
					<Spin size="large" />
					<p>데이터 로딩 중...</p>
				</div>
			) : orderComplete ? (
				renderOrderComplete()
			) : (
				renderOrderForm()
			)}

			{renderQrModal()}
		</div>
	);
};

export default Floor2OrderManagement;

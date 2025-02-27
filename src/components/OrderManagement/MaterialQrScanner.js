import React, { useState, useRef } from "react";
import {
	Card,
	Typography,
	Button,
	Space,
	Modal,
	List,
	Tag,
	Divider,
	Result,
	Spin,
	Alert,
} from "antd";
import {
	QrcodeOutlined,
	ScanOutlined,
	CheckCircleOutlined,
	WarningOutlined,
	InfoCircleOutlined,
} from "@ant-design/icons";
import QrReader from "react-qr-reader";
import { useNotification } from "../../contexts/NotificationContext";
import "./MaterialQrScanner.css";

const { Title, Text } = Typography;

/**
 * 자재 QR 스캐너 컴포넌트
 * 자재 위치의 QR 코드를 스캔하여 자재 수집 상태를 관리
 */
const MaterialQrScanner = () => {
	// 상태 관리
	const [scanning, setScanning] = useState(false);
	const [currentOrder, setCurrentOrder] = useState(null);
	const [scannedLocations, setScannedLocations] = useState([]);
	const [allLocationsScanned, setAllLocationsScanned] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const { showNotification } = useNotification();
	const qrReaderRef = useRef(null);

	// QR 스캔 시작
	const startScanning = () => {
		setScanning(true);
		setError(null);
	};

	// QR 스캔 중지
	const stopScanning = () => {
		setScanning(false);
	};

	// QR 스캔 처리
	const handleQrScan = (data) => {
		if (!data) return;

		try {
			const parsedData = JSON.parse(data);

			// 주문 QR 코드인 경우
			if (parsedData.orderId) {
				handleOrderQrScan(parsedData);
			}
			// 자재 위치 QR 코드인 경우
			else if (parsedData.location) {
				handleLocationQrScan(parsedData);
			}
			// 알 수 없는 QR 코드인 경우
			else {
				setError("인식할 수 없는 QR 코드입니다.");
			}
		} catch (error) {
			console.error("QR 코드 파싱 오류:", error);
			setError("QR 코드를 처리하는 중 오류가 발생했습니다.");
		}
	};

	// 주문 QR 코드 처리
	const handleOrderQrScan = (orderData) => {
		setCurrentOrder(orderData);
		setScannedLocations([]);
		setAllLocationsScanned(false);

		// 필요한 자재 위치 목록 추출
		const locations = [
			...new Set(orderData.items.map((item) => item.location)),
		];

		showNotification({
			title: "주문 QR 스캔 완료",
			message: `주문번호 ${orderData.orderId}의 QR 코드가 스캔되었습니다.`,
			type: "success",
		});

		// 스캔 중지
		stopScanning();
	};

	// 자재 위치 QR 코드 처리
	const handleLocationQrScan = (locationData) => {
		if (!currentOrder) {
			setError("먼저 주문 QR 코드를 스캔해주세요.");
			return;
		}

		const { location } = locationData;

		// 이미 스캔한 위치인지 확인
		if (scannedLocations.includes(location)) {
			setError(`이미 스캔한 위치(${location})입니다.`);
			return;
		}

		// 현재 주문에 필요한 위치인지 확인
		const requiredLocations = [
			...new Set(currentOrder.items.map((item) => item.location)),
		];

		if (!requiredLocations.includes(location)) {
			setError(`현재 주문에 필요하지 않은 위치(${location})입니다.`);
			return;
		}

		// 자재 위치 스캔 처리
		setScannedLocations([...scannedLocations, location]);

		// 실제 구현에서는 여기서 자재 수량 차감 API 호출

		showNotification({
			title: "위치 스캔 완료",
			message: `위치 ${location}의 자재가 수집되었습니다.`,
			type: "success",
		});

		// 모든 위치가 스캔되었는지 확인
		const updatedScannedLocations = [...scannedLocations, location];
		const allScanned = requiredLocations.every((loc) =>
			updatedScannedLocations.includes(loc)
		);

		if (allScanned) {
			setAllLocationsScanned(true);

			// 실제 구현에서는 여기서 주문 상태 업데이트 API 호출

			showNotification({
				title: "자재 수집 완료",
				message: `주문번호 ${currentOrder.orderId}의 모든 자재 수집이 완료되었습니다.`,
				type: "success",
			});

			// 스캔 중지
			stopScanning();
		}
	};

	// QR 스캔 오류 처리
	const handleQrError = (err) => {
		console.error("QR 스캐너 오류:", err);
		setError("QR 코드를 스캔하는 중 오류가 발생했습니다.");
	};

	// 새 주문 시작
	const startNewOrder = () => {
		setCurrentOrder(null);
		setScannedLocations([]);
		setAllLocationsScanned(false);
		setError(null);
	};

	return (
		<div className="material-qr-scanner">
			<Title level={2}>자재 QR 스캐너</Title>
			<Divider />

			<Card>
				{!currentOrder ? (
					<div className="scanner-start">
						<Result
							icon={<QrcodeOutlined />}
							title="주문 QR 코드 스캔"
							subTitle="자재 수집을 시작하려면 주문 QR 코드를 스캔해주세요."
							extra={
								<Button
									type="primary"
									icon={<ScanOutlined />}
									size="large"
									onClick={startScanning}>
									// ... existing code ... QR 스캔 시작
								</Button>
							}
						/>
					</div>
				) : (
					<div className="order-processing">
						<div className="order-info">
							<Title level={4}>주문번호: {currentOrder.orderId}</Title>
							<Text>고객사: {currentOrder.customerName}</Text>

							<Divider />

							<div className="location-status">
								<Title level={5}>자재 위치 스캔 상태</Title>
								<List
									dataSource={[
										...new Set(currentOrder.items.map((item) => item.location)),
									]}
									renderItem={(location) => (
										<List.Item>
											<List.Item.Meta
												title={`위치: ${location}`}
												description={
													<div>
														<div>자재 항목:</div>
														<ul>
															{currentOrder.items
																.filter((item) => item.location === location)
																.map((item, index) => (
																	<li key={index}>
																		{item.productName} - {item.quantity}개
																	</li>
																))}
														</ul>
													</div>
												}
											/>
											{scannedLocations.includes(location) ? (
												<Tag
													color="success"
													icon={<CheckCircleOutlined />}>
													스캔 완료
												</Tag>
											) : (
												<Tag color="default">미스캔</Tag>
											)}
										</List.Item>
									)}
								/>
							</div>

							<Divider />

							{allLocationsScanned ? (
								<Result
									status="success"
									title="모든 자재 수집 완료"
									subTitle={`주문번호 ${currentOrder.orderId}의 모든 자재 수집이 완료되었습니다.`}
									extra={
										<Button
											type="primary"
											onClick={startNewOrder}>
											새 주문 시작
										</Button>
									}
								/>
							) : (
								<Space
									direction="vertical"
									style={{ width: "100%" }}>
									<Alert
										message="자재 위치 QR 코드를 스캔해주세요"
										description="각 자재 위치의 QR 코드를 순서대로 스캔하여 자재를 수집하세요."
										type="info"
										showIcon
									/>

									<div className="scanner-actions">
										<Space>
											<Button
												type="primary"
												icon={<ScanOutlined />}
												onClick={startScanning}
												disabled={scanning}>
												위치 QR 스캔
											</Button>

											<Button onClick={startNewOrder}>취소</Button>
										</Space>
									</div>
								</Space>
							)}
						</div>
					</div>
				)}

				{error && (
					<Alert
						message="오류"
						description={error}
						type="error"
						showIcon
						closable
						onClose={() => setError(null)}
						style={{ marginTop: 16 }}
					/>
				)}
			</Card>

			{/* QR 스캐너 모달 */}
			<Modal
				title="QR 코드 스캔"
				visible={scanning}
				onCancel={stopScanning}
				footer={[
					<Button
						key="cancel"
						onClick={stopScanning}>
						취소
					</Button>,
				]}
				width={500}>
				<div className="qr-scanner-container">
					<Spin
						spinning={loading}
						tip="처리 중...">
						<QrReader
							ref={qrReaderRef}
							delay={300}
							onError={handleQrError}
							onScan={handleQrScan}
							style={{ width: "100%" }}
						/>
					</Spin>
					<div className="qr-scanner-instructions">
						<Text>
							{!currentOrder
								? "주문 QR 코드를 스캔해주세요."
								: "자재 위치 QR 코드를 스캔해주세요."}
						</Text>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default MaterialQrScanner;

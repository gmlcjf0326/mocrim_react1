import React, { useState, useRef } from "react";
import { Modal, Button, Spin, Result } from "antd";
import {
	QrcodeOutlined,
	CloseCircleOutlined,
	CheckCircleOutlined,
} from "@ant-design/icons";
import { useNotification } from "../../contexts/NotificationContext";
import "./MaterialQrScanner.css";

/**
 * 자재 QR 코드 스캐너 컴포넌트
 * 자재 QR 코드를 스캔하여 자재 정보를 가져오는 컴포넌트
 */
const MaterialQrScanner = ({ visible, onClose, onScanSuccess }) => {
	const [scanning, setScanning] = useState(false);
	const [scanResult, setScanResult] = useState(null);
	const [error, setError] = useState(null);
	const videoRef = useRef(null);
	const { showNotification } = useNotification();

	// QR 스캔 시작
	const startScanning = async () => {
		setScanning(true);
		setError(null);
		setScanResult(null);

		try {
			// 실제 구현에서는 카메라 접근 및 QR 코드 스캔 라이브러리 사용
			// 여기서는 시뮬레이션만 구현

			// 스캔 시뮬레이션
			setTimeout(() => {
				const mockMaterialData = {
					id: 5,
					code: "A5",
					name: "PB E1 15T",
					stock: 45,
					unit: "장",
				};

				setScanResult(mockMaterialData);
				setScanning(false);

				if (onScanSuccess) {
					onScanSuccess(mockMaterialData);
				}

				showNotification({
					title: "QR 스캔 성공",
					message: `자재 ${mockMaterialData.code} - ${mockMaterialData.name} 스캔 완료`,
					type: "success",
				});
			}, 2000);
		} catch (err) {
			setError("QR 코드 스캔 중 오류가 발생했습니다.");
			setScanning(false);

			showNotification({
				title: "QR 스캔 실패",
				message: "QR 코드 스캔 중 오류가 발생했습니다.",
				type: "error",
			});
		}
	};

	// 스캔 중지
	const stopScanning = () => {
		setScanning(false);
		// 실제 구현에서는 카메라 스트림 중지 로직 추가
	};

	// 모달 닫기
	const handleClose = () => {
		stopScanning();
		onClose();
	};

	// 스캔 결과 렌더링
	const renderScanResult = () => {
		if (!scanResult) return null;

		return (
			<Result
				status="success"
				title="자재 QR 코드 스캔 완료"
				subTitle={`${scanResult.code} - ${scanResult.name}`}
				extra={[
					<Button
						key="scan-again"
						type="primary"
						onClick={startScanning}
						icon={<QrcodeOutlined />}>
						다시 스캔
					</Button>,
					<Button
						key="close"
						onClick={handleClose}>
						닫기
					</Button>,
				]}
			/>
		);
	};

	// 에러 결과 렌더링
	const renderError = () => {
		if (!error) return null;

		return (
			<Result
				status="error"
				title="QR 코드 스캔 실패"
				subTitle={error}
				extra={[
					<Button
						key="try-again"
						type="primary"
						onClick={startScanning}
						icon={<QrcodeOutlined />}>
						다시 시도
					</Button>,
					<Button
						key="close"
						onClick={handleClose}
						icon={<CloseCircleOutlined />}>
						닫기
					</Button>,
				]}
			/>
		);
	};

	// 스캐너 렌더링
	const renderScanner = () => {
		return (
			<div className="qr-scanner-container">
				{scanning ? (
					<>
						<div className="video-container">
							<video
								ref={videoRef}
								className="scanner-video"
							/>
							<div className="scan-overlay">
								<div className="scan-marker"></div>
							</div>
						</div>
						<div className="scanning-status">
							<Spin />
							<p>QR 코드를 스캔하는 중...</p>
						</div>
						<Button
							danger
							onClick={stopScanning}
							icon={<CloseCircleOutlined />}>
							스캔 중지
						</Button>
					</>
				) : (
					<div className="scanner-start">
						<QrcodeOutlined className="scanner-icon" />
						<p>자재 QR 코드를 스캔하려면 아래 버튼을 클릭하세요.</p>
						<Button
							type="primary"
							onClick={startScanning}
							icon={<QrcodeOutlined />}
							size="large">
							스캔 시작
						</Button>
					</div>
				)}
			</div>
		);
	};

	return (
		<Modal
			title="자재 QR 코드 스캔"
			visible={visible}
			onCancel={handleClose}
			footer={null}
			width={500}
			destroyOnClose
			className="qr-scanner-modal">
			{scanResult
				? renderScanResult()
				: error
				? renderError()
				: renderScanner()}
		</Modal>
	);
};

export default MaterialQrScanner;

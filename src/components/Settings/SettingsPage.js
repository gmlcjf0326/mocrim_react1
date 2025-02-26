import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import { useTheme } from "../../contexts/ThemeContext";
import "./SettingsPage.css";

/**
 * SettingsPage Component
 *
 * Provides a comprehensive interface for managing system-wide settings,
 * user preferences, company information, and system configuration.
 */
const SettingsPage = () => {
	const { user } = useAuth();
	const { showNotification } = useNotification();
	const { theme, toggleTheme } = useTheme();

	const [activeTab, setActiveTab] = useState("general");
	const [loading, setLoading] = useState(false);
	const [generalSettings, setGeneralSettings] = useState({
		companyName: "목림상사",
		companyRegistrationNumber: "123-45-67890",
		ceoName: "김대표",
		address: "서울시 금천구 가산디지털로 123, 1234호",
		phoneNumber: "02-123-4567",
		faxNumber: "02-123-4568",
		email: "info@moklim.co.kr",
		website: "www.moklim.co.kr",
		logoFile: "moklim_logo.png",
	});

	const [userSettings, setUserSettings] = useState({
		language: "ko",
		dateFormat: "yyyy-MM-dd",
		numberFormat: "#,###",
		theme: "light",
		notificationsEnabled: true,
		emailNotifications: true,
		smsNotifications: false,
	});

	const [systemSettings, setSystemSettings] = useState({
		defaultVat: 10,
		fiscalYearStart: "01-01",
		currencySymbol: "₩",
		inventoryMethod: "FIFO",
		backupFrequency: "daily",
		retentionPeriod: 90,
		autoLogout: 30,
	});

	// Load settings on mount
	useEffect(() => {
		const fetchSettings = async () => {
			setLoading(true);
			try {
				// In a real application, this would be API calls
				// const generalResp = await api.getGeneralSettings();
				// const userResp = await api.getUserSettings(user.id);
				// const systemResp = await api.getSystemSettings();

				// setGeneralSettings(generalResp.data);
				// setUserSettings(userResp.data);
				// setSystemSettings(systemResp.data);

				// For demonstration, we're using the initial state values
				setTimeout(() => {
					setLoading(false);
				}, 500);
			} catch (error) {
				showNotification({
					title: "설정 불러오기 오류",
					message: "설정을 불러오는 중 오류가 발생했습니다.",
					type: "error",
				});
				setLoading(false);
			}
		};

		fetchSettings();
	}, [user, showNotification]);

	// Handle tab selection
	const handleTabSelect = (tab) => {
		setActiveTab(tab);
	};

	// Handle general settings form submit
	const handleGeneralSettingsSubmit = (e) => {
		e.preventDefault();

		setLoading(true);
		// In a real application, this would be an API call
		// api.updateGeneralSettings(generalSettings)
		//   .then(response => {
		//     showNotification({
		//       title: '설정 저장 완료',
		//       message: '회사 정보가 성공적으로 저장되었습니다.',
		//       type: 'success'
		//     });
		//   })
		//   .catch(error => {
		//     showNotification({
		//       title: '설정 저장 오류',
		//       message: '회사 정보 저장 중 오류가 발생했습니다.',
		//       type: 'error'
		//     });
		//   })
		//   .finally(() => {
		//     setLoading(false);
		//   });

		// For demonstration, show success notification after a delay
		setTimeout(() => {
			showNotification({
				title: "설정 저장 완료",
				message: "회사 정보가 성공적으로 저장되었습니다.",
				type: "success",
			});
			setLoading(false);
		}, 800);
	};

	// Handle user settings form submit
	const handleUserSettingsSubmit = (e) => {
		e.preventDefault();

		setLoading(true);
		// In a real application, this would be an API call
		// api.updateUserSettings(user.id, userSettings)
		//   .then(response => {
		//     showNotification({
		//       title: '설정 저장 완료',
		//       message: '사용자 설정이 성공적으로 저장되었습니다.',
		//       type: 'success'
		//     });
		//   })
		//   .catch(error => {
		//     showNotification({
		//       title: '설정 저장 오류',
		//       message: '사용자 설정 저장 중 오류가 발생했습니다.',
		//       type: 'error'
		//     });
		//   })
		//   .finally(() => {
		//     setLoading(false);
		//   });

		// For demonstration, show success notification after a delay
		setTimeout(() => {
			showNotification({
				title: "설정 저장 완료",
				message: "사용자 설정이 성공적으로 저장되었습니다.",
				type: "success",
			});
			setLoading(false);

			// Update theme if changed
			if (userSettings.theme !== theme) {
				toggleTheme();
			}
		}, 800);
	};

	// Handle system settings form submit
	const handleSystemSettingsSubmit = (e) => {
		e.preventDefault();

		setLoading(true);
		// In a real application, this would be an API call
		// api.updateSystemSettings(systemSettings)
		//   .then(response => {
		//     showNotification({
		//       title: '설정 저장 완료',
		//       message: '시스템 설정이 성공적으로 저장되었습니다.',
		//       type: 'success'
		//     });
		//   })
		//   .catch(error => {
		//     showNotification({
		//       title: '설정 저장 오류',
		//       message: '시스템 설정 저장 중 오류가 발생했습니다.',
		//       type: 'error'
		//     });
		//   })
		//   .finally(() => {
		//     setLoading(false);
		//   });

		// For demonstration, show success notification after a delay
		setTimeout(() => {
			showNotification({
				title: "설정 저장 완료",
				message: "시스템 설정이 성공적으로 저장되었습니다.",
				type: "success",
			});
			setLoading(false);
		}, 800);
	};

	// Handle general settings change
	const handleGeneralSettingsChange = (e) => {
		const { name, value } = e.target;
		setGeneralSettings((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Handle user settings change
	const handleUserSettingsChange = (e) => {
		const { name, value, type, checked } = e.target;
		setUserSettings((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	// Handle system settings change
	const handleSystemSettingsChange = (e) => {
		const { name, value } = e.target;
		setSystemSettings((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Render general settings tab
	const renderGeneralSettings = () => {
		return (
			<form
				onSubmit={handleGeneralSettingsSubmit}
				className="settings-form">
				<h3 className="settings-section-title">회사 정보</h3>

				<div className="form-group">
					<label htmlFor="companyName">회사명</label>
					<input
						type="text"
						id="companyName"
						name="companyName"
						value={generalSettings.companyName}
						onChange={handleGeneralSettingsChange}
						required
					/>
				</div>

				<div className="form-grid">
					<div className="form-group">
						<label htmlFor="companyRegistrationNumber">사업자등록번호</label>
						<input
							type="text"
							id="companyRegistrationNumber"
							name="companyRegistrationNumber"
							value={generalSettings.companyRegistrationNumber}
							onChange={handleGeneralSettingsChange}
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="ceoName">대표자명</label>
						<input
							type="text"
							id="ceoName"
							name="ceoName"
							value={generalSettings.ceoName}
							onChange={handleGeneralSettingsChange}
							required
						/>
					</div>
				</div>

				<div className="form-group">
					<label htmlFor="address">주소</label>
					<input
						type="text"
						id="address"
						name="address"
						value={generalSettings.address}
						onChange={handleGeneralSettingsChange}
						required
					/>
				</div>

				<div className="form-grid">
					<div className="form-group">
						<label htmlFor="phoneNumber">전화번호</label>
						<input
							type="text"
							id="phoneNumber"
							name="phoneNumber"
							value={generalSettings.phoneNumber}
							onChange={handleGeneralSettingsChange}
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="faxNumber">팩스번호</label>
						<input
							type="text"
							id="faxNumber"
							name="faxNumber"
							value={generalSettings.faxNumber}
							onChange={handleGeneralSettingsChange}
						/>
					</div>
				</div>

				<div className="form-grid">
					<div className="form-group">
						<label htmlFor="email">이메일</label>
						<input
							type="email"
							id="email"
							name="email"
							value={generalSettings.email}
							onChange={handleGeneralSettingsChange}
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="website">웹사이트</label>
						<input
							type="text"
							id="website"
							name="website"
							value={generalSettings.website}
							onChange={handleGeneralSettingsChange}
						/>
					</div>
				</div>

				<div className="form-group">
					<label htmlFor="logoFile">회사 로고</label>
					<div className="logo-upload">
						<div className="logo-preview">
							{/* Placeholder for logo preview */}
							<div className="logo-placeholder">로고 이미지</div>
						</div>
						<input
							type="file"
							id="logoFile"
							name="logoFile"
							accept="image/*"
							onChange={(e) => console.log("File selected:", e.target.files[0])}
						/>
						<div className="form-hint">
							권장 크기: 200x60 픽셀, 투명 배경의 PNG 파일
						</div>
					</div>
				</div>

				<div className="form-actions">
					<button
						type="submit"
						className="btn btn-primary"
						disabled={loading}>
						{loading ? "저장 중..." : "저장"}
					</button>
					<button
						type="button"
						className="btn btn-secondary"
						onClick={() => setActiveTab("user")}>
						다음: 사용자 설정
					</button>
				</div>
			</form>
		);
	};

	// Render user settings tab
	const renderUserSettings = () => {
		return (
			<form
				onSubmit={handleUserSettingsSubmit}
				className="settings-form">
				<h3 className="settings-section-title">사용자 설정</h3>

				<div className="form-grid">
					<div className="form-group">
						<label htmlFor="language">언어</label>
						<select
							id="language"
							name="language"
							value={userSettings.language}
							onChange={handleUserSettingsChange}>
							<option value="ko">한국어</option>
							<option value="en">English</option>
							<option value="ja">日本語</option>
							<option value="zh">中文</option>
						</select>
					</div>

					<div className="form-group">
						<label htmlFor="theme">테마</label>
						<select
							id="theme"
							name="theme"
							value={userSettings.theme}
							onChange={handleUserSettingsChange}>
							<option value="light">밝은 테마</option>
							<option value="dark">어두운 테마</option>
							<option value="system">시스템 기본값</option>
						</select>
					</div>
				</div>

				<div className="form-grid">
					<div className="form-group">
						<label htmlFor="dateFormat">날짜 형식</label>
						<select
							id="dateFormat"
							name="dateFormat"
							value={userSettings.dateFormat}
							onChange={handleUserSettingsChange}>
							<option value="yyyy-MM-dd">YYYY-MM-DD</option>
							<option value="dd/MM/yyyy">DD/MM/YYYY</option>
							<option value="MM/dd/yyyy">MM/DD/YYYY</option>
							<option value="yyyy년 MM월 dd일">YYYY년 MM월 DD일</option>
						</select>
					</div>

					<div className="form-group">
						<label htmlFor="numberFormat">숫자 형식</label>
						<select
							id="numberFormat"
							name="numberFormat"
							value={userSettings.numberFormat}
							onChange={handleUserSettingsChange}>
							<option value="#,###">1,234,567</option>
							<option value="# ###">1 234 567</option>
							<option value="#.###">1.234.567</option>
							<option value="plain">1234567</option>
						</select>
					</div>
				</div>

				<h3 className="settings-section-title">알림 설정</h3>

				<div className="form-group checkbox-group">
					<input
						type="checkbox"
						id="notificationsEnabled"
						name="notificationsEnabled"
						checked={userSettings.notificationsEnabled}
						onChange={handleUserSettingsChange}
					/>
					<label htmlFor="notificationsEnabled">시스템 알림 활성화</label>
				</div>

				<div className="form-group checkbox-group">
					<input
						type="checkbox"
						id="emailNotifications"
						name="emailNotifications"
						checked={userSettings.emailNotifications}
						onChange={handleUserSettingsChange}
						disabled={!userSettings.notificationsEnabled}
					/>
					<label htmlFor="emailNotifications">이메일 알림 받기</label>
				</div>

				<div className="form-group checkbox-group">
					<input
						type="checkbox"
						id="smsNotifications"
						name="smsNotifications"
						checked={userSettings.smsNotifications}
						onChange={handleUserSettingsChange}
						disabled={!userSettings.notificationsEnabled}
					/>
					<label htmlFor="smsNotifications">SMS 알림 받기</label>
				</div>

				<div className="form-actions">
					<button
						type="submit"
						className="btn btn-primary"
						disabled={loading}>
						{loading ? "저장 중..." : "저장"}
					</button>
					<button
						type="button"
						className="btn btn-secondary"
						onClick={() => setActiveTab("system")}>
						다음: 시스템 설정
					</button>
				</div>
			</form>
		);
	};

	// Render system settings tab
	const renderSystemSettings = () => {
		return (
			<form
				onSubmit={handleSystemSettingsSubmit}
				className="settings-form">
				<h3 className="settings-section-title">시스템 설정</h3>

				<div className="form-grid">
					<div className="form-group">
						<label htmlFor="defaultVat">기본 부가세율 (%)</label>
						<input
							type="number"
							id="defaultVat"
							name="defaultVat"
							min="0"
							max="100"
							step="0.1"
							value={systemSettings.defaultVat}
							onChange={handleSystemSettingsChange}
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="fiscalYearStart">회계년도 시작</label>
						<input
							type="text"
							id="fiscalYearStart"
							name="fiscalYearStart"
							value={systemSettings.fiscalYearStart}
							onChange={handleSystemSettingsChange}
							placeholder="MM-DD"
							required
						/>
					</div>
				</div>

				<div className="form-grid">
					<div className="form-group">
						<label htmlFor="currencySymbol">통화 기호</label>
						<input
							type="text"
							id="currencySymbol"
							name="currencySymbol"
							value={systemSettings.currencySymbol}
							onChange={handleSystemSettingsChange}
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="inventoryMethod">재고 계산 방식</label>
						<select
							id="inventoryMethod"
							name="inventoryMethod"
							value={systemSettings.inventoryMethod}
							onChange={handleSystemSettingsChange}>
							<option value="FIFO">선입선출법 (FIFO)</option>
							<option value="LIFO">후입선출법 (LIFO)</option>
							<option value="AVCO">평균법 (Average Cost)</option>
						</select>
					</div>
				</div>

				<h3 className="settings-section-title">데이터 관리</h3>

				<div className="form-grid">
					<div className="form-group">
						<label htmlFor="backupFrequency">자동 백업 주기</label>
						<select
							id="backupFrequency"
							name="backupFrequency"
							value={systemSettings.backupFrequency}
							onChange={handleSystemSettingsChange}>
							<option value="daily">매일</option>
							<option value="weekly">매주</option>
							<option value="biweekly">격주</option>
							<option value="monthly">매월</option>
							<option value="never">백업 안함</option>
						</select>
					</div>

					<div className="form-group">
						<label htmlFor="retentionPeriod">백업 유지 기간 (일)</label>
						<input
							type="number"
							id="retentionPeriod"
							name="retentionPeriod"
							min="1"
							value={systemSettings.retentionPeriod}
							onChange={handleSystemSettingsChange}
							required
						/>
					</div>
				</div>

				<div className="form-group">
					<label htmlFor="autoLogout">자동 로그아웃 (분)</label>
					<input
						type="number"
						id="autoLogout"
						name="autoLogout"
						min="0"
						max="180"
						value={systemSettings.autoLogout}
						onChange={handleSystemSettingsChange}
						required
					/>
					<div className="form-hint">
						0으로 설정하면 자동 로그아웃 기능이 비활성화됩니다.
					</div>
				</div>

				<div className="system-actions">
					<div className="action-buttons">
						<button
							type="button"
							className="btn btn-warning">
							데이터 초기화
						</button>
						<button
							type="button"
							className="btn btn-warning">
							캐시 삭제
						</button>
						<button
							type="button"
							className="btn btn-primary">
							지금 백업하기
						</button>
					</div>
				</div>

				<div className="form-actions">
					<button
						type="submit"
						className="btn btn-primary"
						disabled={loading}>
						{loading ? "저장 중..." : "저장"}
					</button>
					<button
						type="button"
						className="btn btn-secondary"
						onClick={() => setActiveTab("general")}>
						처음으로 돌아가기
					</button>
				</div>
			</form>
		);
	};

	return (
		<div className="settings-page">
			<div className="settings-header">
				<h2 className="page-title">설정</h2>
				<p className="page-description">
					ERP 시스템의 각종 설정을 관리할 수 있습니다.
				</p>
			</div>

			<div className="settings-content">
				<div className="settings-tabs">
					<button
						className={`tab-button ${activeTab === "general" ? "active" : ""}`}
						onClick={() => handleTabSelect("general")}>
						회사 정보
					</button>
					<button
						className={`tab-button ${activeTab === "user" ? "active" : ""}`}
						onClick={() => handleTabSelect("user")}>
						사용자 설정
					</button>
					<button
						className={`tab-button ${activeTab === "system" ? "active" : ""}`}
						onClick={() => handleTabSelect("system")}>
						시스템 설정
					</button>
				</div>

				<div className="settings-tab-content">
					{activeTab === "general" && renderGeneralSettings()}
					{activeTab === "user" && renderUserSettings()}
					{activeTab === "system" && renderSystemSettings()}
				</div>
			</div>
		</div>
	);
};

export default SettingsPage;

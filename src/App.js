import React, { useEffect } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
	useLocation,
} from "react-router-dom";
import "./AppStyles.css";

// Import dashboard components
import Dashboard from "./components/Dashboard/Dashboard";
import VendorManagement from "./components/VendorManagement/VendorManagement";
import InventoryManagement from "./components/InventoryManagement/InventoryManagement";
import ProductionManagement from "./components/ProductionManagement/ProductionManagement";
import OrderManagement from "./components/OrderManagement/OrderManagement";
import FinancialManagement from "./components/FinancialManagement/FinancialManagement";
import SettingsPage from "./components/Settings/SettingsPage";
import NotFoundPage from "./components/common/NotFoundPage";
import FloorInventoryManagement from "./components/InventoryManagement/FloorInventoryManagement";
import Floor2OrderManagement from "./components/OrderManagement/Floor2OrderManagement";
import Floor4OrderManagement from "./components/OrderManagement/Floor4OrderManagement";

// Import layout components
import MainLayout from "./components/layouts/MainLayout";
import LoginPage from "./components/auth/LoginPage";

// Import context providers
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ThemeProvider } from "./contexts/ThemeContext";

const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, isLoading } = useAuth();
	const location = useLocation();

	if (isLoading) {
		return <div className="loading-screen">Loading...</div>;
	}

	if (!isAuthenticated) {
		return (
			<Navigate
				to="/login"
				state={{ from: location }}
				replace
			/>
		);
	}

	return children;
};

const AppRoutes = () => {
	const location = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [location.pathname]);

	useEffect(() => {
		// 현재 경로 확인
		const currentPath = window.location.pathname;

		// 버튼 요소 가져오기
		const vendorBtn = document.querySelector(
			'.vendor-type-btn[data-type="vendor"]'
		);
		const processorBtn = document.querySelector(
			'.vendor-type-btn[data-type="processor"]'
		);

		// 모든 버튼에서 active 클래스 제거
		document.querySelectorAll(".vendor-type-btn").forEach((btn) => {
			btn.classList.remove("active");
		});

		// VendorManagement 컴포넌트의 상태 업데이트를 위한 이벤트 발생
		let vendorType = "vendor"; // 기본값

		// 경로에 따라 해당 버튼 활성화 및 데이터 타입 설정
		if (currentPath.includes("/purchase/vendors")) {
			vendorBtn?.classList.add("active");
			vendorType = "vendor";
		} else if (currentPath.includes("/purchase/processors")) {
			processorBtn?.classList.add("active");
			vendorType = "processor";
		}

		// 커스텀 이벤트를 통해 VendorManagement 컴포넌트에 데이터 타입 변경 알림
		const event = new CustomEvent("vendorTypeChange", {
			detail: { vendorType },
		});
		document.dispatchEvent(event);
	}, [window.location.pathname]);

	return (
		<Routes>
			<Route
				path="/login"
				element={<LoginPage />}
			/>

			<Route
				path="/"
				element={
					<ProtectedRoute>
						<MainLayout />
					</ProtectedRoute>
				}>
				<Route
					index
					element={<Dashboard />}
				/>

				<Route path="purchase">
					{/* Removed dashboard redirect */}
					<Route
						path="vendors"
						element={<VendorManagement initialVendorType="vendor" />}
					/>
					<Route
						path="processors"
						element={<VendorManagement initialVendorType="processor" />}
					/>
					<Route
						path="inventory"
						element={<InventoryManagement inventoryType="raw-material" />}
					/>
					{/* Keep dashboard as an explicit route */}
					<Route
						path="dashboard"
						element={<Dashboard module="purchase" />}
					/>
				</Route>

				<Route path="production">
					{/* Removed dashboard redirect */}
					<Route
						path="woodesty"
						element={<ProductionManagement initialProductionType="woodesty" />}
					/>
					<Route
						path="outsourced"
						element={
							<ProductionManagement initialProductionType="outsourced" />
						}
					/>
					<Route
						path="daehwadong"
						element={
							<ProductionManagement initialProductionType="daehwadong" />
						}
					/>
					{/* Keep dashboard as an explicit route */}
					<Route
						path="dashboard"
						element={<Dashboard module="production" />}
					/>
				</Route>

				<Route path="orders">
					{/* Removed dashboard redirect */}
					<Route
						path="dashboard"
						element={<Dashboard module="orders" />}
					/>
					<Route
						path="management"
						element={<OrderManagement />}
					/>
					<Route
						path="management/floor2"
						element={<Floor2OrderManagement />}
					/>
					<Route
						path="management/floor4"
						element={<Floor4OrderManagement />}
					/>
					<Route
						path="inventory"
						element={<InventoryManagement inventoryType="product" />}
					/>
				</Route>

				<Route path="financial">
					{/* Removed dashboard redirect */}
					<Route
						path="collection"
						element={<FinancialManagement type="collection" />}
					/>
					<Route
						path="payment"
						element={<FinancialManagement type="payment" />}
					/>
					{/* Keep dashboard as an explicit route */}
					<Route
						path="dashboard"
						element={<Dashboard module="financial" />}
					/>
				</Route>

				<Route
					path="settings"
					element={<SettingsPage />}
				/>
			</Route>

			<Route
				path="*"
				element={<NotFoundPage />}
			/>

			{/* 층별 자재관리 라우트 */}
			<Route
				path="/floor/inventory"
				element={<FloorInventoryManagement />}
			/>
		</Routes>
	);
};

const App = () => {
	return (
		<ThemeProvider>
			<AuthProvider>
				<NotificationProvider>
					<Router>
						<AppRoutes />
					</Router>
				</NotificationProvider>
			</AuthProvider>
		</ThemeProvider>
	);
};

export default App;

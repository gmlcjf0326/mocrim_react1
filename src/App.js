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
					<Route
						index
						element={
							<Navigate
								to="/purchase/dashboard"
								replace
							/>
						}
					/>
					<Route
						path="dashboard"
						element={<Dashboard module="purchase" />}
					/>
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
				</Route>

				<Route path="production">
					<Route
						index
						element={
							<Navigate
								to="/production/dashboard"
								replace
							/>
						}
					/>
					<Route
						path="dashboard"
						element={<Dashboard module="production" />}
					/>
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
				</Route>

				<Route path="orders">
					<Route
						index
						element={
							<Navigate
								to="/orders/dashboard"
								replace
							/>
						}
					/>
					<Route
						path="dashboard"
						element={<Dashboard module="orders" />}
					/>
					<Route
						path="list"
						element={<OrderManagement view="list" />}
					/>
					<Route
						path="create"
						element={<OrderManagement view="create" />}
					/>
					<Route
						path="details/:orderId"
						element={<OrderManagement view="details" />}
					/>
					<Route
						path="process/:orderId"
						element={<OrderManagement view="process" />}
					/>
				</Route>

				<Route path="financial">
					<Route
						index
						element={
							<Navigate
								to="/financial/dashboard"
								replace
							/>
						}
					/>
					<Route
						path="dashboard"
						element={<Dashboard module="financial" />}
					/>
					<Route
						path="collection"
						element={<FinancialManagement type="collection" />}
					/>
					<Route
						path="payment"
						element={<FinancialManagement type="payment" />}
					/>
				</Route>

				<Route
					path="settings"
					element={<SettingsPage />}
				/>

				<Route path="inventory">
					<Route
						index
						element={
							<Navigate
								to="/inventory/list"
								replace
							/>
						}
					/>
					<Route
						path="list"
						element={<InventoryManagement view="list" />}
					/>
					<Route
						path="scan"
						element={<InventoryManagement view="scan" />}
					/>
					<Route
						path="details/:itemId"
						element={<InventoryManagement view="details" />}
					/>
					<Route
						path="transaction/:itemId"
						element={<InventoryManagement view="transaction" />}
					/>
				</Route>
			</Route>

			<Route
				path="*"
				element={<NotFoundPage />}
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

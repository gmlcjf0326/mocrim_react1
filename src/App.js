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
						path="management"
						element={<OrderManagement />}
					/>
					<Route
						path="inventory"
						element={<InventoryManagement inventoryType="product" />}
					/>
					{/* Keep dashboard as an explicit route */}
					<Route
						path="dashboard"
						element={<Dashboard module="orders" />}
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

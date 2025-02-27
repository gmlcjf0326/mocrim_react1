import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import "./MainLayout.css";
import PropTypes from "prop-types";

// Import navigation components
import Header from "../navigation/Header";
import Sidebar from "../navigation/Sidebar";
import QuickActions from "../common/QuickActions";
import NotificationPanel from "../common/NotificationPanel";

/**
 * MainLayout component - provides the layout structure for all authenticated pages
 * Includes header, sidebar, notification system and outlet for page content
 */
const MainLayout = ({ children }) => {
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const { user, logout } = useAuth();
	const { notifications, showNotification } = useNotification();
	const navigate = useNavigate();
	const location = useLocation();

	// Extract the current module from the URL path
	const getCurrentModule = () => {
		const path = location.pathname.split("/")[1];
		switch (path) {
			case "purchase":
				return "purchase";
			case "production":
				return "production";
			case "orders":
				return "orders";
			case "financial":
				return "financial";
			case "settings":
				return "settings";
			default:
				return "dashboard";
		}
	};

	const [activeModule, setActiveModule] = useState(getCurrentModule());

	// Update active module when location changes
	useEffect(() => {
		setActiveModule(getCurrentModule());
		// Close mobile menu on navigation
		setMobileMenuOpen(false);
	}, [location.pathname]);

	// Handle logout action
	const handleLogout = async () => {
		try {
			await logout();
			navigate("/login");
		} catch (error) {
			showNotification({
				title: "로그아웃 오류",
				message: "로그아웃 처리 중 오류가 발생했습니다.",
				type: "error",
			});
		}
	};

	// Toggle sidebar collapsed state
	const toggleSidebar = () => {
		setSidebarCollapsed(!sidebarCollapsed);
	};

	// Toggle mobile menu state
	const toggleMobileMenu = () => {
		setMobileMenuOpen(!mobileMenuOpen);
	};

	return (
		<div
			className={`main-layout ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
			{/* Header component */}
			<Header
				user={user}
				onLogout={handleLogout}
				onToggleSidebar={toggleSidebar}
				onToggleMobileMenu={toggleMobileMenu}
				sidebarCollapsed={sidebarCollapsed}
				activeModule={activeModule}
			/>

			{/* Main content area with sidebar and page content */}
			<div className="main-content-wrapper">
				<Sidebar
					activeModule={activeModule}
					collapsed={sidebarCollapsed}
					mobileOpen={mobileMenuOpen}
					onCloseMobileMenu={() => setMobileMenuOpen(false)}
				/>

				<main className="page-content">
					{/* Outlet for page components */}
					<Outlet />
				</main>
			</div>

			{/* Quick action buttons */}
			<QuickActions activeModule={activeModule} />

			{/* Notification panel */}
			<NotificationPanel notifications={notifications} />
		</div>
	);
};

MainLayout.propTypes = {
	children: PropTypes.node.isRequired,
};

export default MainLayout;

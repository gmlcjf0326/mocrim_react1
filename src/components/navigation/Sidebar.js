import React from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

/**
 * Sidebar Navigation Component
 *
 * Provides contextual navigation based on the active module
 * and supports collapsed/expanded states for responsive layouts
 */
const Sidebar = ({
	activeModule,
	collapsed,
	mobileOpen,
	onCloseMobileMenu,
}) => {
	// Render different navigation items based on active module
	const renderNavigationItems = () => {
		switch (activeModule) {
			case "purchase":
				return (
					<>
						<li className="sidebar-menu-item">
							<NavLink
								to="/purchase/dashboard"
								className={({ isActive }) => (isActive ? "active" : "")}>
								<span className="sidebar-icon">📊</span>
								{!collapsed && <span className="sidebar-label">대시보드</span>}
							</NavLink>
						</li>
						<li className="sidebar-menu-item">
							<NavLink
								to="/purchase/vendors"
								className={({ isActive }) => (isActive ? "active" : "")}>
								<span className="sidebar-icon">🏢</span>
								{!collapsed && (
									<span className="sidebar-label">매입사 관리</span>
								)}
							</NavLink>
						</li>
						<li className="sidebar-menu-item">
							<NavLink
								to="/purchase/processors"
								className={({ isActive }) => (isActive ? "active" : "")}>
								<span className="sidebar-icon">🏭</span>
								{!collapsed && (
									<span className="sidebar-label">임가공사 관리</span>
								)}
							</NavLink>
						</li>
						<li className="sidebar-menu-item">
							<NavLink
								to="/purchase/inventory"
								className={({ isActive }) => (isActive ? "active" : "")}>
								<span className="sidebar-icon">📦</span>
								{!collapsed && (
									<span className="sidebar-label">원자재 관리</span>
								)}
							</NavLink>
						</li>
					</>
				);
			case "production":
				return (
					<>
						<li className="sidebar-menu-item">
							<NavLink
								to="/production/dashboard"
								className={({ isActive }) => (isActive ? "active" : "")}>
								<span className="sidebar-icon">📊</span>
								{!collapsed && <span className="sidebar-label">대시보드</span>}
							</NavLink>
						</li>
						<li className="sidebar-menu-item">
							<NavLink
								to="/production/woodesty"
								className={({ isActive }) => (isActive ? "active" : "")}>
								<span className="sidebar-icon">🪵</span>
								{!collapsed && (
									<span className="sidebar-label">우드에스티 생산</span>
								)}
							</NavLink>
						</li>
						<li className="sidebar-menu-item">
							<NavLink
								to="/production/outsourced"
								className={({ isActive }) => (isActive ? "active" : "")}>
								<span className="sidebar-icon">🔄</span>
								{!collapsed && (
									<span className="sidebar-label">외부임가공 관리</span>
								)}
							</NavLink>
						</li>
						<li className="sidebar-menu-item">
							<NavLink
								to="/production/daehwadong"
								className={({ isActive }) => (isActive ? "active" : "")}>
								<span className="sidebar-icon">🏗️</span>
								{!collapsed && (
									<span className="sidebar-label">대화동공장 생산</span>
								)}
							</NavLink>
						</li>
					</>
				);
			case "orders":
				return (
					<>
						<li className="sidebar-menu-item">
							<NavLink
								to="/orders/dashboard"
								className={({ isActive }) => (isActive ? "active" : "")}>
								<span className="sidebar-icon">📊</span>
								{!collapsed && <span className="sidebar-label">대시보드</span>}
							</NavLink>
						</li>
						<li className="sidebar-menu-item">
							<NavLink
								to="/orders/management"
								className={({ isActive }) => (isActive ? "active" : "")}>
								<span className="sidebar-icon">📋</span>
								{!collapsed && <span className="sidebar-label">수주 관리</span>}
							</NavLink>
						</li>
						<li className="sidebar-menu-item">
							<NavLink
								to="/orders/inventory"
								className={({ isActive }) => (isActive ? "active" : "")}>
								<span className="sidebar-icon">📦</span>
								{!collapsed && (
									<span className="sidebar-label">제품 재고 관리</span>
								)}
							</NavLink>
						</li>
					</>
				);
			case "financial":
				return (
					<>
						<li className="sidebar-menu-item">
							<NavLink
								to="/financial/dashboard"
								className={({ isActive }) => (isActive ? "active" : "")}>
								<span className="sidebar-icon">📊</span>
								{!collapsed && <span className="sidebar-label">대시보드</span>}
							</NavLink>
						</li>
						<li className="sidebar-menu-item">
							<NavLink
								to="/financial/collection"
								className={({ isActive }) => (isActive ? "active" : "")}>
								<span className="sidebar-icon">💰</span>
								{!collapsed && <span className="sidebar-label">수금 관리</span>}
							</NavLink>
						</li>
						<li className="sidebar-menu-item">
							<NavLink
								to="/financial/payment"
								className={({ isActive }) => (isActive ? "active" : "")}>
								<span className="sidebar-icon">💸</span>
								{!collapsed && <span className="sidebar-label">지급 관리</span>}
							</NavLink>
						</li>
					</>
				);
			case "settings":
				return (
					<>
						<li className="sidebar-menu-item">
							<NavLink
								to="/settings"
								className={({ isActive }) => (isActive ? "active" : "")}>
								<span className="sidebar-icon">⚙️</span>
								{!collapsed && (
									<span className="sidebar-label">시스템 설정</span>
								)}
							</NavLink>
						</li>
					</>
				);
			default:
				return (
					<>
						<li className="sidebar-menu-item">
							<NavLink
								to="/"
								className={({ isActive }) => (isActive ? "active" : "")}>
								<span className="sidebar-icon">🏠</span>
								{!collapsed && <span className="sidebar-label">홈</span>}
							</NavLink>
						</li>
						<li className="sidebar-menu-item">
							<NavLink
								to="/purchase/dashboard"
								className={({ isActive }) => (isActive ? "active" : "")}>
								<span className="sidebar-icon">📦</span>
								{!collapsed && <span className="sidebar-label">매입 관리</span>}
							</NavLink>
						</li>
						<li className="sidebar-menu-item">
							<NavLink
								to="/production/dashboard"
								className={({ isActive }) => (isActive ? "active" : "")}>
								<span className="sidebar-icon">🏭</span>
								{!collapsed && <span className="sidebar-label">생산 관리</span>}
							</NavLink>
						</li>
						<li className="sidebar-menu-item">
							<NavLink
								to="/orders/dashboard"
								className={({ isActive }) => (isActive ? "active" : "")}>
								<span className="sidebar-icon">📋</span>
								{!collapsed && (
									<span className="sidebar-label">수주/출고 관리</span>
								)}
							</NavLink>
						</li>
						<li className="sidebar-menu-item">
							<NavLink
								to="/financial/dashboard"
								className={({ isActive }) => (isActive ? "active" : "")}>
								<span className="sidebar-icon">💰</span>
								{!collapsed && (
									<span className="sidebar-label">수금/지급 관리</span>
								)}
							</NavLink>
						</li>
					</>
				);
		}
	};

	return (
		<aside
			className={`sidebar ${collapsed ? "collapsed" : ""} ${
				mobileOpen ? "mobile-open" : ""
			}`}>
			{mobileOpen && (
				<div
					className="sidebar-mobile-close"
					onClick={onCloseMobileMenu}>
					&times;
				</div>
			)}

			<div className="sidebar-header">
				{!collapsed && (
					<h3>
						{activeModule === "purchase"
							? "매입 관리"
							: activeModule === "production"
							? "생산 관리"
							: activeModule === "orders"
							? "수주/출고 관리"
							: activeModule === "financial"
							? "수금/지급 관리"
							: activeModule === "settings"
							? "설정"
							: "목림상사 ERP"}
					</h3>
				)}
				{collapsed && <div className="collapsed-logo">M</div>}
			</div>

			<nav className="sidebar-nav">
				<ul className="sidebar-menu">{renderNavigationItems()}</ul>
			</nav>

			{!collapsed && (
				<div className="sidebar-footer">
					<div className="version-info">v1.0.0</div>
				</div>
			)}
		</aside>
	);
};

Sidebar.propTypes = {
	activeModule: PropTypes.oneOf([
		"dashboard",
		"purchase",
		"production",
		"orders",
		"financial",
		"settings",
	]).isRequired,
	collapsed: PropTypes.bool.isRequired,
	mobileOpen: PropTypes.bool.isRequired,
	onCloseMobileMenu: PropTypes.func.isRequired,
};

export default Sidebar;

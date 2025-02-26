import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

/**
 * Header Component
 *
 * Main application header with navigation controls and user account information
 */
const Header = ({
	user,
	onLogout,
	onToggleSidebar,
	onToggleMobileMenu,
	sidebarCollapsed,
	activeModule,
}) => {
	// Get the module title based on active module
	const getModuleTitle = () => {
		switch (activeModule) {
			case "purchase":
				return "매입 관리 시스템";
			case "production":
				return "생산 관리 시스템";
			case "orders":
				return "수주/출고 관리 시스템";
			case "financial":
				return "수금/지급 관리 시스템";
			case "settings":
				return "시스템 설정";
			default:
				return "목림상사 ERP 시스템";
		}
	};

	return (
		<header className="header">
			<div className="header-left">
				<button
					className="sidebar-toggle-btn"
					onClick={onToggleSidebar}
					aria-label={sidebarCollapsed ? "사이드바 열기" : "사이드바 닫기"}>
					{sidebarCollapsed ? "☰" : "✕"}
				</button>

				<button
					className="mobile-menu-btn"
					onClick={onToggleMobileMenu}
					aria-label="모바일 메뉴 열기">
					☰
				</button>

				<h1 className="app-title">
					<Link to="/">{getModuleTitle()}</Link>
				</h1>
			</div>

			<div className="header-center">
				<nav className="main-nav">
					<ul className="main-nav-list">
						<li
							className={`main-nav-item ${
								activeModule === "dashboard" ? "active" : ""
							}`}>
							<Link to="/">홈</Link>
						</li>
						<li
							className={`main-nav-item ${
								activeModule === "purchase" ? "active" : ""
							}`}>
							<Link to="/purchase/dashboard">매입</Link>
						</li>
						<li
							className={`main-nav-item ${
								activeModule === "production" ? "active" : ""
							}`}>
							<Link to="/production/dashboard">생산</Link>
						</li>
						<li
							className={`main-nav-item ${
								activeModule === "orders" ? "active" : ""
							}`}>
							<Link to="/orders/dashboard">수주/출고</Link>
						</li>
						<li
							className={`main-nav-item ${
								activeModule === "financial" ? "active" : ""
							}`}>
							<Link to="/financial/dashboard">수금/지급</Link>
						</li>
						<li
							className={`main-nav-item ${
								activeModule === "settings" ? "active" : ""
							}`}>
							<Link to="/settings">설정</Link>
						</li>
					</ul>
				</nav>
			</div>

			<div className="header-right">
				<div className="header-notifications">
					<button className="notification-btn">
						<span className="notification-icon">🔔</span>
						<span className="notification-count">3</span>
					</button>
				</div>

				<div className="user-menu">
					<div className="user-info">
						<div className="user-avatar">{user?.name?.charAt(0) || "A"}</div>
						<span className="user-name">{user?.name || "관리자"}</span>
					</div>

					<div className="user-dropdown">
						<button className="dropdown-toggle">▼</button>
						<div className="dropdown-menu">
							<ul>
								<li>
									<button className="dropdown-item">내 정보</button>
								</li>
								<li>
									<button className="dropdown-item">설정</button>
								</li>
								<li>
									<hr className="dropdown-divider" />
								</li>
								<li>
									<button
										className="dropdown-item"
										onClick={onLogout}>
										로그아웃
									</button>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};

Header.propTypes = {
	user: PropTypes.shape({
		name: PropTypes.string,
		role: PropTypes.string,
	}),
	onLogout: PropTypes.func.isRequired,
	onToggleSidebar: PropTypes.func.isRequired,
	onToggleMobileMenu: PropTypes.func.isRequired,
	sidebarCollapsed: PropTypes.bool.isRequired,
	activeModule: PropTypes.string.isRequired,
};

export default Header;

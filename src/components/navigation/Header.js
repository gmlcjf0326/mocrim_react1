import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

const Header = ({ onSidebarToggle, username, collapsed }) => {
	const [userMenuOpen, setUserMenuOpen] = useState(false);
	const [notificationsOpen, setNotificationsOpen] = useState(false);
	const location = useLocation();

	const isActive = (path) => {
		return location.pathname.startsWith(path);
	};

	const toggleUserMenu = () => {
		setUserMenuOpen(!userMenuOpen);
		if (notificationsOpen) setNotificationsOpen(false);
	};

	const toggleNotifications = () => {
		setNotificationsOpen(!notificationsOpen);
		if (userMenuOpen) setUserMenuOpen(false);
	};

	return (
		<header className="app-header">
			<div className="header-left">
				<button
					className="sidebar-toggle"
					onClick={onSidebarToggle}>
					{collapsed ? "≡" : "×"}
				</button>
				<div className="header-logo-container">
					<div className="app-logo">M</div>
					<h1 className="app-title">목림상사 ERP</h1>
				</div>
			</div>

			<div className="header-nav">
				<nav className="main-nav">
					<ul className="nav-menu">
						<li className="nav-item">
							<Link
								to="/"
								className={`nav-link ${
									location.pathname === "/" ? "active" : ""
								}`}>
								홈
							</Link>
						</li>
						<li className="nav-item">
							<Link
								to="/purchase"
								className={`nav-link ${isActive("/purchase") ? "active" : ""}`}>
								매입관리
							</Link>
						</li>
						<li className="nav-item">
							<Link
								to="/production"
								className={`nav-link ${
									isActive("/production") ? "active" : ""
								}`}>
								생산관리
							</Link>
						</li>
						<li className="nav-item">
							<Link
								to="/orders"
								className={`nav-link ${isActive("/orders") ? "active" : ""}`}>
								수주/출고 관리
							</Link>
						</li>
						<li className="nav-item">
							<Link
								to="/financial"
								className={`nav-link ${
									isActive("/financial") ? "active" : ""
								}`}>
								수금/지급 관리
							</Link>
						</li>
					</ul>
				</nav>
			</div>

			<div className="header-right">
				<button className="mobile-menu-toggle">☰</button>

				<div className="header-actions">
					<div className="notification-wrapper">
						<button
							className="notification-button"
							onClick={toggleNotifications}
							aria-label="알림">
							<span className="notification-icon">🔔</span>
							<span className="notification-badge">3</span>
						</button>

						{notificationsOpen && (
							<div className="dropdown-menu notification-dropdown">
								<ul className="dropdown-list">
									<li className="dropdown-item">새로운 알림이 있습니다.</li>
									<li className="dropdown-item">
										시스템 업데이트가 완료되었습니다.
									</li>
									<li className="dropdown-item">모든 알림 보기</li>
								</ul>
							</div>
						)}
					</div>

					<div className="user-wrapper">
						<button
							className="user-button"
							onClick={toggleUserMenu}
							aria-label="사용자 메뉴">
							<div className="user-avatar">👤</div>
							<span className="username">{username || "사용자"}</span>
						</button>

						{userMenuOpen && (
							<div className="dropdown-menu user-dropdown">
								<ul className="dropdown-list">
									<li className="dropdown-item">
										<span className="dropdown-icon">👤</span>내 프로필
									</li>
									<li className="dropdown-item">
										<span className="dropdown-icon">⚙️</span>
										설정
									</li>
									<li className="dropdown-divider"></li>
									<li className="dropdown-item">
										<span className="dropdown-icon">🚪</span>
										로그아웃
									</li>
								</ul>
							</div>
						)}
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;

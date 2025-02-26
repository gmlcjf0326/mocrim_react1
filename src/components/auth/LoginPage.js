import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./LoginPage.css";

/**
 * LoginPage Component
 *
 * Handles user authentication with form validation, error handling,
 * and redirect to the appropriate page after successful login
 */
const LoginPage = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [showPassword, setShowPassword] = useState(false);

	const { login } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	// Determine where to redirect after login
	const from = location.state?.from?.pathname || "/";

	// Form validation
	const isFormValid = username.trim() !== "" && password.trim() !== "";

	// Handle login form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!isFormValid) {
			setError("사용자 이름과 비밀번호를 입력해주세요.");
			return;
		}

		setLoading(true);
		setError(null);

		try {
			await login(username, password);
			// Navigate to the page the user was trying to access
			navigate(from, { replace: true });
		} catch (err) {
			setError("로그인에 실패했습니다. 사용자 이름과 비밀번호를 확인해주세요.");
			setLoading(false);
		}
	};

	// Toggle password visibility
	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div className="login-page">
			<div className="login-container">
				<div className="login-header">
					<h1>목림상사 ERP 시스템</h1>
					<p className="login-subtitle">로그인하여 시스템에 접속하세요</p>
				</div>

				{error && <div className="error-message">{error}</div>}

				<form
					className="login-form"
					onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="username">사용자 이름</label>
						<input
							type="text"
							id="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							placeholder="사용자 이름을 입력하세요"
							disabled={loading}
							autoFocus
						/>
					</div>

					<div className="form-group">
						<label htmlFor="password">비밀번호</label>
						<div className="password-input-wrapper">
							<input
								type={showPassword ? "text" : "password"}
								id="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="비밀번호를 입력하세요"
								disabled={loading}
							/>
							<button
								type="button"
								className="toggle-password-btn"
								onClick={togglePasswordVisibility}
								tabIndex="-1">
								{showPassword ? "숨기기" : "보기"}
							</button>
						</div>
					</div>

					<div className="form-actions">
						<button
							type="submit"
							className="login-button"
							disabled={loading || !isFormValid}>
							{loading ? "로그인 중..." : "로그인"}
						</button>
					</div>

					<div className="login-help">
						<div className="login-help-text">
							<p>* 테스트 계정: admin / password</p>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default LoginPage;

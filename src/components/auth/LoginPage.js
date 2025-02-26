import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const LoginPage = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const { login } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const from = location.state?.from?.pathname || "/";

	const handleSubmit = (e) => {
		e.preventDefault();
		setError("");

		// Simple validation
		if (!username || !password) {
			setError("아이디와 비밀번호를 입력해주세요.");
			return;
		}

		// Mock login - in a real app, this would call an API
		if (username === "admin" && password === "password") {
			login({ name: "관리자", role: "admin" });
			navigate(from, { replace: true });
		} else {
			setError("아이디 또는 비밀번호가 올바르지 않습니다.");
		}
	};

	return (
		<div className="login-page">
			<div className="login-container">
				<h1>목림상사 ERP 시스템</h1>
				<form
					onSubmit={handleSubmit}
					className="login-form">
					{error && <div className="error-message">{error}</div>}
					<div className="form-group">
						<label htmlFor="username">아이디</label>
						<input
							type="text"
							id="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>
					<div className="form-group">
						<label htmlFor="password">비밀번호</label>
						<input
							type="password"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<button
						type="submit"
						className="login-button">
						로그인
					</button>
				</form>
			</div>
		</div>
	);
};

export default LoginPage;

import React from "react";
import { Link } from "react-router-dom";
import "./NotFoundPage.css";

/**
 * NotFoundPage Component
 *
 * Displays a user-friendly 404 error page with navigation options
 */
const NotFoundPage = () => {
	return (
		<div className="not-found-page">
			<div className="not-found-container">
				<div className="not-found-code">404</div>
				<h1 className="not-found-title">페이지를 찾을 수 없습니다</h1>
				<p className="not-found-message">
					요청하신 페이지가 삭제되었거나, 이름이 변경되었거나, 일시적으로 사용할
					수 없습니다.
				</p>
				<div className="not-found-actions">
					<Link
						to="/"
						className="not-found-button primary">
						홈으로 이동
					</Link>
					<button
						onClick={() => window.history.back()}
						className="not-found-button secondary">
						이전 페이지로 돌아가기
					</button>
				</div>
			</div>
		</div>
	);
};

export default NotFoundPage;

import React from "react";
import { Link } from "react-router-dom";

/**
 * NotFoundPage Component
 *
 * Displayed when users navigate to a route that doesn't exist
 */
const NotFoundPage = () => {
	return (
		<div className="not-found-page">
			<div className="not-found-container">
				<div className="not-found-status">404</div>
				<h1 className="not-found-title">페이지를 찾을 수 없습니다</h1>
				<p className="not-found-message">
					요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
				</p>
				<div className="not-found-actions">
					<Link
						to="/"
						className="btn btn-primary">
						홈으로 돌아가기
					</Link>
				</div>
			</div>
		</div>
	);
};

export default NotFoundPage;

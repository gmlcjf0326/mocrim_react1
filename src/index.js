import React from "react";
import ReactDOM from "react-dom/client"; // ✅ 변경된 import
import App from "./App"; // App 컴포넌트 import
import "./AppStyles.css"; // 스타일 import

const root = ReactDOM.createRoot(document.getElementById("root")); // ✅ 변경된 코드
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);

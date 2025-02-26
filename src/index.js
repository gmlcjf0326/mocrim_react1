import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // Base CSS with theme variables
import "./AppStyles.css"; // Additional global styles

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);

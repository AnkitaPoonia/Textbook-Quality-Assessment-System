import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import App from "./App.jsx";

// Opt-in to v7 future flags to remove warnings
const routerFutureFlags = {
	v7_startTransition: true,
	v7_relativeSplatPath: true,
};

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter future={routerFutureFlags}>
			<AuthProvider>
				<App />
			</AuthProvider>
		</BrowserRouter>
	</StrictMode>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app";
import "./global.css";

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

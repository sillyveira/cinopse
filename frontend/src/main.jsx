import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/Auth.jsx";
import { DataProvider } from "./context/DataContext.jsx";
import {ToastContainer} from "react-toastify"
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <DataProvider>
        <App />
        <ToastContainer
        autoClose={2500}
        />
      </DataProvider>
    </AuthProvider>
  </StrictMode>
);

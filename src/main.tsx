import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./context/auth";
import "./index.css";
import AppRoutes from "./routes/routes";
// Registra o Service Worker (PWA)
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("Nova versão disponível. Deseja atualizar?")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log("Aplicativo pronto para uso offline!");
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </React.StrictMode>,
);

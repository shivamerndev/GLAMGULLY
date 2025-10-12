import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import ProductContext from "./context/ProductContext.jsx";
import AdminContext from "./context/AdminContext.jsx";
import CustomerContext from "./context/CustomerContext.jsx";

createRoot(document.getElementById("root")).render(
  <CustomerContext>
    <AdminContext>
      <ProductContext>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ProductContext>
    </AdminContext>
  </CustomerContext>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((reg) => console.log("SW registered",import.meta.env.VITE_BASE_URL))
      .catch((err) => console.log("SW registration failed", err));
  })
}
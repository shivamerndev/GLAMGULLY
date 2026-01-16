import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import ProductContext from "./context/ProductContext.jsx";
import AdminContext from "./context/AdminContext.jsx";
import CustomerContext from "./context/CustomerContext.jsx";

const clientId = "550023540611-a5d7oqdk74emaeieckn26vrr4rmium04.apps.googleusercontent.com";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={clientId}>
    <CustomerContext>
      <AdminContext>
        <ProductContext>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ProductContext>
      </AdminContext>
    </CustomerContext>
  </GoogleOAuthProvider>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((reg) => console.log("SW registered"))
      .catch((err) => console.log("SW registration failed", err));
  })
}
import express from "express";
import adminRouter from "./routes/admin.route.js";
import productRouter from "./routes/product.route.js";
import customerRouter from "./routes/customer.route.js";
import oauthRouter from "./routes/oauth.route.js";
import paymentRouter from "./routes/payment.route.js";
import reviewRouter from "./routes/comment.route.js";
import imgreviewRouter from "./routes/review.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import connectDB from "./db/db.connect.js";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import admin from "firebase-admin";
import path from "path";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();
const _dirname = path.resolve();
// --- Firebase setup ---
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

connectDB();

// --- Middlewares ---
app.use(cors({
  origin: ["https://glamgully.vercel.app", "http://localhost:5173"],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- API Routes ---
app.post("/api/auth", oauthRouter);
app.get("/api/test", (req, res) => res.send("Welcome To Backend Of GlamGully."));
app.use("/api/admin", adminRouter);
app.use("/api/product", productRouter);
app.use("/api/customers", customerRouter);
app.use("/api/review", reviewRouter);
app.use("/api/pay", paymentRouter);
app.use("/api/img/review", imgreviewRouter);
app.use("/api", notificationRoutes);

// --- Serve Frontend ---
const frontendPath = path.join(_dirname, "/FRONTEND/dist");
app.use(express.static(frontendPath));

// Serve index.html for all non-API routes
app.get(/.*/, (req, res) => {
  res.sendFile(path.resolve(frontendPath, 'index.html'));
});

app.listen(port, () => console.log(`✅ Server running on port ${port}`));
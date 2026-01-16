import express from "express";
import { GoogleOAuth } from "../controllers/oauth.controller.js";
import { googleAuthMiddleware } from "../middlewares/customers.auth.js";
const router = express.Router();

router.post("/google", GoogleOAuth);
router.get("/profile",googleAuthMiddleware, GoogleOAuth);

export default router;  
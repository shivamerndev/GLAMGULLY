import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_ClIENT_ID);

export const GoogleOAuth = async (req, res) => {
    try {
        const { token } = req.body;
        // 1️⃣ Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { sub, email, name, picture } = payload;

        // 2️⃣ Create your own JWT
        const appToken = jwt.sign({ userId: sub, email, name, picture }, process.env.USER_SECRET_KEY, { expiresIn: "7d" });
        // 3️⃣ Send token as cookie (not in response body)
        res.cookie("token", appToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
        });


        res.json({ message: "Login successful" });
    } catch (error) {
        console.error("Google login error:", error);
        res.status(400).json({ error: "Invalid Google token" });
    }
}

export const getCustomerProfile = async (req, res) => {
    try {
        const customer = req.user
        if (!customer) return res.status(404).json({ message: "Customer not found" });
        console.log(customer)
        res.status(200).json(customer);
    } catch (error) { 
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
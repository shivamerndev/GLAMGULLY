import axios from "axios";
import User from "../models/customer.model.js"

export const googleAuth = async (req, res) => {
    const { accessToken } = req.body;
    try {
        // 🔍 Google se user data lao
        const googleRes = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", { headers: { Authorization: `Bearer ${accessToken}` } });
        const { email, name, sub } = googleRes.data;

        let user = await User.findOne({ email }); 
        console.log(user,googleRes.data);
        if (!user) {
            user = await User.create({
                fullname: name, 
                email: email,
                googleId: sub,
            });
        }

        const token = user.generateToken();

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        res.status(200).json({ message: "Google auth successful", token });

    } catch (err) {
        res.status(401).json({ message: "Google auth failed" });
    }
};
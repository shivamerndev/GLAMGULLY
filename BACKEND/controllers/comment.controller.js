import mongoose from "mongoose";
import commentModel from "../models/commentProduct.model.js";
import productModel from "../models/product.model.js";

export const addComment = async (req, res) => {
    try {
        const { productId, text, star } = req.body;

        // 1. Check if product exists
        const productExists = await productModel.exists({ _id: productId });
        if (!productExists) {
            return res.status(404).json({ message: "Product not found" });
        }

        // 2. Create new comment
        const newComment = await commentModel.create({ productId, text, star });

        // 3. Aggregate reviews stats
        const stats = await commentModel.aggregate([
            { $match: { productId: new mongoose.Types.ObjectId(productId) } },
            {
                $group: {
                    _id: "$productId",
                    reviewsCount: { $sum: 1 },
                    avgRating: { $avg: { $ifNull: ["$star", 0] } }
                }
            },
            {
                $project: {
                    reviewsCount: 1,
                    avgRating: { $round: ["$avgRating", 1] } // ✅ ek decimal place tak round
                }
            }
        ]);

        // 4. Stats set karo
        const reviewsCount = stats[0]?.reviewsCount || 0;
        const avgRating = stats[0]?.avgRating || 0;

        // 5. Product update karo
        const updatedProduct = await productModel.findByIdAndUpdate(
            productId,
            {
                $push: { reviews: newComment._id },
                $set: { reviewsCount, ratings: avgRating }
            },
            { new: true }
        );

        // 6. Response
        res.status(201).json({ message: "Comment added successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Error adding comment",
            error: error.message
        });
    }
};
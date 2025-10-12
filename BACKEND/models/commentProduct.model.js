import mongoose from "mongoose";

const commentProductSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    text: {
        type: String,
        required: true,
        trim: true
    },
    star: {
        type: Number,
    }
}, { timestamps: true });

const CommentProduct = mongoose.model("CommentProduct", commentProductSchema);

export default CommentProduct;
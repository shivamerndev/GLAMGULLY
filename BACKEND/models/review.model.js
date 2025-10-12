import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
    reviewpicture: {
        type: String,
        required:true,
        default: 'https://res.cloudinary.com/dgis42anh/image/upload/v1755582685/Screenshot_2025-05-25_205010_zsb3ed.png'
    },
}, { timestamps: true })

export default mongoose.model("reviewimg",reviewSchema)
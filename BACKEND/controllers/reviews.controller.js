import reviewModel from "../models/review.model.js";
import { getCloudinaryResponse } from "../utils/cloudinary.js";

export const createCustomerImage = async (req, res) => {
    const reviewimg = req.file;
    try {
        const geturl = await getCloudinaryResponse(reviewimg)
        const review = await reviewModel.create({
            reviewpicture: geturl
        })
        res.status(201).send(review)
    } catch (error) {
        res.status(500).send(error)
    }
}
export const readCustomerImage = async (req,res) => {
    try {
        const allReviews = await reviewModel.find().sort({createdAt: -1})
        res.status(200).send(allReviews)
    } catch (error) {
        res.status(500).send(error.message)
    }
}
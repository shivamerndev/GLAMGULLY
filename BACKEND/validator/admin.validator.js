import joi from "joi";

const validateAdmin = (admin) => {
    const schema = joi.object({
        fullname: joi.string().min(5).required(),
        username: joi.string().min(5).max(20).required(),
        email: joi.string().email().required(),
        password: joi.string().min(8).required(),
        gender: joi.string().valid("male", "female"),
        profilePicture: { type: String, default: 'https://img.freepik.com/premium-vector/business-graphic-design-concept-background_804788-215674.jpg' },
        phone: joi.string().min(10).required(),
    });
    return schema.validate(admin);
};

export default validateAdmin;

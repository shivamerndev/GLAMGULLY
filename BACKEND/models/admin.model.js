import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"

const adminSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        minlength: 8
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 10,
    },
    gender: {
        type: String,
        enum: ['male', 'female']
    },
    profilePicture: {
        type: String,
        default: 'https://res.cloudinary.com/dgis42anh/image/upload/v1755582685/Screenshot_2025-05-25_205010_zsb3ed.png'
    },
}, { timestamps: true });

adminSchema.statics.passwordhashkaro = async function (password) {
    try {
        const salt = await bcrypt.genSalt(10)
        const hasshedpassword = await bcrypt.hash(password, salt)
        return hasshedpassword
    } catch (error) {
        console.log(error)
    }
}

adminSchema.methods.passwordcomparekaro = async function (password) {
    return await bcrypt.compare(password, this.password);
}

adminSchema.methods.generateToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.ADMIN_SECRET_KEY, { expiresIn: '1h' });
    return token;
}

const Admin = mongoose.model('admin', adminSchema);

export default Admin;
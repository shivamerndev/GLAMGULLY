import mongoose from "mongoose";
const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true
  }
});

export default mongoose.model('Subscription', subscriptionSchema);
// models/Review.js
import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  revieweeRoom: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  revieweeUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', ReviewSchema);
export default Review;

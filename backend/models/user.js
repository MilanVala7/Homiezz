import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    aadharNumber: { type: String, required: true, unique: true },
    phone: { type: String },
    avatar: { type: String },
    preferences: {
      location: String,
      budget: Number,
      roommatePreferences: String,
      amenities: [String],
    },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    listedRooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],
    rentedRooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room"}],
    role: { type: String, enum: ["tenant", "owner"], default: "tenant" },
    roommateProfile: {
      isActive: { type: Boolean, default: false },
      bio: String,
      age: Number,
      gender: { type: String, enum: ["Male", "Female", "Other"] },
      occupation: String,
      occupationType: { 
        type: String, 
        enum: ["Student", "Working Professional", "Freelancer", "Other"] 
      },
      budget: Number,
      moveInDate: Date,
      locationPreference: String,
      currentLocation: String,
      lifestyle: {
        smoking: { type: String, enum: ["Non-Smoker", "Social Smoker", "Smoker"] },
        drinking: { type: String, enum: ["Non-Drinker", "Social Drinker", "Drinker"] },
        pets: { type: String, enum: ["Pet Friendly", "No Pets"] },
        diet: { type: String, enum: ["Vegetarian", "Non-Vegetarian", "Vegan", "No Preference"] },
        sleepSchedule: { type: String, enum: ["Early Bird", "Night Owl", "Flexible"] }
      },
      interests: [String],
      roommatePreferences: {
        genderPreference: { type: String, enum: ["Male", "Female", "Any"] },
        ageRange: {
          min: Number,
          max: Number
        },
        occupationPreference: [String]
      },
      updatedAt: { type: Date, default: Date.now }
    },
  },
  { timestamps: true }
);

// Method to compare password
UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

const User = mongoose.model("User", UserSchema);
export default User;

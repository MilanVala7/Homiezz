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
  },
  { timestamps: true }
);

// Method to compare password
UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

const User = mongoose.model("User", UserSchema);
export default User;

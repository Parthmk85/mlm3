import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        phone: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        referralCode: { type: String, unique: true },
        referredBy: { type: String }, // Referral code of the person who referred this user
        status: {
            type: String,
            enum: ["pending", "active"],
            default: "pending",
        },
        walletBalance: { type: Number, default: 0 },
        vipLevel: { type: Number, default: 0 },
        role: { type: String, enum: ["user", "admin"], default: "user" },
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, phone, password, referredBy } = body;

        await connectDB();

        // Check if user already exists
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return NextResponse.json(
                { message: "User with this phone number already exists" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a unique referral code
        let referralCode;
        let isUnique = false;
        while (!isUnique) {
            referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            const existingCode = await User.findOne({ referralCode });
            if (!existingCode) isUnique = true;
        }

        const newUser = new User({
            name,
            phone,
            password: hashedPassword,
            referralCode,
            referredBy: referredBy || null,
            status: "pending",
            walletBalance: 0,
            vipLevel: 0,
        });

        await newUser.save();

        return NextResponse.json(
            { message: "User registered successfully", referralCode },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: error.message || "An error occurred during registration" },
            { status: 500 }
        );
    }
}

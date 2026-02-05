import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const user = await User.findById(session.user.id);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Calculate team count and get members
        const teamMembers = await User.find({ referredBy: user.referralCode })
            .select("name phone status createdAt")
            .sort({ createdAt: -1 });

        return NextResponse.json({
            name: user.name,
            phone: user.phone,
            referralCode: user.referralCode,
            status: user.status,
            walletBalance: user.walletBalance,
            vipLevel: user.vipLevel || 0,
            role: user.role,
            teamCount: teamMembers.length,
            teamMembers,
            directIncome: 0, // Placeholder
        });
    } catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json(
            { message: "An error occurred while fetching user data" },
            { status: 500 }
        );
    }
}

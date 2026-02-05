import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Transaction from "@/models/Transaction";

const COMMISSIONS = [0.10, 0.05, 0.02]; // 10%, 5%, 2%

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { transactionId, status } = await req.json(); // status: 'approved' or 'rejected'

        await connectDB();

        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
        }

        if (transaction.status !== "pending") {
            return NextResponse.json({ message: "Transaction already processed" }, { status: 400 });
        }

        if (status === "rejected") {
            transaction.status = "rejected";
            await transaction.save();
            return NextResponse.json({ message: "Transaction rejected" });
        }

        // Approve logic
        transaction.status = "approved";
        await transaction.save();

        // Activate User
        const user = await User.findById(transaction.userId);
        if (user) {
            user.status = "active";
            await user.save();

            // Distribute Commissions
            let currentReferredBy = user.referredBy;
            const amountPaid = transaction.amount;

            for (let i = 0; i < COMMISSIONS.length; i++) {
                if (!currentReferredBy) break;

                const uplineUser = await User.findOne({ referralCode: currentReferredBy });
                if (!uplineUser) break;

                const commission = amountPaid * COMMISSIONS[i];
                uplineUser.walletBalance += commission;
                await uplineUser.save();

                // Move to next level
                currentReferredBy = uplineUser.referredBy;
            }
        }

        return NextResponse.json({ message: "Transaction approved and commissions distributed" });
    } catch (error) {
        console.error("Approval error:", error);
        return NextResponse.json(
            { message: "An error occurred during approval" },
            { status: 500 }
        );
    }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Transaction from "@/models/Transaction";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { userId, amount, transactionId, screenshotURL } = await req.json();

        if (!userId || !amount || !transactionId || !screenshotURL) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        await connectDB();

        // Check if transaction ID already exists
        const existingTransaction = await Transaction.findOne({ transactionId });
        if (existingTransaction) {
            return NextResponse.json(
                { message: "This Transaction ID has already been submitted" },
                { status: 400 }
            );
        }

        const newTransaction = new Transaction({
            userId,
            amount,
            transactionId,
            screenshotURL,
            status: "pending",
        });

        await newTransaction.save();

        return NextResponse.json(
            { message: "Transaction submitted successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Transaction submission error:", error);
        return NextResponse.json(
            { message: "An error occurred while submitting transaction" },
            { status: 500 }
        );
    }
}

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const transactions = await Transaction.find({ status: "pending" })
            .populate("userId", "name phone")
            .sort({ createdAt: -1 });

        return NextResponse.json(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return NextResponse.json(
            { message: "An error occurred while fetching transactions" },
            { status: 500 }
        );
    }
}

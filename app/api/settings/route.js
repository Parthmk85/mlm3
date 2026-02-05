import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Settings from "@/models/Settings";

export async function GET(req) {
    try {
        await connectDB();
        const settings = await Settings.find({});
        const result = {};
        settings.forEach(s => {
            result[s.key] = s.value;
        });
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { key, value } = body;

        await connectDB();
        await Settings.findOneAndUpdate(
            { key },
            { value },
            { upsert: true, new: true }
        );

        return NextResponse.json({ message: "Updated" });
    } catch (error) {
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}

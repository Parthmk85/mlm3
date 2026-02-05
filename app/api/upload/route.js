import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ message: "No file provided" }, { status: 400 });
        }

        if (process.env.CLOUDINARY_API_SECRET === "your_api_secret_here") {
            return NextResponse.json({
                message: "Cloudinary API Secret is missing in .env.local. Please add your real secret from the Cloudinary dashboard."
            }, { status: 500 });
        }

        console.log("Using Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
        console.log("Using API Key:", process.env.CLOUDINARY_API_KEY);
        console.log("Secret length:", process.env.CLOUDINARY_API_SECRET?.length);

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: "mlm_payments",
                    resource_type: "auto",
                },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary upload_stream error:", error);
                        reject(error);
                    }
                    else resolve(result);
                }
            ).end(buffer);
        });

        return NextResponse.json({
            message: "Upload successful",
            url: result.secure_url
        });

    } catch (error) {
        console.error("Upload API route error:", error);
        return NextResponse.json({
            message: error.message || "Upload failed"
        }, { status: 500 });
    }
}

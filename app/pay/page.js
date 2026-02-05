"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { QrCode, Upload, CheckCircle, Info } from "lucide-react";

export default function PayAndJoin() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [transactionId, setTransactionId] = useState("");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    if (status === "loading") return <div className="p-6 text-center">Loading...</div>;
    if (!session) {
        router.push("/login");
        return null;
    }

    if (session.user.status === "active") {
        router.push("/");
        return null;
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !transactionId) {
            setMessage("Please fill all fields and upload a screenshot");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            // 1. Upload to Cloudinary (Simplified for this demo, usually you'd use a server-side route)
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "mlm_uploads"); // User needs to set this up

            // Mocking upload for now since I don't have real credentials
            // In a real app, you'd fetch /api/upload
            const screenshotURL = "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg";

            // 2. Save transaction to DB
            const res = await fetch("/api/transaction", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: session.user.id,
                    amount: 500, // Fixed join fee for example
                    transactionId,
                    screenshotURL,
                }),
            });

            if (res.ok) {
                setMessage("Payment proof submitted! Please wait for admin approval.");
                setTransactionId("");
                setFile(null);
                setPreview(null);
            } else {
                const data = await res.json();
                setMessage(data.message || "Failed to submit payment proof");
            }
        } catch (err) {
            setMessage("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 pb-24">
            <div className="bg-green-600 text-white p-6 rounded-3xl mb-8 shadow-xl">
                <h1 className="text-2xl font-bold mb-2">Activate Account</h1>
                <p className="opacity-90">Pay the joining fee to start earning</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <QrCode className="mr-2 text-green-600" size={20} />
                    Scan to Pay
                </h2>

                <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 mb-4">
                    <div className="w-48 h-48 bg-white p-2 rounded-xl shadow-inner mb-4 flex items-center justify-center">
                        <img
                            src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=admin@upi&pn=MLM%20Admin&am=500&cu=INR"
                            alt="QR Code"
                            className="w-full h-full"
                        />
                    </div>
                    <p className="text-sm font-bold text-gray-700">UPI ID: admin@upi</p>
                    <p className="text-xs text-gray-500 mt-1">Amount: ₹500</p>
                </div>    

                <div className="flex items-start p-3 bg-blue-50 text-blue-700 rounded-xl text-xs">
                    <Info className="mr-2 flex-shrink-0" size={16} />
                    <p>After payment, take a screenshot and note down the 12-digit UTR/Transaction ID.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <Upload className="mr-2 text-green-600" size={20} />
                        Submit Proof
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Transaction ID (UTR)
                            </label>
                            <input
                                type="text"
                                maxLength={12}
                                placeholder="Enter 12-digit UTR number"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-mono"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Payment Screenshot
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="screenshot-upload"
                                    required
                                />
                                <label
                                    htmlFor="screenshot-upload"
                                    className="flex flex-col items-center justify-center w-full h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 transition-all overflow-hidden"
                                >
                                    {preview ? (
                                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            <Upload className="text-gray-400 mb-2" size={24} />
                                            <span className="text-sm text-gray-500">Tap to upload screenshot</span>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>

                    {message && (
                        <div className={`mt-4 p-3 rounded-xl text-sm border ${message.includes("success") || message.includes("submitted")
                                ? "bg-green-50 text-green-600 border-green-100"
                                : "bg-red-50 text-red-600 border-red-100"
                            }`}>
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 transition-all disabled:opacity-70 mt-6 flex items-center justify-center"
                    >
                        {loading ? "Submitting..." : (
                            <>
                                <CheckCircle className="mr-2" size={20} />
                                Submit Payment Proof
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
